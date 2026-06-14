# Supabase Setup for StayEase

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. Note your Project URL and anon public key from Settings -> API.

## 2. Run SQL Schema

1. Open SQL Editor in your Supabase dashboard.
2. Paste and run `complete_setup.sql` to create tables, grants, RLS policies, and triggers.
3. For only a tiny sample, paste and run `seed.sql`.

## 3. Import the 5000 Hotels

Do not paste `data/hotels.sql` into Supabase SQL Editor if it fails because the query is too large.

Use one of these instead.

### Option A: One Command From This Project

Keep your local root `.env` updated with `DATABASE_URL`, then run:

```bash
npm run setup:supabase-db
```

This creates the Supabase schema, auth profile trigger, grants, RLS policies, and upserts all 5000 generated hotels. To wipe current hotel rows before import, run:

```bash
npm run setup:supabase-db -- --reset-hotels
```

### Option B: SQL Editor Chunks

Run these files in order:

1. `complete_setup.sql`
2. `hotel_import/00_prepare_import.sql`
3. Optional clean reset: `hotel_import/00_clear_hotels.sql`
4. `hotel_import/part_01.sql` through `hotel_import/part_20.sql`

Each chunk is safe to rerun because it upserts on `hotel_name`.

### Option C: Direct Postgres Seed

Set `DATABASE_URL` or `POSTGRES_URL` to your Supabase Postgres connection string, then run:

```bash
npm run seed:postgres:hotels -- --setup --clear
```

Use `--setup` to run `complete_setup.sql` first. Use `--clear` only when you want to replace current hotel data.

## 4. Configure Authentication

1. Go to Authentication -> Providers -> Email.
2. Enable Email provider.
3. For development, disable "Confirm email" under Email settings if needed.
4. Add your site URL under Authentication -> URL Configuration:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/reset-password`, `http://localhost:5173/reset-password`

## 5. Environment Variables

Add to `client/.env` locally and Vercel dashboard for production:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
VITE_SITE_URL=https://your-app.vercel.app
VITE_SITE_NAME=StayEase
```

For the direct Postgres seed script, add this only to your local root `.env`; never expose it in the browser:

```env
DATABASE_URL=postgresql://postgres.<project-ref>:<db-password>@aws-0-<region>.pooler.supabase.com:6543/postgres?sslmode=require
```

## Database Tables

| Table | Description |
|-------|-------------|
| `profiles` | User profiles, auto-created on signup |
| `hotels` | Hotel listings |
| `rooms` | Room types per hotel |
| `bookings` | User reservations |
| `reviews` | Hotel reviews |
| `wishlist` | Saved hotels |
| `contact_messages` | Contact form submissions |
