const fs = require('node:fs/promises');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');
const HOTELS_JSON = path.join(ROOT_DIR, 'data', 'hotels.json');
const OUTPUT_DIR = path.join(ROOT_DIR, 'supabase', 'hotel_import');
const CHUNK_SIZE = 250;

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
const CONFLICT_UPDATE_COLUMNS = COLUMNS.filter((column) => !['id', 'hotel_name', 'created_at'].includes(column));

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toImportHotel(hotel) {
  return {
    ...hotel,
    name: hotel.hotel_name,
    slug: `${slugify(hotel.hotel_name)}-${hotel.id}`,
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

function sqlValue(value) {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlArray(values) {
  return `ARRAY[${values.map(sqlValue).join(', ')}]::text[]`;
}

function rowSql(hotel) {
  return `(${COLUMNS.map((column) => {
    const value = hotel[column];
    return Array.isArray(value) ? sqlArray(value) : sqlValue(value);
  }).join(', ')})`;
}

function buildInsertSql(hotels, partNumber, totalParts) {
  const updates = CONFLICT_UPDATE_COLUMNS.map((column) => `${column} = EXCLUDED.${column}`).join(',\n  ');

  return `-- StayEase hotels import chunk ${partNumber} of ${totalParts}
-- Run supabase/complete_setup.sql and 00_prepare_import.sql before these chunks.
-- Safe to re-run: existing hotel_name rows are updated.

INSERT INTO public.hotels (
  ${COLUMNS.join(',\n  ')}
) VALUES
${hotels.map(rowSql).join(',\n')}
ON CONFLICT (hotel_name) DO UPDATE SET
  ${updates},
  updated_at = NOW();
`;
}

function buildPrepareSql() {
  return `-- Run this after supabase/complete_setup.sql and before part_*.sql files.
-- It validates that the target table matches the generated hotel import.

DO $$
DECLARE
  hotel_id_type TEXT;
BEGIN
  IF to_regclass('public.hotels') IS NULL THEN
    RAISE EXCEPTION 'public.hotels does not exist. Run supabase/complete_setup.sql first.';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'hotels'
      AND column_name = 'hotel_name'
  ) THEN
    RAISE EXCEPTION 'public.hotels.hotel_name is missing. Run supabase/complete_setup.sql before importing hotels.';
  END IF;

  SELECT data_type
  INTO hotel_id_type
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'hotels'
    AND column_name = 'id';

  IF hotel_id_type <> 'integer' THEN
    RAISE EXCEPTION 'public.hotels.id must be integer for this import, found %', hotel_id_type;
  END IF;

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
`;
}

function buildReadme(totalHotels, totalParts) {
  const files = Array.from({ length: totalParts }, (_, index) => {
    const part = String(index + 1).padStart(2, '0');
    return `${index + 4}. Run \`part_${part}.sql\``;
  }).join('\n');

  return `# Supabase Hotel Import Chunks

The single \`data/hotels.sql\` file is large, so the 5000 hotels are split into ${totalParts} smaller chunks of ${CHUNK_SIZE} rows each.

Run order in Supabase SQL Editor:

1. Run \`../complete_setup.sql\`
2. Run \`00_prepare_import.sql\`
3. Optional: run \`00_clear_hotels.sql\` if you want a clean hotel table
${files}

Total hotels: ${totalHotels}

Each chunk uses \`ON CONFLICT (hotel_name) DO UPDATE\`, so re-running a chunk refreshes existing rows instead of duplicating hotels.
`;
}

async function cleanOutputDir() {
  await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
}

async function main() {
  const hotels = JSON.parse(await fs.readFile(HOTELS_JSON, 'utf8'));
  const totalParts = Math.ceil(hotels.length / CHUNK_SIZE);

  await cleanOutputDir();

  await fs.writeFile(
    path.join(OUTPUT_DIR, '00_prepare_import.sql'),
    buildPrepareSql()
  );

  await fs.writeFile(
    path.join(OUTPUT_DIR, '00_clear_hotels.sql'),
    `-- Optional clean import helper.
-- Run only if you want to remove all current hotels and dependent rooms/bookings/reviews/wishlist rows.
DELETE FROM hotels;
`
  );

  for (let index = 0; index < totalParts; index += 1) {
    const chunk = hotels.slice(index * CHUNK_SIZE, (index + 1) * CHUNK_SIZE).map(toImportHotel);
    const part = String(index + 1).padStart(2, '0');
    await fs.writeFile(path.join(OUTPUT_DIR, `part_${part}.sql`), buildInsertSql(chunk, index + 1, totalParts));
  }

  await fs.writeFile(path.join(OUTPUT_DIR, 'README.md'), buildReadme(hotels.length, totalParts));

  console.log(`Wrote ${totalParts} hotel import chunks to ${path.relative(ROOT_DIR, OUTPUT_DIR)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
