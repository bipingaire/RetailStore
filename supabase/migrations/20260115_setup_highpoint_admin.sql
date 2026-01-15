-- =====================================================
-- SETUP HIGHPOINT ADMIN USER & TENANT
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  v_tenant_id UUID;
  v_user_id UUID;
  v_email TEXT := 'admin@highpoint.indumart.us';
  v_password TEXT := 'password123';
BEGIN

  -- 1. GET OR CREATE TENANT
  SELECT "tenant-id" INTO v_tenant_id FROM "subdomain-tenant-mapping" WHERE "subdomain" = 'highpoint';
  
  IF v_tenant_id IS NULL THEN
    -- Check if tenant exists by name (fuzzy match)
    SELECT "tenant-id" INTO v_tenant_id FROM "retail-store-tenant" WHERE "store-name" ILIKE '%Highpoint%' LIMIT 1;
    
    IF v_tenant_id IS NULL THEN
        INSERT INTO "retail-store-tenant" ("store-name", "email-address", "subdomain")
        VALUES ('Highpoint Retail', 'contact@highpoint.indumart.us', 'highpoint')
        RETURNING "tenant-id" INTO v_tenant_id;
        
        RAISE NOTICE '✅ Created new tenant: Highpoint Retail';
    ELSE
        RAISE NOTICE 'ℹ️ Found existing tenant matching "Highpoint": ID %', v_tenant_id;
    END IF;

    -- Ensure subdomain mapping exists
    INSERT INTO "subdomain-tenant-mapping" ("subdomain", "tenant-id")
    VALUES ('highpoint', v_tenant_id)
    ON CONFLICT ("subdomain") DO NOTHING;
  ELSE
    RAISE NOTICE 'ℹ️ Found existing tenant by subdomain: highpoint';
  END IF;


  -- 2. GET OR CREATE USER (in auth.users)
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;
  
  IF v_user_id IS NULL THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      uuid_generate_v4(),
      'authenticated',
      'authenticated',
      v_email,
      crypt(v_password, gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}', 
      jsonb_build_object('full_name', 'Highpoint Admin', 'tenant_id', v_tenant_id), 
      NOW(),
      NOW()
    )
    RETURNING id INTO v_user_id;
    
    RAISE NOTICE '✅ Created new admin user: %', v_email;
  ELSE
    -- Reset password AND update tenant metadata if user exists
    UPDATE auth.users 
    SET encrypted_password = crypt(v_password, gen_salt('bf')),
        raw_user_meta_data = jsonb_build_object('full_name', 'Highpoint Admin', 'tenant_id', v_tenant_id)
    WHERE id = v_user_id;
    RAISE NOTICE 'ℹ️ Updated password for existing user: %', v_email;
  END IF;


  -- 3. ASSIGN OWNER ROLE
  INSERT INTO "tenant-user-role" ("tenant-id", "user-id", "role-type")
  VALUES (v_tenant_id, v_user_id, 'owner')
  ON CONFLICT ("tenant-id", "user-id") DO UPDATE
  SET "role-type" = 'owner'; -- Ensure they are owner if they were something else
  
  RAISE NOTICE '✅ ASSIGNMENT COMPLETE.';
  RAISE NOTICE '   URL:      https://retailos.cloud/admin/login';
  RAISE NOTICE '   EMAIL:    %', v_email;
  RAISE NOTICE '   PASSWORD: %', v_password;

END $$;
