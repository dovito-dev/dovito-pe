
import { createClient } from '@supabase/supabase-js';
import type { Database }  from './types';

// Try to get environment variables from different sources
const getSupabaseUrl = () => {
  // Check if window.env is available (for production builds)
  if (window.env && window.env.VITE_SUPABASE_URL) {
    return window.env.VITE_SUPABASE_URL;
  }
  
  // Check if Vite env vars are available (for development)
  if (import.meta.env.VITE_SUPABASE_URL) {
    return import.meta.env.VITE_SUPABASE_URL;
  }
  
  // Fallback to hardcoded URL only in last resort
  return 'https://pvwwqylkmieyaiwukwwu.supabase.co';
};

const getSupabaseAnonKey = () => {
  // Check if window.env is available (for production builds)
  if (window.env && window.env.VITE_SUPABASE_ANON_KEY) {
    return window.env.VITE_SUPABASE_ANON_KEY;
  }
  
  // Check if Vite env vars are available (for development)
  if (import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return import.meta.env.VITE_SUPABASE_ANON_KEY;
  }
  
  // Fallback to hardcoded key only in last resort
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2d3dxeWxrbWlleWFpd3Vrd3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjE1MDMsImV4cCI6MjA2MDgzNzUwM30.1I1L5buDhBccaWHab0UVqOlvo2ngGyurpLFlY-7lX5M';
};

const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = getSupabaseAnonKey();

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
