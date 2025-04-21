
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

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
