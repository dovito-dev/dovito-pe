
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pvwwqylkmieyaiwukwwu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2d3dxeWxrbWlleWFpd3Vrd3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjE1MDMsImV4cCI6MjA2MDgzNzUwM30.1I1L5buDhBccaWHab0UVqOlvo2ngGyurpLFlY-7lX5M";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
