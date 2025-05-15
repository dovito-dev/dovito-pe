
-- Add a function to safely deduct credits from a user
CREATE OR REPLACE FUNCTION public.deduct_credit(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET credits = credits - 1
  WHERE id = user_id AND credits > 0;
END;
$$;
