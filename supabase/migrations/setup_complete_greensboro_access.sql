-- COMPLETE LINKAGE FOR admin1@indumart.com
-- This script links the user to Greensboro in ALL required tables.

DO $$
DECLARE
  v_email TEXT := 'admin1@indumart.com';
  v_subdomain TEXT := 'greensboro';
  v_tenant_id UUID;
  v_user_id UUID;
BEGIN
  -- 1. Get User ID (Must exist since you created it manually)
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User % not found. Please double check the email in Dashboard!', v_email;
  END IF;

  -- 2. Get Greensboro Tenant ID
  SELECT "tenant-id" INTO v_tenant_id FROM "subdomain-tenant-mapping" WHERE "subdomain" = v_subdomain;

  IF v_tenant_id IS NULL THEN
     RAISE EXCEPTION 'Tenant for subdomain % not found!', v_subdomain;
  END IF;

  -- 3. Link User Metadata (Auth) - Critical for RLS and Frontend Context
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_build_object(
    'tenant_id', v_tenant_id,
    'full_name', 'Greensboro Manager',
    'role', 'admin',
    'permissions', ARRAY['admin', 'store_owner']
  ),
  raw_app_meta_data = jsonb_build_object(
    'provider', 'email', 
    'providers', ARRAY['email'],
    'tenant_id', v_tenant_id
  ),
  email_confirmed_at = now() -- Force confirm just in case
  WHERE id = v_user_id;

  -- 4. Update Tenant Owner (For Store Settings)
  UPDATE "retail-store-tenant"
  SET "owner-user-id" = v_user_id
  WHERE "tenant-id" = v_tenant_id;

  -- 5. CRITICAL: Update/Insert Tenant User Role (For Dashboard Visibility)
  -- This controls what the Admin Panel shows you!
  
  -- Clear old roles for this user to avoid conflicts
  DELETE FROM "tenant-user-role" WHERE "user-id" = v_user_id;

  -- Insert fresh role
  INSERT INTO "tenant-user-role" (
    "user-id",
    "tenant-id",
    "role-type"
  ) VALUES (
    v_user_id,
    v_tenant_id,
    'owner'
  );

  RAISE NOTICE 'SUCCESS: User % is now the Fully Mapped Admin of Greensboro.', v_email;
  RAISE NOTICE 'Tenant ID: %', v_tenant_id;

END $$;
