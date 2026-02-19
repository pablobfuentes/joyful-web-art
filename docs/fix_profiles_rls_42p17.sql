-- Fix 42P17 on profiles when table exists but app gets 500
-- Run in Supabase Dashboard → SQL Editor
-- See docs/ADMIN_REGISTRY_EDITOR.md §6

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Optional: uncomment if you need admins to read all profiles
-- CREATE POLICY "profiles_select_admin"
--   ON public.profiles FOR SELECT
--   USING (
--     EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
--   );
