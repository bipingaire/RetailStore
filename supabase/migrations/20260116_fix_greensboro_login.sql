-- FIX GREENSBORO ADMIN LOGIN (Force Re-create)
-- Run this in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS pgcrypto;

BEGIN;

DO $$
DECLARE
  v_tenant_id UUID;
  v_user_email TEXT := 'admin@greensboro.indumart.us';
  v_password TEXT := 'Greensboro123!';
  v_user_id UUID := '99999999-9999-9999-9999-999999999999'; -- Fixed ID for easier debugging
BEGIN
  -- 1. DYNAMICALLY FIND THE TENANT ID (Don't rely on hardcoded strings)
  SELECT "tenant-id" INTO v_tenant_id
  FROM "subdomain-tenant-mapping"
  WHERE "subdomain" = 'greensboro';

  IF v_tenant_id IS NULL THEN
    RAISE EXCEPTION 'CRITICAL ERROR: Could not find tenant ID for subdomain "greensboro". Check mappings table!';
  END IF;

  RAISE NOTICE 'Targeting Tenant ID: %', v_tenant_id;

  -- 2. CLEANUP: Delete any existing user with this email
  DELETE FROM auth.users WHERE email = v_user_email;

  -- 3. CREATE USER: With explicit BCrypt hash and Metadata
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    role,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    aud,
    confirmation_token
  ) VALUES (
    v_user_id,
    v_user_email,
    crypt(v_password, gen_salt('bf')), -- Use robust BCrypt salt
    now(),
    'authenticated',
    jsonb_build_object(
      'provider', 'email', 
      'providers', ARRAY['email'],
      'tenant_id', v_tenant_id -- IMPORTANT: System-level link
    ),
    jsonb_build_object(
      'full_name', 'Greensboro Admin', 
      'tenant_id', v_tenant_id, -- IMPORTANT: Frontend link
      'permissions', ARRAY['admin', 'store_owner']
    ),
    now(),
    now(),
    'authenticated',
    '' -- Empty confirmation token prevents "confirm your email" issues
  );

  -- 4. LINK USER AS OWNER
  UPDATE "retail-store-tenant"
  SET "owner-user-id" = v_user_id
  WHERE "tenant-id" = v_tenant_id;

  -- 5. VERIFY
  RAISE NOTICE 'SUCCESS: Re-created % linked to tenant %', v_user_email, v_tenant_id;

END $$;

COMMIT;
