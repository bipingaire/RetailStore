-- FORCE CREATE 'store' USER (Cloning Highpoint Password)
-- Run this in Supabase SQL Editor.

DO $$
DECLARE
  v_src_email TEXT := 'admin@highpoint.indumart.us';
  v_new_email TEXT := 'store@greensboro.indumart.us';
  v_password_hash TEXT;
  v_tenant_id UUID;
  v_new_user_id UUID := gen_random_uuid();
BEGIN
  -- 1. Get the working password hash and tenant
  SELECT encrypted_password INTO v_password_hash FROM auth.users WHERE email = v_src_email;
  
  -- If Highpoint admin is missing, try generic fallback or error out
  IF v_password_hash IS NULL THEN
     RAISE EXCEPTION 'Could not find Highpoint admin to clone password from!';
  END IF;

  SELECT "tenant-id" INTO v_tenant_id FROM "subdomain-tenant-mapping" WHERE "subdomain" = 'greensboro';

  -- 2. Cleanup old attempts
  DELETE FROM auth.users WHERE email = v_new_email;

  -- 3. Insert NEW user with SAME password as Highpoint
  INSERT INTO auth.users (
    id, email, encrypted_password, email_confirmed_at, role, 
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud
  )
  VALUES (
    v_new_user_id,
    v_new_email,
    v_password_hash, -- <--- MAGIC: Use the working hash!
    now(),
    'authenticated',
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email'], 'tenant_id', v_tenant_id),
    jsonb_build_object('full_name', 'Greensboro Store Owner', 'tenant_id', v_tenant_id, 'role', 'admin', 'permissions', ARRAY['admin', 'store_owner']),
    now(),
    now(),
    'authenticated'
  );

  -- 4. Link to Tenant
  UPDATE "retail-store-tenant"
  SET "owner-user-id" = v_new_user_id
  WHERE "tenant-id" = v_tenant_id;

  RAISE NOTICE 'SUCCESS! Created %', v_new_email;
  RAISE NOTICE 'Please login with the SAME PASSWORD you use for Highpoint Admin!';

END $$;
