import { createClient } from '@supabase/supabase-js';

// Use a dummy URL fallback so createClient NEVER throws a fatal error
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy-placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key';

if (supabaseUrl === 'https://dummy-placeholder.supabase.co') {
  console.warn('⚠️ Supabase URL is missing. App is using a placeholder. Check .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);