-- DIAGNOSTIC SCRIPT: Check if Greensboro User & Tenant Exist
-- Run this in Supabase SQL Editor and check the "Results" tab.

-- 1. Check if the User exists (and see their metadata)
SELECT id, email, raw_user_meta_data->>'full_name' as name, raw_user_meta_data->>'tenant_id' as linked_tenant, created_at
FROM auth.users 
WHERE email ILIKE '%greensboro%';

-- 2. Check if the Tenant exists
SELECT "tenant-id", "store-name", "subdomain"
FROM "retail-store-tenant"
WHERE "subdomain" = 'greensboro';

-- 3. Check the Mapping
SELECT * 
FROM "subdomain-tenant-mapping"
WHERE "subdomain" = 'greensboro';
