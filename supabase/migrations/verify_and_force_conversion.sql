-- FORCE CONVERT & VERIFY
-- Run this. It will unlink from Indumart and Force Link to Greensboro.
-- It returns the result so you can SEE it happened.

BEGIN;

-- 1. Unlink from any OTHER tenants (Remove from Indumart)
UPDATE "retail-store-tenant"
SET "owner-user-id" = NULL
WHERE "owner-user-id" = (SELECT id FROM auth.users WHERE email = 'admin@retailstore.com')
  AND "subdomain" != 'greensboro';

-- 2. Update User Metadata (Force Overwrite)
UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object(
    'tenant_id', (SELECT "tenant-id" FROM "subdomain-tenant-mapping" WHERE "subdomain" = 'greensboro'),
    'full_name', 'Greensboro Admin (Converted)',
    'role', 'admin',
    'permissions', ARRAY['admin', 'store_owner']
),
raw_app_meta_data = jsonb_build_object(
    'provider', 'email', 
    'providers', ARRAY['email'],
    'tenant_id', (SELECT "tenant-id" FROM "subdomain-tenant-mapping" WHERE "subdomain" = 'greensboro')
),
encrypted_password = crypt('greensboro123', gen_salt('bf')),
updated_at = now()
WHERE email = 'admin@retailstore.com';

-- 3. Link to Greensboro Tenant
UPDATE "retail-store-tenant"
SET "owner-user-id" = (SELECT id FROM auth.users WHERE email = 'admin@retailstore.com')
WHERE "subdomain" = 'greensboro';

-- 4. PROOF: Show the user's new metadata
SELECT 
    email, 
    raw_user_meta_data->>'full_name' as new_name, 
    raw_user_meta_data->>'tenant_id' as new_tenant_id 
FROM auth.users
WHERE email = 'admin@retailstore.com';

COMMIT;
