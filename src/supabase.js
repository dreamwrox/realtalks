import { createClient } from "@supabase/supabase-js";

// These come from your .env file (locally) or Vercel env vars (deployed).
// The anon key is SAFE to expose in the browser — it only works within the
// security rules you set up in supabase-setup.sql. That is by design.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const configured = Boolean(url && anonKey);
export const supabase = configured ? createClient(url, anonKey) : null;
