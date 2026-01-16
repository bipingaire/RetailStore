-- CHECK USER LINKAGE
-- We need to see EXACTLY what tenant 'admin1@indumart.com' is linked to.

SELECT 
    u.email, 
    u.id as user_id,
    tur."tenant-id" as role_tenant_id, 
    t."store-name", 
    t.subdomain,
    tur."role-type"
FROM auth.users u
LEFT JOIN "tenant-user-role" tur ON u.id = tur."user-id"
LEFT JOIN "retail-store-tenant" t ON tur."tenant-id" = t."tenant-id"
WHERE u.email = 'admin1@indumart.com';
