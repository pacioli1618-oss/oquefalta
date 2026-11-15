import {createClient} from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (see .env.example).');
}

// No Supabase Auth: having the list link (slug) is the permission. The browser only calls
// the public.of_* RPCs; the tables live in the private "oqfalta" schema.
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {persistSession: false, autoRefreshToken: false, detectSessionInUrl: false},
});
