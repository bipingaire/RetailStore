-- RESET RLS COMPLETELY (DYNAMIC CLEANUP)
-- This script dynamically finds ALL policies on the target tables and drops them.
-- Then it rebuilds strict rules. This eliminates "unknown named" zombie policies.

DO $$
DECLARE
  r RECORD;
BEGIN
  -- 1. Loop through ALL policies on the 3 critical tables and drop them
  FOR r IN 
    SELECT schemaname, tablename, policyname 
    FROM pg_policies 
    WHERE tablename IN (
      'retail-store-inventory-item', 
      'inventory-batch-tracking-record', 
      'marketing-campaign-master',
      'campaign-product-segment-group'
    )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    RAISE NOTICE 'Dropped Policy: % on %', r.policyname, r.tablename;
  END LOOP;
END $$;

BEGIN;

-- =================================================================
-- 2. REBUILD STRICT INVENTORY RULES
-- =================================================================
ALTER TABLE "retail-store-inventory-item" FORCE ROW LEVEL SECURITY;

-- NON-LOGGED IN (Guests) -> Only Active Items (For Shop)
CREATE POLICY "Strict_Anon_View"
ON "retail-store-inventory-item"
FOR SELECT
TO anon
USING ("is-active" = true);

-- LOGGED IN ADMINS -> Only THEIR Tenant's Items
-- (Assuming get_my_tenant_id() works correctly, which we verified)
CREATE POLICY "Strict_Tenant_View"
ON "retail-store-inventory-item"
FOR ALL
TO authenticated
USING ("tenant-id" = get_my_tenant_id())
WITH CHECK ("tenant-id" = get_my_tenant_id());

-- SUPERADMINS -> Everything
CREATE POLICY "Strict_Superadmin_View"
ON "retail-store-inventory-item"
FOR ALL
TO authenticated
USING (is_superadmin(auth.uid()));


-- =================================================================
-- 3. REBUILD STRICT BATCH RULES
-- =================================================================
ALTER TABLE "inventory-batch-tracking-record" FORCE ROW LEVEL SECURITY;

-- NO PUBLIC ACCESS AT ALL for Batches.

-- LOGGED IN ADMINS -> Inherit from Inventory Item
-- Validates that the user owns the parent Inventory Item
CREATE POLICY "Strict_Batch_Inherit"
ON "inventory-batch-tracking-record"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "retail-store-inventory-item" i
    WHERE i."inventory-id" = "inventory-batch-tracking-record"."inventory-id"
    AND i."tenant-id" = get_my_tenant_id()
  )
);

-- SUPERADMINS
CREATE POLICY "Strict_Superadmin_Batch"
ON "inventory-batch-tracking-record"
FOR ALL
TO authenticated
USING (is_superadmin(auth.uid()));

-- =================================================================
-- 4. REBUILD STRICT CAMPAIGN RULES
-- =================================================================
ALTER TABLE "marketing-campaign-master" FORCE ROW LEVEL SECURITY;

-- GUESTS -> Active Only
CREATE POLICY "Strict_Campaign_Anon"
ON "marketing-campaign-master"
FOR SELECT
TO anon
USING ("is-active-flag" = true);

-- TENANT ADMINS -> Own Campaigns Only
CREATE POLICY "Strict_Campaign_Tenant"
ON "marketing-campaign-master"
FOR ALL
TO authenticated
USING ("tenant-id" = get_my_tenant_id())
WITH CHECK ("tenant-id" = get_my_tenant_id());

-- SUPERADMINS
CREATE POLICY "Strict_Campaign_Superadmin"
ON "marketing-campaign-master"
FOR ALL
TO authenticated
USING (is_superadmin(auth.uid()));


-- =================================================================
-- 5. REBUILD CAMPAIGN PRODUCT RULES
-- =================================================================
ALTER TABLE "campaign-product-segment-group" FORCE ROW LEVEL SECURITY;

-- INHERIT FROM CAMPAIGN
CREATE POLICY "Strict_Campaign_Product_Inherit"
ON "campaign-product-segment-group"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "marketing-campaign-master" c
    WHERE c."campaign-id" = "campaign-product-segment-group"."campaign-id"
    AND c."tenant-id" = get_my_tenant_id()
  )
);

CREATE POLICY "Strict_Campaign_Product_Superadmin"
ON "campaign-product-segment-group"
FOR ALL
TO authenticated
USING (is_superadmin(auth.uid()));

COMMIT;

-- VERIFICATION output
SELECT tablename, policyname, roles, cmd 
FROM pg_policies 
WHERE tablename IN (
    'retail-store-inventory-item', 
    'inventory-batch-tracking-record', 'marketing-campaign-master'
)
ORDER BY tablename, policyname;
