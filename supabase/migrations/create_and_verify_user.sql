-- FINAL ATTEMPT: CREATE AND VERIFY
-- Run this and look at the "Results" tab.

BEGIN;

-- 1. Clean up
DELETE FROM auth.users WHERE email = 'store@greensboro.indumart.us';

-- 2. Insert User (Copying Highpoint Password)
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
  aud
)
SELECT 
  gen_random_uuid(),
  'store@greensboro.indumart.us',
  encrypted_password, -- Copying hash from Highpoint
  now(),
  'authenticated',
  jsonb_build_object('provider', 'email', 'providers', ARRAY['email'], 'tenant_id', (SELECT "tenant-id" FROM "subdomain-tenant-mapping" WHERE "subdomain"='greensboro')),
  jsonb_build_object('full_name', 'Greensboro Store', 'tenant_id', (SELECT "tenant-id" FROM "subdomain-tenant-mapping" WHERE "subdomain"='greensboro'), 'role', 'admin', 'permissions', ARRAY['admin', 'store_owner']),
  now(),
  now(),
  'authenticated'
FROM auth.users
WHERE email = 'admin@highpoint.indumart.us'
RETURNING id, email, created_at; -- <--- THIS WILL SHOW THE ROW IF SUCCESSFUL

-- 3. Link Owner (If insertion worked)
UPDATE "retail-store-tenant"
SET "owner-user-id" = (SELECT id FROM auth.users WHERE email = 'store@greensboro.indumart.us')
WHERE "subdomain" = 'greensboro';

COMMIT;
