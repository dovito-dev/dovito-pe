
import { createClient } from '@supabase/supabase-js';
import type { Database }  from './types';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.');
}

export const supabase = createClient<Database>(
  supabaseUrl || 'https://pvwwqylkmieyaiwukwwu.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2d3dxeWxrbWlleWFpd3Vrd3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjE1MDMsImV4cCI6MjA2MDgzNzUwM30.1I1L5buDhBccaWHab0UVqOlvo2ngGyurpLFlY-7lX5M'
);
