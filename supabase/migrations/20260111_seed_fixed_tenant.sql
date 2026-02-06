-- =====================================================
-- SEED FIXED TENANT
-- Inserts a tenant with a known UUID for development/testing
-- =====================================================

INSERT INTO "retail-store-tenant" (
    "tenant-id", 
    "store-name", 
    "store-address", 
    "store-city", 
    "subscription-tier",
    "subdomain"
)
VALUES (
    '11111111-1111-1111-1111-111111111111', 
    'InduMart Demo', 
    '123 Demo St', 
    'Tech City', 
    'pro',
    'indumart'
)
ON CONFLICT ("tenant-id") DO UPDATE 
SET "store-name" = EXCLUDED."store-name";

-- Ensure Subdomain Mapping exists
INSERT INTO "subdomain-tenant-mapping" ("subdomain", "tenant-id")
VALUES ('indumart', '11111111-1111-1111-1111-111111111111')
ON CONFLICT ("subdomain") DO NOTHING;

DO $$
BEGIN
  RAISE NOTICE '✅ Seeded Fixed Tenant: InduMart Demo (ID: 11111111-1111-1111-1111-111111111111)';
END $$;
