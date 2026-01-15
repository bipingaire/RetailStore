-- =====================================================
-- EMERGENCY: FORCE SUPERADMIN ACCESS
-- Target: superadmin@retailos.com
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'superadmin@retailos.com';
BEGIN
  RAISE NOTICE '🚀 Starting Emergency Access Grant for %...', v_email;

  -- 1. Find User ID in auth.users
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '❌ CRITICAL: User % not found in auth.users! Cannot proceed.', v_email;
  ELSE
    RAISE NOTICE '✅ Found User ID: %', v_user_id;
  END IF;

  -- 2. Force Insert into superadmin-users (if not exists)
  INSERT INTO "superadmin-users" ("user-id", "email", "full-name", "is-active", "permissions-json")
  VALUES (
    v_user_id, 
    v_email, 
    'Emergency Superadmin', 
    true, 
    '{"manage_stores": true, "manage_products": true, "view_analytics": true, "manage_users": true}'::jsonb
  )
  ON CONFLICT ("user-id") 
  DO UPDATE SET "is-active" = true; -- Ensure they are active
  
  RAISE NOTICE '✅ User is confirmed in "superadmin-users" table.';

  -- 3. NUCLEAR OPTION: Add Email-Specific Bypass Policy
  -- This ignores the "superadmin-users" table lookup and trusts the Auth Email directly.
  -- This is the "God Mode" you asked for.
  
  DROP POLICY IF EXISTS "Emergency Superadmin Access" ON "global-product-master-catalog";
  
  CREATE POLICY "Emergency Superadmin Access"
  ON "global-product-master-catalog"
  FOR ALL
  TO authenticated
  USING (
    auth.email() = 'superadmin@retailos.com'  -- Direct email check
  );

  RAISE NOTICE '✅ Created "God Mode" policy for superadmin@retailos.com';
  RAISE NOTICE '👉 REFRESH YOUR BROWSER NOW.';

END $$;
