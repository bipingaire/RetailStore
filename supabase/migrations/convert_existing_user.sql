-- REUSE EXISTING USER SCRIPT
-- Since creating new users is hiding them, we will use 'admin@retailstore.com' which IS visible.

DO $$
DECLARE
  v_email TEXT := 'admin@retailstore.com';
  v_new_password TEXT := 'greensboro123';
  v_tenant_id UUID;
BEGIN
  -- 1. Get Tenant
  SELECT "tenant-id" INTO v_tenant_id FROM "subdomain-tenant-mapping" WHERE "subdomain" = 'greensboro';

  -- 2. Update Password (to be sure you know it)
  UPDATE auth.users
  SET encrypted_password = crypt(v_new_password, gen_salt('bf')),
      email_confirmed_at = now()
  WHERE email = v_email;

  -- 3. Link Permissions
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_build_object(
    'tenant_id', v_tenant_id,
    'full_name', 'Greensboro Admin',
    'role', 'admin',
    'permissions', jsonb_build_array('admin', 'store_owner')
  ),
  raw_app_meta_data = jsonb_build_object(
    'provider', 'email', 
    'providers', ARRAY['email'],
    'tenant_id', v_tenant_id
  )
  WHERE email = v_email;

  -- 4. Set as Tenant Owner
  UPDATE "retail-store-tenant"
  SET "owner-user-id" = (SELECT id FROM auth.users WHERE email = v_email)
  WHERE "tenant-id" = v_tenant_id;

  RAISE NOTICE 'SUCCESS: Converted % into Greensboro Admin.', v_email;
  RAISE NOTICE 'Login with password: %', v_new_password;

END $$;
