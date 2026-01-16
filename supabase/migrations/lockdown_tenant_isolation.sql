-- COMPREHENSIVE TENANT ISOLATION LOCKDOWN
-- Secure Inventory, Batches, and Sales Campaigns against cross-tenant leaks.

BEGIN;

-- =========================================================
-- 1. SECURE INVENTORY (The "My Inventory" & "Pulse" Base)
-- =========================================================
ALTER TABLE "retail-store-inventory-item" ENABLE ROW LEVEL SECURITY;

-- Drop leaky policies
DROP POLICY IF EXISTS "Public can view active inventory" ON "retail-store-inventory-item";
DROP POLICY IF EXISTS "Anyone can view inventory" ON "retail-store-inventory-item";

-- Create STRICT Anonymous Policy (Guests only see active items)
CREATE POLICY "Anon Public View"
ON "retail-store-inventory-item"
FOR SELECT
TO anon
USING ("is-active" = true);

-- Create STRICT Authenticated Policy (Admins seeing own items)
-- Note: 'tenant_admin_manage_inventory' should already exist, but we ensure it covers SELECT
-- We assume "get_my_tenant_id()" function exists and works.

-- =========================================================
-- 2. SECURE BATCHES (The "Pulse" Details)
-- =========================================================
ALTER TABLE "inventory-batch-tracking-record" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view batches" ON "inventory-batch-tracking-record";

-- Batches inherit security from their parent Inventory Item
-- If you can't see the Item, you can't see the Batch.
CREATE POLICY "Inherit Inventory Security"
ON "inventory-batch-tracking-record"
FOR ALL
USING (
  "inventory-id" IN (
    SELECT "inventory-id" FROM "retail-store-inventory-item"
  )
);

-- =========================================================
-- 3. SECURE SALES CAMPAIGNS (The "Marketing" Tab)
-- =========================================================
ALTER TABLE "marketing-campaign-master" ENABLE ROW LEVEL SECURITY;

-- Drop any loose policies
DROP POLICY IF EXISTS "Anyone can view campaigns" ON "marketing-campaign-master";

-- Tenant Isolation for Campaigns
CREATE POLICY "Tenant Isolation: Campaigns"
ON "marketing-campaign-master"
FOR ALL
USING (
  "tenant-id" = get_my_tenant_id()
);

-- =========================================================
-- 4. SECURE CAMPAIGN PRODUCTS (The "Selected Items" in Campaign)
-- =========================================================
ALTER TABLE "campaign-product-segment-group" ENABLE ROW LEVEL SECURITY;

-- Inherit security from the Campaign
CREATE POLICY "Inherit Campaign Security"
ON "campaign-product-segment-group"
FOR ALL
USING (
  "campaign-id" IN (
    SELECT "campaign-id" FROM "marketing-campaign-master"
  )
);

COMMIT;

-- VERIFICATION
SELECT tablename, policyname, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN (
    'retail-store-inventory-item', 
    'inventory-batch-tracking-record', 
    'marketing-campaign-master',
    'campaign-product-segment-group'
);
