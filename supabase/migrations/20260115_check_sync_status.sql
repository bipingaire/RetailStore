-- Simple diagnostic query that returns results as rows
SELECT 
  'Master Catalog Products' as metric,
  COUNT(*)::text as value
FROM "global-product-master-catalog"

UNION ALL

SELECT 
  'Unique Products in Tenant Inventories',
  COUNT(DISTINCT "global-product-id")::text
FROM "retail-store-inventory-item"
WHERE "global-product-id" IS NOT NULL

UNION ALL

SELECT 
  'Active Tenants',
  COUNT(*)::text
FROM "retail-store-tenant"

UNION ALL

SELECT 
  'Orphaned Products (Need Backfill)',
  COUNT(DISTINCT i."global-product-id")::text
FROM "retail-store-inventory-item" i
LEFT JOIN "global-product-master-catalog" g
  ON i."global-product-id" = g."product-id"
WHERE g."product-id" IS NULL
  AND i."global-product-id" IS NOT NULL;
