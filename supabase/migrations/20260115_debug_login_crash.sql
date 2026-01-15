-- =====================================================
-- DEBUG: FORCE REPRODUCE LOGIN CRASH
-- =====================================================
-- This script simulates a login. If there is a broken trigger, 
-- THIS SCRIPT WILL FAIL and show us the REAL error message.

DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'admin@highpoint.indumart.us';
BEGIN
  RAISE NOTICE '🧪 TEST: ATTEMPTING TO UPDATE USER...';

  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;
  
  IF v_user_id IS NULL THEN
     RAISE EXCEPTION '❌ Test User not found! Run the Setup Script first.';
  END IF;

  -- SIMULATE LOGIN UPDATE (This is what crashes)
  UPDATE auth.users 
  SET last_sign_in_at = NOW() 
  WHERE id = v_user_id;

  RAISE NOTICE '✅ SUCCESS: User updated without crashing!';
  RAISE NOTICE '   (This means the database is fine, and the issue might be the API/Browser)';

EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '💥 CRASH DETECTED!';
  RAISE NOTICE '   Error Code: %', SQLSTATE;
  RAISE NOTICE '   Error Message: %', SQLERRM;
  RAISE NOTICE '   Context: %', SQLERRM;
END $$;
