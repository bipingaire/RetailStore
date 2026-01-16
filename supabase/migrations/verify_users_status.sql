-- DIAGNOSTIC: CHECK ALL USERS
-- Run this to see exactly who exists in your system.

SELECT 
    id, 
    email, 
    CASE WHEN encrypted_password IS NULL THEN 'NO PASSWORD' ELSE 'Has Password' END as pass_status,
    email_confirmed_at, 
    last_sign_in_at,
    raw_user_meta_data->>'full_name' as name,
    raw_app_meta_data->>'tenant_id' as app_tenant_id
FROM auth.users 
WHERE email ILIKE '%indumart.us%';

-- Also check who owns the Greensboro tenant
SELECT "store-name", "owner-user-id" 
FROM "retail-store-tenant" 
WHERE "subdomain" = 'greensboro';
