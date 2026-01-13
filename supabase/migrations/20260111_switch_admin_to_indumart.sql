-- Switch admin to the correct InduMart Demo tenant
-- This fixes the issue where the admin is looking at tenant b719... instead of 1111...

DO $$
DECLARE
  v_user_id uuid;
  v_tenant_id uuid := '11111111-1111-1111-1111-111111111111';
BEGIN
  -- Get the user ID for admin@retailstore.com
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'admin@retailstore.com';

  IF v_user_id IS NOT NULL THEN
    -- Delete any existing role for this user to avoid conflicts
    DELETE FROM "tenant-user-role" WHERE "user-id" = v_user_id;

    -- Insert the correct role linking to InduMart Demo
    INSERT INTO "tenant-user-role" (
      "role-id",
      "tenant-id",
      "user-id",
      "role-type"
    ) VALUES (
      gen_random_uuid(),
      v_tenant_id,
      v_user_id,
      'owner'
    );
    
    RAISE NOTICE '✅ Successfully switched admin to tenant 11111111-1111-1111-1111-111111111111';
  ELSE
    RAISE NOTICE '❌ User admin@retailstore.com not found';
  END IF;
END $$;
