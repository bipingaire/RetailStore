-- Create Anuj Tenant in Master Database (using schema-master.prisma definition)
INSERT INTO "tenants" ("id", "storeName", "subdomain", "adminEmail", "databaseUrl", "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Anuj Store',
  'anuj',
  'admin@anuj.com',
  'postgresql://postgres:123@localhost:5432/retail_store_anuj',
  true,
  NOW(),
  NOW()
);

-- Show the created tenant
SELECT * FROM "tenants" WHERE subdomain = 'anuj';
