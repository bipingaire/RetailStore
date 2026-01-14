-- FORCE RE-CREATION of Highpoint Admin
-- Description: Wipes any old user with this email and creates a fresh one.
-- Usage: Run in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS pgcrypto;

BEGIN;

DO $$
DECLARE
  v_user_id UUID := '33333333-3333-3333-3333-333333333333';
  v_email TEXT := 'highpoint@indumart.us';
  v_password TEXT := 'HighpointPassword!';
  v_tenant_id UUID;
BEGIN
  -- 1. DELETE existing user to ensure clean state (Fixes "Failed to create" errors)
  -- This removes the user completely so we can insert a fresh, working one.
  DELETE FROM "auth"."users" WHERE "email" = v_email;

  -- 2. Create the User Fresh
  INSERT INTO "auth"."users" (
    "id", "email", "encrypted_password", "email_confirmed_at", 
    "raw_app_meta_data", "raw_user_meta_data", 
    "created_at", "updated_at", "role"
  )
  VALUES (
    v_user_id,
    v_email,
    crypt(v_password, gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Highpoint Admin (Fixed)"}',
    NOW(),
    NOW(),
    'authenticated'
  );

  -- 3. Get Tenant ID (Create if missing)
  SELECT "tenant-id" INTO v_tenant_id FROM "retail-store-tenant" WHERE "store-name" = 'HighPoint Indumart Store';
  
  IF v_tenant_id IS NULL THEN
      INSERT INTO "retail-store-tenant" ("store-name", "store-address", "store-city", "subscription-tier", "is-active")
      VALUES ('HighPoint Indumart Store', '123 Main Street', 'High Point', 'pro', true)
      RETURNING "tenant-id" INTO v_tenant_id;
  END IF;

  -- 4. FORCE map subdomain 'highpoint'
  INSERT INTO "subdomain-tenant-mapping" ("subdomain", "tenant-id", "is-active")
  VALUES ('highpoint', v_tenant_id, true)
  ON CONFLICT ("subdomain") DO UPDATE SET "tenant-id" = v_tenant_id;

  -- 5. FORCE link user as owner
  UPDATE "retail-store-tenant"
  SET "owner-user-id" = v_user_id
  WHERE "tenant-id" = v_tenant_id;
  
  RAISE NOTICE 'SUCCESS: Re-created user % and linked to store!', v_email;

END $$;

COMMIT;
