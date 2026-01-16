-- GUARANTEE INVENTORY ISOLATION (THE NUCLEAR OPTION)
-- This script does not "patch" leaks. It demolishes the old rules and builds a fortress.

BEGIN;

-- =================================================================
-- 1. RESET INVENTORY POLICIES (retail-store-inventory-item)
-- =================================================================
-- Drop ALL existing policies to ensure no "permissive" leaks remain.
DROP POLICY IF EXISTS "Public can view active inventory" ON "retail-store-inventory-item";
DROP POLICY IF EXISTS "Anyone can view inventory" ON "retail-store-inventory-item";
DROP POLICY IF EXISTS "tenant_admin_manage_inventory" ON "retail-store-inventory-item";
DROP POLICY IF EXISTS "superadmin_manage_inventory" ON "retail-store-inventory-item";
DROP POLICY IF EXISTS "Public (Anon) can view active inventory" ON "retail-store-inventory-item";

ALTER TABLE "retail-store-inventory-item" FORCE ROW LEVEL SECURITY;

-- Rule 1: GUESTS (Anon) -> Can see Active items (Strictly Public Storefront)
CREATE POLICY "GUEST_VIEW"
ON "retail-store-inventory-item"
FOR SELECT
TO anon
USING ("is-active" = true);

-- Rule 2: TENANT ADMINS (Authenticated) -> Can see/edit ONLY their own Tenant's items
-- This explicitly checking "tenant-id" vs "get_my_tenant_id()"
CREATE POLICY "TENANT_LEAGAL_VIEW"
ON "retail-store-inventory-item"
FOR ALL
TO authenticated
USING ("tenant-id" = get_my_tenant_id())
WITH CHECK ("tenant-id" = get_my_tenant_id());

-- Rule 3: SUPERADMINS -> Can do everything
CREATE POLICY "SUPERADMIN_GOD_MODE"
ON "retail-store-inventory-item"
FOR ALL
TO authenticated
USING (is_superadmin(auth.uid()));


-- =================================================================
-- 2. RESET PULSE/BATCH POLICIES (inventory-batch-tracking-record)
-- =================================================================
-- Batches are PRIVATE. Guests (Anon) should NEVER see batch details.
DROP POLICY IF EXISTS "Public can view batches" ON "inventory-batch-tracking-record";
DROP POLICY IF EXISTS "Public can view active batches" ON "inventory-batch-tracking-record";
DROP POLICY IF EXISTS "Inherit Inventory Security" ON "inventory-batch-tracking-record";

ALTER TABLE "inventory-batch-tracking-record" FORCE ROW LEVEL SECURITY;

-- Rule 1: TENANT ADMINS (Authenticated) -> Inherit from Inventory Item
-- If I can see the Inventory Item (Rule 2 above), I can see its batches.
CREATE POLICY "BATCH_INHERIT_STRICT"
ON "inventory-batch-tracking-record"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "retail-store-inventory-item" i
    WHERE i."inventory-id" = "inventory-batch-tracking-record"."inventory-id"
    AND i."tenant-id" = get_my_tenant_id() -- Double Lock: Must own parent item
  )
);

-- =================================================================
-- 3. RESET CAMPAIGN POLICIES (marketing-campaign-master)
-- =================================================================
DROP POLICY IF EXISTS "Public can view active campaigns" ON "marketing-campaign-master";
DROP POLICY IF EXISTS "Anyone can view campaigns" ON "marketing-campaign-master";
DROP POLICY IF EXISTS "Tenant Isolation: Campaigns" ON "marketing-campaign-master";

ALTER TABLE "marketing-campaign-master" FORCE ROW LEVEL SECURITY;

-- Rule 1: GUESTS (Anon) -> Can see Active Campaigns
CREATE POLICY "CAMPAIGN_GUEST_VIEW"
ON "marketing-campaign-master"
FOR SELECT
TO anon
USING ("is-active-flag" = true);

-- Rule 2: TENANT ADMINS -> Can see/edit ONLY their own Campaigns
CREATE POLICY "CAMPAIGN_TENANT_VIEW"
ON "marketing-campaign-master"
FOR ALL
TO authenticated
USING ("tenant-id" = get_my_tenant_id())
WITH CHECK ("tenant-id" = get_my_tenant_id());


-- =================================================================
-- 4. CAMPAIGN PRODUCTS
-- =================================================================
DROP POLICY IF EXISTS "Inherit Campaign Security" ON "campaign-product-segment-group";

ALTER TABLE "campaign-product-segment-group" FORCE ROW LEVEL SECURITY;

CREATE POLICY "CAMPAIGN_PRODUCT_INHERIT"
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

COMMIT;

-- VERIFY
SELECT tablename, policyname, roles, cmd FROM pg_policies 
WHERE tablename IN ('retail-store-inventory-item', 'inventory-batch-tracking-record', 'marketing-campaign-master');
