-- FORCE CREATE USER SYSTEM (Bypass Dashboard)
-- Since Dashboard creation is failing, we must CREATE it here.

DO $$
DECLARE
  v_src_email TEXT := 'admin@highpoint.indumart.us';
  v_new_email TEXT := 'store@greensboro.indumart.us'; -- Trying 'store' prefix
  v_password_hash TEXT;
  v_tenant_id UUID;
  v_new_user_id UUID := gen_random_uuid();
BEGIN
  -- 1. GET VALID PASSWORD HASH (Copy from Highpoint)
  SELECT encrypted_password INTO v_password_hash 
  FROM auth.users 
  WHERE email = v_src_email;
  
  IF v_password_hash IS NULL THEN
     RAISE EXCEPTION 'CRITICAL: Highpoint Admin not found. Cannot clone password.';
  END IF;

  -- 2. GET TENANT ID
  SELECT "tenant-id" INTO v_tenant_id 
  FROM "subdomain-tenant-mapping" 
  WHERE "subdomain" = 'greensboro';

  -- 3. DELETE OLD ATTEMPTS
  DELETE FROM auth.users WHERE email = v_new_email;

  -- 4. INSERT NEW USER (Cloned Password)
  INSERT INTO auth.users (
    id, email, encrypted_password, email_confirmed_at, role, 
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  )
  VALUES (
    v_new_user_id,
    v_new_email,
    v_password_hash, -- <--- COPYING THE WORKING HASH
    now(),
    'authenticated',
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email'], 'tenant_id', v_tenant_id),
    jsonb_build_object('full_name', 'Greensboro Store', 'tenant_id', v_tenant_id, 'role', 'admin', 'permissions', ARRAY['admin', 'store_owner']),
    now(),
    now()
  );

  -- 5. LINK TO TENANT
  UPDATE "retail-store-tenant"
  SET "owner-user-id" = v_new_user_id
  WHERE "tenant-id" = v_tenant_id;

  RAISE NOTICE 'SUCCESS: Created %', v_new_email;
  RAISE NOTICE 'LOGIN WITH HIGHPOINT PASSWORD (IT IS A COPY)';

END $$;
