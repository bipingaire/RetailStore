-- Seed Master Database (retail_master_v2)
-- This creates a superadmin and the anuj tenant

-- 1. Create Superadmin
-- Email: superadmin@retailstore.com
-- Password: admin123
INSERT INTO "super_admins" ("id", "email", "password", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'superadmin@retailstore.com',
  '$2b$10$J./QmLXuT6vDl/Me853bxFY0KC0xlS.m',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- 2. Create Anuj Tenant
-- Subdomain: anuj
-- Admin: admin@anuj.com
INSERT INTO "tenants" ("id", "storeName", "subdomain", "databaseUrl", "adminEmail", "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Anuj Store',
  'anuj',
  'postgresql://postgres:123@localhost:5432/retail_tenant_v2?schema=public',
  'admin@anuj.com',
  true,
  NOW(),
  NOW()
) ON CONFLICT (subdomain) DO NOTHING;

-- Verify created records
SELECT 'Superadmin created:' as status, email FROM "super_admins" WHERE email = 'superadmin@retailstore.com';
SELECT 'Tenant created:' as status, subdomain, "storeName", "adminEmail" FROM "tenants" WHERE subdomain = 'anuj';
