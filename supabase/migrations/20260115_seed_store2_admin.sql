-- Permissions: Admin
-- Description: Seeds a dedicated admin user for 'store2' (Greensboro Store)
-- Usage: Run this in Supabase SQL Editor

BEGIN;

DO $$
DECLARE
  v_user_id UUID := '22222222-2222-2222-2222-222222222222'; -- Specific UUID for consistency
  v_email TEXT := 'store2@indumart.us';
  v_password TEXT := 'Store2Password!'; -- Change this after login!
  v_tenant_id UUID;
BEGIN

  -- 1. Create the User in auth.users
  -- Uses pgcrypto for password hashing
  INSERT INTO "auth"."users" (
    "id",
    "email",
    "encrypted_password",
    "email_confirmed_at",
    "raw_app_meta_data",
    "raw_user_meta_data",
    "created_at",
    "updated_at",
    "role",
    "confirmation_token",
    "recovery_token"
  )
  VALUES (
    v_user_id,
    v_email,
    crypt(v_password, gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Store2 Admin"}',
    NOW(),
    NOW(),
    'authenticated',
    '',
    ''
  )
  ON CONFLICT ("id") DO NOTHING; -- Pass if already exists

  -- 2. Find the Tenant ID for 'store2'
  SELECT "tenant-id" INTO v_tenant_id
  FROM "subdomain-tenant-mapping"
  WHERE "subdomain" = 'store2';

  -- Fallback if mapping missing, search by name
  IF v_tenant_id IS NULL THEN
    SELECT "tenant-id" INTO v_tenant_id
    FROM "retail-store-tenant"
    WHERE "store-name" = 'Greensboro Indumart Store';
  END IF;

  -- 3. Link this User as the Owner
  IF v_tenant_id IS NOT NULL THEN
    UPDATE "retail-store-tenant"
    SET "owner-user-id" = v_user_id
    WHERE "tenant-id" = v_tenant_id;
    
    RAISE NOTICE 'Successfully updated owner for store2 to %', v_email;
  ELSE
    RAISE WARNING 'Could not find tenant for store2!';
  END IF;

END $$;

COMMIT;
