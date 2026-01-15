-- 1. Get the tenant ID for 'highpoint'
DO $$
DECLARE
  v_tenant_id UUID;
  v_count INTEGER;
BEGIN
  SELECT "tenant-id" INTO v_tenant_id
  FROM "subdomain-tenant-mapping"
  WHERE "subdomain" = 'highpoint';

  RAISE NOTICE 'Highpoint Tenant ID: %', v_tenant_id;

  IF v_tenant_id IS NULL THEN
    RAISE NOTICE '❌ ERROR: No mapping found for subdomain "highpoint"';
  ELSE
    -- 2. Count active items for this tenant
    SELECT count(*) INTO v_count
    FROM "retail-store-inventory-item"
    WHERE "tenant-id" = v_tenant_id
    AND "is-active" = true;

    RAISE NOTICE '✅ Found % active inventory items for Highpoint', v_count;
    
    -- 3. Show a sample item if any exist
    IF v_count > 0 THEN
       RAISE NOTICE 'Sample Item ID: %', (
         SELECT "inventory-id" FROM "retail-store-inventory-item" 
         WHERE "tenant-id" = v_tenant_id LIMIT 1
       );
    ELSE
       RAISE NOTICE '⚠️ WARNING: Highpoint has NO inventory items. You need to create some or link existing ones.';
    END IF;
  END IF;
END $$;
