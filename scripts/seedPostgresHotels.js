const fs = require('node:fs/promises');
const path = require('node:path');

try {
  require('dotenv').config();
} catch {
  // dotenv is optional for this seed script.
}

const ROOT_DIR = path.resolve(__dirname, '..');
const HOTELS_JSON = path.join(ROOT_DIR, 'data', 'hotels.json');
const COMPLETE_SETUP_SQL = path.join(ROOT_DIR, 'supabase', 'complete_setup.sql');
const BATCH_SIZE = Number.parseInt(process.env.HOTELS_SEED_BATCH_SIZE || '500', 10);

const BASE_COLUMNS = [
  'id',
  'hotel_name',
  'city',
  'state',
  'address',
  'latitude',
  'longitude',
  'star_rating',
  'review_score',
  'review_count',
  'price_per_night',
  'category',
  'amenities',
  'description',
  'image_url',
  'phone',
  'email',
  'created_at',
];

const APP_COLUMNS = [
  'name',
  'slug',
  'location',
  'country',
  'images',
  'rating',
  'price_from',
  'is_verified',
  'is_featured',
];

const COLUMNS = [...BASE_COLUMNS, ...APP_COLUMNS];

const REQUIRED_COLUMNS = [
  'id',
  'hotel_name',
  'city',
  'address',
  'latitude',
  'longitude',
  'amenities',
  'name',
  'slug',
  'location',
  'images',
  'price_from',
];

const CONFLICT_UPDATE_COLUMNS = COLUMNS.filter((column) => !['id', 'hotel_name', 'created_at'].includes(column));

async function loadPg() {
  try {
    return require('pg');
  } catch {
    throw new Error('Missing dependency "pg". Run: npm install');
  }
}

function getArgs() {
  const args = new Set(process.argv.slice(2));
  return {
    clear: args.has('--clear'),
    setup: args.has('--setup'),
  };
}

function getConnectionString() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error(
      'Set DATABASE_URL or POSTGRES_URL before running this script. Use the Supabase pooled/direct Postgres connection string.'
    );
  }
  return connectionString;
}

function shouldUseSsl(connectionString) {
  try {
    const { hostname } = new URL(connectionString);
    return !['localhost', '127.0.0.1', '::1'].includes(hostname);
  } catch {
    return true;
  }
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toDbHotel(hotel) {
  const slug = `${slugify(hotel.hotel_name)}-${hotel.id}`;

  return {
    ...hotel,
    star_rating: Number(hotel.star_rating),
    review_score: Number(hotel.review_score),
    price_per_night: Number(hotel.price_per_night),
    name: hotel.hotel_name,
    slug,
    location: hotel.address,
    country: 'India',
    images: hotel.image_url ? [hotel.image_url] : [],
    rating: Number(hotel.review_score || 0),
    price_from: Number(hotel.price_per_night || 0),
    is_verified: true,
    is_featured:
      Number(hotel.review_score || 0) >= 4.7 &&
      ['Premium', 'Luxury'].includes(hotel.category),
  };
}

function buildInsert(hotels) {
  const values = [];
  const rowSql = hotels.map((hotel, rowIndex) => {
    const placeholders = COLUMNS.map((column, columnIndex) => {
      values.push(hotel[column]);
      return `$${rowIndex * COLUMNS.length + columnIndex + 1}`;
    });
    return `(${placeholders.join(', ')})`;
  });

  const updates = CONFLICT_UPDATE_COLUMNS.map((column) => `${column} = EXCLUDED.${column}`).join(', ');

  return {
    text: `
      INSERT INTO public.hotels (${COLUMNS.join(', ')})
      VALUES ${rowSql.join(', ')}
      ON CONFLICT (hotel_name) DO UPDATE SET
        ${updates},
        updated_at = NOW()
    `,
    values,
  };
}

async function runSetup(client) {
  const setupSql = await fs.readFile(COMPLETE_SETUP_SQL, 'utf8');
  await client.query(setupSql);
}

async function assertHotelsTableReady(client) {
  const tableResult = await client.query("SELECT to_regclass('public.hotels') AS table_name");
  if (!tableResult.rows[0]?.table_name) {
    throw new Error('public.hotels does not exist. Run supabase/complete_setup.sql first or rerun with --setup.');
  }

  const columnsResult = await client.query(
    `
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'hotels'
    `
  );

  const columns = new Map(columnsResult.rows.map((row) => [row.column_name, row.data_type]));
  const missingColumns = REQUIRED_COLUMNS.filter((column) => !columns.has(column));
  if (missingColumns.length) {
    throw new Error(
      `public.hotels is missing columns: ${missingColumns.join(', ')}. Run supabase/complete_setup.sql on the target database first.`
    );
  }

  if (columns.get('id') !== 'integer') {
    throw new Error(
      `public.hotels.id is ${columns.get('id')}, but the 5000-hotel import expects integer ids. Use supabase/complete_setup.sql for this dataset.`
    );
  }

}

async function ensureHotelNameConstraint(client) {
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'hotels_hotel_name_key'
          AND conrelid = 'public.hotels'::regclass
      ) THEN
        ALTER TABLE public.hotels
          ADD CONSTRAINT hotels_hotel_name_key UNIQUE (hotel_name);
      END IF;
    END $$;
  `);
}

async function main() {
  const { clear, setup } = getArgs();
  const { Pool } = await loadPg();
  const connectionString = getConnectionString();
  const pool = new Pool({
    connectionString,
    ssl: shouldUseSsl(connectionString) ? { rejectUnauthorized: false } : undefined,
  });
  const client = await pool.connect();

  try {
    if (setup) {
      console.log('Running supabase/complete_setup.sql...');
      await runSetup(client);
    }

    await assertHotelsTableReady(client);

    const hotels = JSON.parse(await fs.readFile(HOTELS_JSON, 'utf8')).map(toDbHotel);

    if (clear) {
      console.log('Clearing existing hotels and dependent rows...');
      await client.query('TRUNCATE TABLE public.hotels RESTART IDENTITY CASCADE');
    }

    await ensureHotelNameConstraint(client);

    for (let i = 0; i < hotels.length; i += BATCH_SIZE) {
      const batch = hotels.slice(i, i + BATCH_SIZE);
      await client.query(buildInsert(batch));
      console.log(`Seeded ${Math.min(i + BATCH_SIZE, hotels.length)} / ${hotels.length}`);
    }

    const countResult = await client.query('SELECT COUNT(*)::int AS count FROM public.hotels WHERE hotel_name IS NOT NULL');
    console.log(`Done. public.hotels now has ${countResult.rows[0].count} generated hotel rows.`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
