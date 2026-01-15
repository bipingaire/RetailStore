-- Add Greensboro Tenant with Subdomain and Admin User
-- This script sets up a complete tenant with admin access

-- 1. Create the tenant
INSERT INTO "retail-store-tenant" (
  "tenant-id",
  "store-name",
  "subdomain",
  "store-address",
  "store-city",
  "subscription-tier"
)
VALUES (
  gen_random_uuid(),
  'Greensboro Store',
  'greensboro',
  '123 Main Street, Greensboro, NC',
  'Greensboro',
  'beta'
)
ON CONFLICT ("subdomain") DO NOTHING
RETURNING "tenant-id";

-- Store the tenant ID for later use
DO $$
DECLARE
  greensboro_tenant_id UUID;
  greensboro_admin_id UUID;
BEGIN
  -- Get the Greensboro tenant ID
  SELECT "tenant-id" INTO greensboro_tenant_id
  FROM "retail-store-tenant"
  WHERE "subdomain" = 'greensboro'
  LIMIT 1;

  IF greensboro_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Greensboro tenant not found. Please run the INSERT first.';
  END IF;

  -- 2. Create admin user in auth.users (if not exists)
  -- Note: In production, you should use Supabase Auth API to create users
  -- This is a direct database insert for development/seeding purposes
  
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
  )
  VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'admin@greensboro.indumart.us',
    crypt('greensboro123', gen_salt('bf')), -- Password: greensboro123
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('tenant_id', greensboro_tenant_id),
    'authenticated',
    'authenticated'
  )
  ON CONFLICT (email) DO UPDATE
  SET raw_user_meta_data = jsonb_build_object('tenant_id', greensboro_tenant_id)
  RETURNING id INTO greensboro_admin_id;

  -- 3. Link admin user to tenant in tenant-admin-users table
  INSERT INTO "tenant-admin-users" (
    "admin-id",
    "user-id",
    "tenant-id",
    "full-name",
    "email",
    "role",
    "is-active",
    "created-at"
  )
  VALUES (
    gen_random_uuid(),
    greensboro_admin_id,
    greensboro_tenant_id,
    'Greensboro Admin',
    'admin@greensboro.indumart.us',
    'admin',
    true,
    NOW()
  )
  ON CONFLICT ("user-id") DO NOTHING;

  -- 4. Add subdomain mapping for geo-redirect
  INSERT INTO "retail-store-subdomain-map" (
    "subdomain",
    "tenant-id",
    "is-active",
    "created-at"
  )
  VALUES (
    'greensboro',
    greensboro_tenant_id,
    true,
    NOW()
  )
  ON CONFLICT ("subdomain") DO NOTHING;

  -- 5. Optional: Add store location for geo-redirect
  INSERT INTO "retail-store-location" (
    "location-id",
    "tenant-id",
    "latitude",
    "longitude",
    "is-active",
    "created-at"
  )
  VALUES (
    gen_random_uuid(),
    greensboro_tenant_id,
    36.0726,  -- Greensboro, NC coordinates
    -79.7920,
    true,
    NOW()
  )
  ON CONFLICT DO NOTHING;

  RAISE NOTICE '✅ Greensboro tenant created successfully!';
  RAISE NOTICE 'Tenant ID: %', greensboro_tenant_id;
  RAISE NOTICE 'Admin Email: admin@greensboro.indumart.us';
  RAISE NOTICE 'Admin Password: greensboro123';
  RAISE NOTICE 'Subdomain: greensboro.indumart.us';
END $$;

-- Verify the setup
SELECT 
  t."tenant-id",
  t."store-name",
  t."subdomain",
  t."city",
  t."state-province",
  a."email" as admin_email,
  a."role" as admin_role,
  s."subdomain" as mapped_subdomain
FROM "retail-store-tenant" t
LEFT JOIN "tenant-admin-users" a ON t."tenant-id" = a."tenant-id"
LEFT JOIN "retail-store-subdomain-map" s ON t."tenant-id" = s."tenant-id"
WHERE t."subdomain" = 'greensboro';
