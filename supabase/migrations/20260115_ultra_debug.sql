DO $$
DECLARE
  v_tenant_id UUID;
  v_inv_count INTEGER;
  v_joined_count INTEGER;
  v_rls_enabled BOOLEAN;
BEGIN
  RAISE NOTICE '--- STARTING ULTRA DEBUG ---';

  -- 1. Check Tenant Mapping
  SELECT "tenant-id" INTO v_tenant_id 
  FROM "subdomain-tenant-mapping" 
  WHERE "subdomain" = 'highpoint';

  IF v_tenant_id IS NULL THEN
     RAISE NOTICE '❌ ERROR: Tenant "highpoint" NOT FOUND in mapping table.';
     RETURN;
  ELSE
     RAISE NOTICE '✅ Tenant ID found: %', v_tenant_id;
  END IF;

  -- 2. Check Raw Inventory Count for Tenant
  SELECT count(*) INTO v_inv_count
  FROM "retail-store-inventory-item"
  WHERE "tenant-id" = v_tenant_id;

  RAISE NOTICE '📊 Total Inventory Items for Tenant: %', v_inv_count;

  -- 3. Check Active Inventory Count
  SELECT count(*) INTO v_inv_count
  FROM "retail-store-inventory-item"
  WHERE "tenant-id" = v_tenant_id AND "is-active" = true;

  RAISE NOTICE '📊 Active Inventory Items for Tenant: %', v_inv_count;

  -- 4. Check Join Integriy (Critical!)
  -- If this is 0, it means Inventory exists but has invalid Product IDs
  SELECT count(*) INTO v_joined_count
  FROM "retail-store-inventory-item" i
  JOIN "global-product-master-catalog" p ON i."global-product-id" = p."product-id"
  WHERE i."tenant-id" = v_tenant_id
  AND i."is-active" = true;

  RAISE NOTICE '🔗 Items with VALID Global Product Connection: %', v_joined_count;

  IF v_inv_count > 0 AND v_joined_count = 0 THEN
    RAISE NOTICE '❌ CRITICAL DATA ISSUE: Inventory items exist but "global-product-id" does not match any product in "global-product-master-catalog".';
  END IF;

  -- 5. Check RLS on Inventory Table
  SELECT relrowsecurity INTO v_rls_enabled
  FROM pg_class
  WHERE oid = 'retail-store-inventory-item'::regclass;

  IF v_rls_enabled THEN
     RAISE NOTICE '🔒 RLS is ENABLED on inventory table (This is expected)';
     
     -- Check if "anon" can see records
     -- Note: We can't easily simulate anon SELECT here without complex set_config, 
     -- but we can check if a policy exists.
     IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'retail-store-inventory-item' 
        AND policyname = 'Public can view active inventory'
     ) THEN
        RAISE NOTICE '✅ Policy "Public can view active inventory" EXISTS.';
     ELSE
        RAISE NOTICE '❌ WARNING: Public Policy MISSING. Users might not see data.';
     END IF;
  ELSE
     RAISE NOTICE '🔓 RLS is DISABLED on inventory table (Data should be visible)';
  END IF;

  RAISE NOTICE '--- END DEBUG ---';
END $$;
