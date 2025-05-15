
// Use the client from our integrations folder instead
export { supabase } from '@/integrations/supabase/client';

export type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  plan: string;
  credits?: number;
  usage?: number;
  quota?: number | null;
};

export type Build = {
  id: string;
  user_id: string;
  bot: string;
  request: string;  // This field is correctly named 'request' not 'input'
  status: string;
  result: string | null;
  created_at: string;
};
