
import { createClient } from '@supabase/supabase-js';
import type { Database }  from './types';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
  throw new Error('Supabase environment variables are missing');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
