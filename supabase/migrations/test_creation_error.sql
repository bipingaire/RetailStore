-- DIAGNOSTIC: TEST USER CREATION
-- Run this to find out WHY the user cannot be created.
-- Look at the "Messages" or "Results" tab after running.

DO $$
DECLARE
  v_email TEXT := 'admin@greensboro.indumart.us';
BEGIN
  -- 1. Attempt to cleanup first
  DELETE FROM auth.users WHERE email = v_email;

  -- 2. Try to insert (This will fail with a specific error if there is a problem)
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role)
  VALUES (
    '99999999-9999-9999-9999-999999999999', -- Fixed ID
    v_email,
    '$2a$06$Gk...placeholder...hash', -- Dummy hash
    now(),
    'authenticated'
  );

  RAISE NOTICE 'SUCCESS: No database blockers found. The issue is likely Supabase Dashboard Policy or Rate Limiting.';

  -- Cleanup
  DELETE FROM auth.users WHERE email = v_email;

EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '---------------------------------------------------';
  RAISE NOTICE '🛑 FAILURE REASON: %', SQLERRM;
  RAISE NOTICE '🛑 ERROR CODE: %', SQLSTATE;
  RAISE NOTICE '---------------------------------------------------';
END $$;
