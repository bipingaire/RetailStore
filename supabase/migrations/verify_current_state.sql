-- VERIFICATION: READ ONLY
-- Run this to SEE what the database currently thinks.

SELECT 
    u.email,
    u.raw_user_meta_data->>'full_name' as name,
    u.raw_app_meta_data->>'tenant_id' as user_tenant_id,
    t."store-name" as user_linked_store_name,
    t."subdomain" as user_linked_subdomain
FROM auth.users u
LEFT JOIN "retail-store-tenant" t 
    ON t."tenant-id" = (u.raw_app_meta_data->>'tenant_id')::uuid
WHERE u.email = 'admin@retailstore.com';

-- Check who owns Greensboro
SELECT "subdomain", "owner-user-id" 
FROM "retail-store-tenant" 
WHERE "subdomain" = 'greensboro';
