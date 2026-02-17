-- Seed Tenant Database (retail_tenant_v2)
-- This creates the admin user for Anuj tenant

-- Create Anuj Admin User
-- Email: admin@anuj.com
-- Password: anuj123
-- Role: ADMIN
INSERT INTO "users" ("id", "email", "password", "name", "role", "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@anuj.com',
  '$2b$10$0tTRgnHY8Zduf.gR0v1XPbVJPS7MOIx2',
  'Anuj Admin',
  'ADMIN',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Verify created user
SELECT 'User created:' as status, id, email, name, role, "isActive" 
FROM "users" 
WHERE email = 'admin@anuj.com';
