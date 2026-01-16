-- NUCLEAR OPTION V2: Fixed Provider_ID
-- This creates User + Identity (Fixed) + Tenant Link
-- Run this in Supabase SQL Editor.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

BEGIN;

DO $$
DECLARE
  v_email TEXT := 'owner2@greensboro.indumart.us';
  v_password TEXT := 'Greensboro123!';
  v_tenant_id UUID;
  v_user_id UUID := gen_random_uuid();
  v_encrypted_pw TEXT;
BEGIN
  -- 1. Get Tenant
  SELECT "tenant-id" INTO v_tenant_id FROM "subdomain-tenant-mapping" WHERE "subdomain" = 'greensboro';
  
  IF v_tenant_id IS NULL THEN RAISE EXCEPTION 'Tenant greensboro not found'; END IF;

  -- 2. Generate Hash
  v_encrypted_pw := crypt(v_password, gen_salt('bf'));

  -- 3. Cleanup (User & Identity will cascade delete usually, but being safe)
  DELETE FROM auth.users WHERE email = v_email;

  -- 4. Create User
  INSERT INTO auth.users (
    id, email, encrypted_password, email_confirmed_at, role, 
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, is_sso_user
  )
  VALUES (
    v_user_id,
    v_email,
    v_encrypted_pw,
    now(),
    'authenticated',
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email'], 'tenant_id', v_tenant_id),
    jsonb_build_object('full_name', 'Greensboro Owner', 'tenant_id', v_tenant_id, 'role', 'admin', 'permissions', ARRAY['admin', 'store_owner']),
    now(),
    now(),
    'authenticated',
    false
  );

  -- 5. Create Identity (FIXED: Added provider_id)
  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  )
  VALUES (
    gen_random_uuid(),
    v_user_id,
    jsonb_build_object('sub', v_user_id, 'email', v_email, 'email_verified', true),
    'email',
    v_user_id::text, -- <--- FIXED: provider_id matches user_id for email provider
    now(),
    now(),
    now()
  );

  -- 6. Link Tenant
  UPDATE "retail-store-tenant"
  SET "owner-user-id" = v_user_id
  WHERE "tenant-id" = v_tenant_id;

  RAISE NOTICE 'SUCCESS: Created User %', v_email;
  RAISE NOTICE 'Password: %', v_password;

END $$;

COMMIT;
