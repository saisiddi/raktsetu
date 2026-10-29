import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishKey);

export const supabaseConfig = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
