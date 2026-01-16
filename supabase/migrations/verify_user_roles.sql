-- DIAGNOSTIC: CHECK USER ROLES
-- This table controls Access and Data Visibility.

SELECT 
    r.id,
    r."user-id",
    r."tenant-id",
    r."role-type",
    t."store-name",
    t."subdomain"
FROM "tenant-user-role" r
JOIN "retail-store-tenant" t ON r."tenant-id" = t."tenant-id"
WHERE r."user-id" = (SELECT id FROM auth.users WHERE email = 'admin@retailstore.com');
