const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env');
const importDir = path.join(rootDir, 'supabase', 'hotel_import');

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return fs
    .readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .reduce((env, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        return env;
      }

      const separatorIndex = trimmed.indexOf('=');
      if (separatorIndex === -1) {
        return env;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      let value = trimmed.slice(separatorIndex + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      env[key] = value;
      return env;
    }, {});
}

function getConnectionString() {
  const fileEnv = loadEnv(envPath);
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.SUPABASE_DB_URL ||
    fileEnv.DATABASE_URL ||
    fileEnv.POSTGRES_URL ||
    fileEnv.SUPABASE_DB_URL
  );
}

function getSqlFiles(options) {
  const files = [path.join(rootDir, 'supabase', 'complete_setup.sql')];

  if (!options.schemaOnly) {
    files.push(path.join(importDir, '00_prepare_import.sql'));

    if (options.resetHotels) {
      files.push(path.join(importDir, '00_clear_hotels.sql'));
    }

    files.push(
      ...fs
        .readdirSync(importDir)
        .filter((file) => /^part_\d+\.sql$/i.test(file))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .map((file) => path.join(importDir, file))
    );
  }

  return files;
}

function redactedDatabaseLabel(connectionString) {
  try {
    const url = new URL(connectionString);
    return `${url.protocol}//${url.username}:***@${url.host}${url.pathname}`;
  } catch {
    return 'configured database';
  }
}

async function runSqlFile(client, filePath) {
  const relativePath = path.relative(rootDir, filePath);
  const sql = fs.readFileSync(filePath, 'utf8');

  process.stdout.write(`Running ${relativePath} ... `);
  await client.query(sql);
  console.log('done');
}

async function verify(client) {
  const { rows: hotelRows } = await client.query(`
    SELECT
      COUNT(*)::int AS total_hotels,
      COUNT(DISTINCT city)::int AS cities,
      COUNT(*) FILTER (WHERE latitude IS NOT NULL AND longitude IS NOT NULL)::int AS geocoded_hotels
    FROM public.hotels;
  `);

  const { rows: cityRows } = await client.query(`
    SELECT city, COUNT(*)::int AS total
    FROM public.hotels
    GROUP BY city
    ORDER BY total DESC, city ASC
    LIMIT 12;
  `);

  const { rows: authRows } = await client.query(`
    SELECT EXISTS (
      SELECT 1
      FROM pg_trigger
      WHERE tgname = 'on_auth_user_created'
    ) AS auth_profile_trigger_ready;
  `);

  const { rows: rlsRows } = await client.query(`
    SELECT relname AS table_name, relrowsecurity AS rls_enabled
    FROM pg_class
    WHERE oid IN (
      'public.profiles'::regclass,
      'public.hotels'::regclass,
      'public.rooms'::regclass,
      'public.bookings'::regclass,
      'public.reviews'::regclass,
      'public.wishlist'::regclass,
      'public.contact_messages'::regclass
    )
    ORDER BY relname;
  `);

  console.log('\nVerification');
  console.table(hotelRows);
  console.table(cityRows);
  console.table(authRows);
  console.table(rlsRows);
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const options = {
    resetHotels: args.has('--reset-hotels'),
    schemaOnly: args.has('--schema-only'),
  };
  const connectionString = getConnectionString();

  if (!connectionString) {
    throw new Error('DATABASE_URL is missing. Add it to .env or export it before running this script.');
  }

  const files = getSqlFiles(options);
  const missingFiles = files.filter((file) => !fs.existsSync(file));
  if (missingFiles.length > 0) {
    throw new Error(`Missing SQL files:\n${missingFiles.map((file) => `- ${file}`).join('\n')}`);
  }

  console.log(`Connecting to ${redactedDatabaseLabel(connectionString)}`);
  if (options.schemaOnly) {
    console.log('Mode: schema only');
  } else if (options.resetHotels) {
    console.log('Mode: schema + reset hotels + import 5000 hotels');
  } else {
    console.log('Mode: schema + upsert 5000 hotels');
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  try {
    for (const file of files) {
      await runSqlFile(client, file);
    }
    await verify(client);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('\nSupabase database setup failed.');
  console.error(error.message);
  if (error.position) {
    console.error(`SQL position: ${error.position}`);
  }
  process.exitCode = 1;
});
