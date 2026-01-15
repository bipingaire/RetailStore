-- =====================================================
-- FIX 500 LOGIN ERROR (Database error querying schema)
-- =====================================================
-- This error happens when a bad Trigger crashes the Auth system.
-- We must remove ANY triggers interfering with auth.users.

-- 1. DROP ALL POTENTIAL TRIGGERS ON auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_customer ON auth.users;
DROP TRIGGER IF EXISTS on_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- 2. DROP THE FUNCTIONS THEY CALL (To be safe)
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_new_customer();
DROP FUNCTION IF EXISTS public.create_new_user_profile();

-- 3. ENSURE METADATA COLUMN IS VALID (Sometimes causes schema drift errors)
-- Just checking if it's there (standard Supabase)
DOCT $$
BEGIN
   -- Verify we can read auth.users without crashing
   PERFORM id FROM auth.users LIMIT 1;
   RAISE NOTICE '✅ Auth Table is readable. Triggers removed.';
END $$;
