-- =====================================================
-- NUCLEAR TRIGGER CLEANUP (Fixes 500 "Database error")
-- =====================================================

-- 1. DROP TRIGGERS ON auth.users
-- We list EVERY trigger name we've ever used or seen in logs
DROP TRIGGER IF EXISTS on_auth_user_created_customer ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_customer_trigger ON auth.users;
DROP TRIGGER IF EXISTS trg_handle_new_customer ON auth.users;

-- 2. DROP FUNCTIONS (The code the triggers call)
DROP FUNCTION IF EXISTS public.handle_new_customer();
DROP FUNCTION IF EXISTS public.handle_new_customer_with_tenant();
DROP FUNCTION IF EXISTS public.on_auth_user_created();
DROP FUNCTION IF EXISTS public.create_new_customer();

-- 3. VERIFY AND FLUSH
DO $$
DECLARE
  count INTEGER;
BEGIN
  -- Check if any remain
  SELECT COUNT(*) INTO count 
  FROM information_schema.triggers 
  WHERE event_object_table = 'users' 
  AND event_object_schema = 'auth';

  IF count > 0 THEN
      RAISE EXCEPTION '❌ TRIGGERS STILL EXIST! Run the diagnostics script again.';
  ELSE
      RAISE NOTICE '✅ ALL TRIGGERS REMOVED. Login should be safe now.';
  END IF;
END $$;
