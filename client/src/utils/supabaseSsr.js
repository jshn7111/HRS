// This file is intentionally minimal for the Vite/React app.
// Supabase session refresh is handled via the browser client + auth listeners.

import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseBrowser = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
  // No custom cookies handling in a pure client app.
);

