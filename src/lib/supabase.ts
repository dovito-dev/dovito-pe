
import { createClient } from '@supabase/supabase-js';

// Use the client from our integrations folder instead
export { supabase } from '@/integrations/supabase/client';

export type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  plan: string;
};

export type Build = {
  id: string;
  user_id: string;
  bot: string;
  request: string;
  status: string;
  result: string | null;
  created_at: string;
};
