import { createClient } from '@supabase/supabase-js';

// Same "placeholder until you set it up" pattern as WEBHOOK_URL in
// backend.js. Get these from your Supabase project: Settings → API →
// Project URL and anon/public key. The anon key is SAFE to ship in client
// code — Supabase's security model relies on Row Level Security policies
// enforced in Postgres, not on hiding this key. Never put a service_role
// key or the Anthropic API key here; those stay server-side as Edge
// Function secrets (see supabase/functions/chat).
export const SUPABASE_URL = 'PASTE_YOUR_SUPABASE_PROJECT_URL_HERE';
export const SUPABASE_ANON_KEY = 'PASTE_YOUR_SUPABASE_ANON_KEY_HERE';

const isConfigured = SUPABASE_URL && !SUPABASE_URL.startsWith('PASTE_YOUR')
  && SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.startsWith('PASTE_YOUR');

// Exported so the UI can show "not set up yet" instead of a confusing
// runtime crash when someone reaches /dashboard before Supabase is wired in.
export const supabaseConfigured = isConfigured;

export const supabase = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
