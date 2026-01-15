-- =====================================================
-- DIAGNOSTIC: Check Current Inventory vs Master Catalog Status
-- =====================================================
-- This shows what's currently in your system

DO $$
DECLARE
  v_master_count INTEGER;
  v_inventory_count INTEGER;
  v_tenant_count INTEGER;
  v_orphaned_count INTEGER;
  rec RECORD;  -- Declare loop variable
BEGIN
  -- 1. Count products in master catalog
  SELECT COUNT(*) INTO v_master_count 
  FROM "global-product-master-catalog";
  
  RAISE NOTICE '📚 Master Catalog: % products', v_master_count;
  
  -- 2. Count unique global-product-ids used in tenant inventories
  SELECT COUNT(DISTINCT "global-product-id") INTO v_inventory_count
  FROM "retail-store-inventory-item"
  WHERE "global-product-id" IS NOT NULL;
  
  RAISE NOTICE '🏪 Tenant Inventories: % unique product references', v_inventory_count;
  
  -- 3. Count active tenants
  SELECT COUNT(*) INTO v_tenant_count
  FROM "retail-store-tenant";
  
  RAISE NOTICE '🏢 Active Tenants: %', v_tenant_count;
  
  -- 4. Find orphaned references (inventory items pointing to non-existent products)
  SELECT COUNT(DISTINCT i."global-product-id") INTO v_orphaned_count
  FROM "retail-store-inventory-item" i
  LEFT JOIN "global-product-master-catalog" g
    ON i."global-product-id" = g."product-id"
  WHERE g."product-id" IS NULL
    AND i."global-product-id" IS NOT NULL;
  
  IF v_orphaned_count > 0 THEN
    RAISE NOTICE '⚠️  ORPHANED: % inventory items reference missing products!', v_orphaned_count;
    RAISE NOTICE '    Run backfill script to fix this.';
  ELSE
    RAISE NOTICE '✅ No orphaned references found';
  END IF;
  
  -- 5. Show sample inventory items per tenant
  RAISE NOTICE '---';
  RAISE NOTICE 'Sample Inventory by Tenant:';
  
  FOR rec IN (
    SELECT 
      t."store-name",
      COUNT(i."inventory-id") as item_count
    FROM "retail-store-tenant" t
    LEFT JOIN "retail-store-inventory-item" i ON i."tenant-id" = t."tenant-id"
    GROUP BY t."tenant-id", t."store-name"
    ORDER BY item_count DESC
  )
  LOOP
    RAISE NOTICE '  - %: % items', rec."store-name", rec.item_count;
  END LOOP;
  
END $$;
