import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wnbckffbhhmxxjbetzvs.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_nc4EgAvRw9x3jQIYXQ1-Jw_BBfHGSC8';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
