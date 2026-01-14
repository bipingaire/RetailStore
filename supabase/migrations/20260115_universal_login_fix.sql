-- =====================================================
-- UNIVERSAL LOGIN FIX & RECOVERY
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  v_tenant_id UUID;
  v_user_id UUID;
  v_email TEXT := 'admin@highpoint.indumart.us';
  v_password TEXT := 'password123';
BEGIN

  -- 1. CLEANUP (Just in case triggers are still lurking)
  DROP TRIGGER IF EXISTS on_auth_user_created_customer ON auth.users;
  DROP FUNCTION IF EXISTS public.handle_new_customer();
  DROP FUNCTION IF EXISTS public.handle_new_customer_with_tenant();


  -- 2. GET TENANT (Robust Lookup)
  SELECT "tenant-id" INTO v_tenant_id FROM "subdomain-tenant-mapping" WHERE "subdomain" = 'highpoint';
  IF v_tenant_id IS NULL THEN
     SELECT "tenant-id" INTO v_tenant_id FROM "retail-store-tenant" WHERE "store-name" ILIKE '%Highpoint%' LIMIT 1;
  END IF;

  IF v_tenant_id IS NULL THEN
     RAISE EXCEPTION '❌ Tenant Not Found! Please run Setup Script first to create the Highpoint Tenant.';
  END IF;


  -- 3. USER RECOVERY (Create or Reset)
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

  IF v_user_id IS NULL THEN
    -- CREATE NEW USER
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
      raw_app_meta_data, 
      raw_user_meta_data, 
      created_at, updated_at
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000', uuid_generate_v4(), 'authenticated', 'authenticated', v_email, 
      crypt(v_password, gen_salt('bf')), NOW(), 
      '{"provider":"email","providers":["email"]}', 
      jsonb_build_object('full_name', 'Highpoint Admin', 'tenant_id', v_tenant_id),
      NOW(), NOW()
    )
    RETURNING id INTO v_user_id;
    RAISE NOTICE '✅ Created NEW Admin User: %', v_email;
  ELSE
    -- RESET EXISTING USER
    UPDATE auth.users 
    SET encrypted_password = crypt(v_password, gen_salt('bf')),
        raw_user_meta_data = jsonb_build_object('full_name', 'Highpoint Admin', 'tenant_id', v_tenant_id)
    WHERE id = v_user_id;
    RAISE NOTICE '✅ Reset Password for EXISTING User: %', v_email;
  END IF;


  -- 4. ENSURE OWNER ROLE
  INSERT INTO "tenant-user-role" ("tenant-id", "user-id", "role-type")
  VALUES (v_tenant_id, v_user_id, 'owner')
  ON CONFLICT ("tenant-id", "user-id") DO UPDATE
  SET "role-type" = 'owner';

  RAISE NOTICE '✅ Verified OWNER role.';
  RAISE NOTICE '👉 Login with: % / %', v_email, v_password;

END $$;
