# Supabase Setup for StayEase

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. Note your **Project URL** and **anon public key** from Settings → API.

## 2. Run SQL Schema

1. Open **SQL Editor** in your Supabase dashboard.
2. Paste and run `schema.sql` — creates tables, RLS policies, and triggers.
3. Paste and run `seed.sql` — inserts sample hotels and rooms.

## 3. Configure Authentication

1. Go to **Authentication → Providers → Email**.
2. Enable Email provider.
3. For development, disable "Confirm email" under Email settings (optional).
4. Add your site URL under **Authentication → URL Configuration**:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/reset-password`, `http://localhost:5173/reset-password`

## 4. Environment Variables

Add to `client/.env` (local) and Vercel dashboard (production):

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
VITE_SITE_URL=https://your-app.vercel.app
VITE_SITE_NAME=StayEase
```

## Database Tables

| Table | Description |
|-------|-------------|
| `profiles` | User profiles (auto-created on signup) |
| `hotels` | Hotel listings |
| `rooms` | Room types per hotel |
| `bookings` | User reservations |
| `reviews` | Hotel reviews |
| `wishlist` | Saved hotels |
| `contact_messages` | Contact form submissions |
