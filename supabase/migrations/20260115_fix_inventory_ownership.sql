DO $$
DECLARE
  v_tenant_id UUID;
  v_updated_inv INTEGER;
  v_updated_camp INTEGER;
BEGIN
  -- 1. Get Highpoint Tenant ID
  SELECT "tenant-id" INTO v_tenant_id 
  FROM "subdomain-tenant-mapping" 
  WHERE "subdomain" = 'highpoint';
  
  IF v_tenant_id IS NULL THEN
     RAISE EXCEPTION '❌ Critical Error: "highpoint" tenant not found in mapping table.';
  END IF;

  RAISE NOTICE 'Target Tenant ID: %', v_tenant_id;

  -- 2. Link ALL Inventory to Highpoint (Fixing orphaned/wrong items)
  WITH rows AS (
    UPDATE "retail-store-inventory-item"
    SET "tenant-id" = v_tenant_id,
        "is-active" = true -- Force active
    WHERE "tenant-id" IS NULL OR "tenant-id" != v_tenant_id
    RETURNING 1
  )
  SELECT count(*) INTO v_updated_inv FROM rows;

  -- 3. Link ALL Campaigns to Highpoint
  WITH rows AS (
      UPDATE "marketing-campaign-master"
      SET "tenant-id" = v_tenant_id
      WHERE "tenant-id" IS NULL OR "tenant-id" != v_tenant_id
      RETURNING 1
  )
  SELECT count(*) INTO v_updated_camp FROM rows;
  
  RAISE NOTICE '✅ FIXED: Linked % inventory items to Highpoint', v_updated_inv;
  RAISE NOTICE '✅ FIXED: Linked % campaigns to Highpoint', v_updated_camp;

END $$;
