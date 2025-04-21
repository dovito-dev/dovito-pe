
import { createClient } from '@supabase/supabase-js';

// Provide fallback values for local development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  name: string;
  email: string;
  plan: string;
};

export type Build = {
  id: string;
  user_id: string;
  bot: string;
  request: string;
  status: string;
  result: string;
  created_at: string;
};
