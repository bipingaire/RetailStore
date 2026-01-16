-- LINK SCRIPT FOR 'store@greensboro.indumart.us'
-- Run this AFTER creating the user in the Dashboard.

DO $$
DECLARE
  v_email TEXT := 'store@greensboro.indumart.us'; -- NEW EMAIL
  v_tenant_id UUID;
  v_user_id UUID;
BEGIN
  -- 1. Get the Tenant ID from the mapping
  SELECT "tenant-id" INTO v_tenant_id 
  FROM "subdomain-tenant-mapping" 
  WHERE "subdomain" = 'greensboro';

  IF v_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Tenant not found for greensboro!';
  END IF;

  -- 2. Get the User ID
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_email;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User % not found! Did you create it in the Dashboard?', v_email;
  END IF;

  -- 3. Link User and Update Metadata
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_build_object(
    'tenant_id', v_tenant_id,
    'full_name', 'Greensboro Store Manager',
    'role', 'admin',
    'permissions', jsonb_build_array('admin', 'store_owner')
  ),
  raw_app_meta_data = jsonb_build_object(
    'provider', 'email', 
    'providers', ARRAY['email'],
    'tenant_id', v_tenant_id
  )
  WHERE id = v_user_id;

  -- 4. Set as Tenant Owner
  UPDATE "retail-store-tenant"
  SET "owner-user-id" = v_user_id
  WHERE "tenant-id" = v_tenant_id;
  
  RAISE NOTICE 'SUCCESS: User % linked to Tenant %', v_email, v_tenant_id;

END $$;
