-- ROBUST CREATION DEBUGGER
-- Run this to force creation and SEE what is happening.

DO $$
DECLARE
  v_src_email TEXT := 'admin@highpoint.indumart.us';
  v_new_email TEXT := 'store@greensboro.indumart.us';
  v_password_hash TEXT;
  v_new_id UUID := gen_random_uuid();
  v_created_id UUID;
BEGIN
  RAISE NOTICE '1. Searching for source user: %', v_src_email;
  
  -- 1. Get Hash
  SELECT encrypted_password INTO v_password_hash 
  FROM auth.users 
  WHERE email = v_src_email;

  IF v_password_hash IS NULL THEN
    RAISE EXCEPTION 'CRITICAL FAILURE: Source user % not found or has no password!', v_src_email;
  ELSE
    RAISE NOTICE '   - Found password hash: % (truncated)', left(v_password_hash, 10) || '...';
  END IF;

  -- 2. Delete Old
  DELETE FROM auth.users WHERE email = v_new_email;
  RAISE NOTICE '2. Cleaned up old user: %', v_new_email;

  -- 3. Insert
  INSERT INTO auth.users (
    id, email, encrypted_password, email_confirmed_at, role, 
    raw_app_meta_data,
    raw_user_meta_data,
    created_at, updated_at, aud
  )
  VALUES (
    v_new_id,
    v_new_email,
    v_password_hash, -- Using verified hash
    now(),
    'authenticated',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Greensboro Debug"}',
    now(), now(), 'authenticated'
  )
  RETURNING id INTO v_created_id;

  -- 4. Verify
  IF v_created_id IS NOT NULL THEN
     RAISE NOTICE '3. SUCCESS! Created User ID: %', v_created_id;
  ELSE
     RAISE EXCEPTION 'CRITICAL FAILURE: Insert statement ran but returned no ID!';
  END IF;

  -- 5. Link Tenant
  UPDATE "retail-store-tenant"
  SET "owner-user-id" = v_created_id
  WHERE "subdomain" = 'greensboro';
  
  RAISE NOTICE '4. Linked to Tenant. DONE.';

END $$;
