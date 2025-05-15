
-- Add credits field to profiles table for tracking available credits
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 5 NOT NULL;

-- Add plan field to profiles table to store the subscription plan
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free' NOT NULL;

-- Create function to set initial credits for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, credits, plan)
  VALUES (new.id, new.email, 5, 'free');
  RETURN new;
END;
$function$;

-- Create trigger for admin user specifically for development
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role)
VALUES
  ('00000000-0000-0000-0000-000000000000', 'admin@pe.dovito.com', 
   crypt('password', gen_salt('bf')), 
   now(), 'admin')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, email, credits, plan, quota)
VALUES
  ('00000000-0000-0000-0000-000000000000', 'admin@pe.dovito.com', 9999, 'admin', NULL)
ON CONFLICT (id) DO NOTHING;
