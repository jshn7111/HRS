# StayEase — Hotel Room Booking Platform

StayEase is a modern hotel booking platform built with **React + Vite**, **Supabase** (auth + PostgreSQL), and deployed on **Vercel**.

---

## Features

- Responsive UI across mobile, tablet, and desktop
- Supabase authentication (sign up, login, password reset)
- Hotel search, listing, and detail pages
- User dashboard with booking history
- SEO optimized (meta tags, JSON-LD, sitemap, llms.txt)
- Contact form stored in Supabase
- FAQ with structured data for search engines

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Redux Toolkit, React Router |
| Backend | Supabase (PostgreSQL + Auth + RLS) |
| SEO | react-helmet-async, JSON-LD, sitemap.xml, llms.txt |
| Deployment | Vercel |

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/jshn7111/HRS.git
cd HRS
npm install
```

### 2. Set Up Supabase

See [supabase/README.md](supabase/README.md) for full instructions.

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` then `supabase/seed.sql` in the SQL Editor
3. Copy your API keys

### 3. Environment Variables

Create `client/.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SITE_URL=http://localhost:5173
VITE_SITE_NAME=StayEase
```

### 4. Run Locally

```bash
npm run start:client
```

Open [http://localhost:5173](http://localhost:5173)

---

## Deploy to Vercel

1. Push code to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SITE_URL` (your Vercel URL)
   - `VITE_SITE_NAME`
4. Deploy — `vercel.json` is pre-configured

---

## Project Structure

```
HRS/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/      # Route pages
│   │   ├── services/   # Supabase API calls
│   │   ├── context/    # Auth provider
│   │   └── styles/     # Global CSS
│   └── public/         # Static assets, SEO files
├── supabase/
│   ├── schema.sql      # Database schema + RLS
│   └── seed.sql        # Sample hotel data
└── vercel.json         # Vercel deployment config
```

---

## License

MIT
