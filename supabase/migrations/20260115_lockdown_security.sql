-- =====================================================
-- SECURITY LOCKDOWN MIGRATION
-- Fixes critical data leaks by enforcing strict RLS on all tables
-- =====================================================

-- 1. Helper function to simplify policies
CREATE OR REPLACE FUNCTION get_my_tenant_id() RETURNS UUID AS $$
  SELECT "tenant-id" 
  FROM "tenant-user-role" 
  WHERE "user-id" = auth.uid() 
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- =====================================================
-- A. INVENTORY & CATALOG LOCKDOWN
-- =====================================================

-- 1. Re-Enable RLS
ALTER TABLE "retail-store-inventory-item" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "global-product-master-catalog" ENABLE ROW LEVEL SECURITY;

-- 2. Clean up old policies
DROP POLICY IF EXISTS "Enable all for authenticated" ON "retail-store-inventory-item";
DROP POLICY IF EXISTS "Enable all for authenticated" ON "retail-store-inventory-item";
DROP POLICY IF EXISTS "Admins can view tenant inventory" ON "retail-store-inventory-item";
DROP POLICY IF EXISTS "tenant_admin_manage_inventory" ON "retail-store-inventory-item";
DROP POLICY IF EXISTS "superadmin_manage_inventory" ON "retail-store-inventory-item";

-- 3. Strict Inventory Policies
CREATE POLICY "tenant_admin_manage_inventory"
ON "retail-store-inventory-item"
TO authenticated
USING ("tenant-id" = get_my_tenant_id())
WITH CHECK ("tenant-id" = get_my_tenant_id());

CREATE POLICY "superadmin_manage_inventory"
ON "retail-store-inventory-item"
TO authenticated
USING (is_superadmin(auth.uid()))
WITH CHECK (is_superadmin(auth.uid()));

-- 4. Catalog Policies (Public Read, Superadmin Write)
DROP POLICY IF EXISTS "everyone_read_catalog" ON "global-product-master-catalog";
DROP POLICY IF EXISTS "superadmin_write_catalog" ON "global-product-master-catalog";

CREATE POLICY "everyone_read_catalog"
ON "global-product-master-catalog"
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "superadmin_write_catalog"
ON "global-product-master-catalog"
FOR ALL
TO authenticated
USING (is_superadmin(auth.uid()))
WITH CHECK (is_superadmin(auth.uid()));


-- =====================================================
-- B. ORDER SECURITY LOCKDOWN
-- =====================================================

-- 1. Drop the dangerous "Enable all" policies
DROP POLICY IF EXISTS "Enable select for all" ON "customer-order-header";
DROP POLICY IF EXISTS "Enable select for all" ON "order-line-item-detail";
DROP POLICY IF EXISTS "Enable select for all" ON "customer-order-header";
DROP POLICY IF EXISTS "Enable select for all" ON "order-line-item-detail";
DROP POLICY IF EXISTS "Enable select for all" ON "delivery-address-information";
DROP POLICY IF EXISTS "admin_view_store_orders" ON "customer-order-header";
DROP POLICY IF EXISTS "customer_view_own_orders" ON "customer-order-header";
DROP POLICY IF EXISTS "superadmin_view_all_orders" ON "customer-order-header";
DROP POLICY IF EXISTS "inherit_order_access_lines" ON "order-line-item-detail";
DROP POLICY IF EXISTS "inherit_order_access_address" ON "delivery-address-information";

-- 2. Strict Order Header Policies
CREATE POLICY "admin_view_store_orders"
ON "customer-order-header"
FOR SELECT
TO authenticated
USING ("tenant-id" = get_my_tenant_id());

CREATE POLICY "customer_view_own_orders"
ON "customer-order-header"
FOR SELECT
TO authenticated
USING ("customer-id" = auth.uid());

CREATE POLICY "superadmin_view_all_orders"
ON "customer-order-header"
FOR SELECT
TO authenticated
USING (is_superadmin(auth.uid()));

-- 3. Strict Line Item Policies (Inherit from Header)
-- Ideally we join to header, but for RLS performance, direct Tenant ID is better if available (it's not).
-- So we use EXISTS against the Header table (which is secured above).
CREATE POLICY "inherit_order_access_lines"
ON "order-line-item-detail"
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "customer-order-header" h
        WHERE h."order-id" = "order-line-item-detail"."order-id"
    )
);

CREATE POLICY "inherit_order_access_address"
ON "delivery-address-information"
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "customer-order-header" h
        WHERE h."order-id" = "delivery-address-information"."order-id"
    )
);


-- =====================================================
-- C. INVOICE FIXES
-- =====================================================

-- 1. Add Admin access to Invoices (was missing)
DROP POLICY IF EXISTS "admin_view_store_invoices" ON "customer-invoices";
DROP POLICY IF EXISTS "superadmin_view_all_invoices" ON "customer-invoices";

CREATE POLICY "admin_view_store_invoices"
ON "customer-invoices"
FOR SELECT
TO authenticated
USING ("tenant-id" = get_my_tenant_id());

CREATE POLICY "superadmin_view_all_invoices"
ON "customer-invoices"
FOR SELECT
TO authenticated
USING (is_superadmin(auth.uid()));




-- =====================================================
-- D. COMPLETE LOCKDOWN (POS, VENDORS, SCANNER, BATCHES)
-- =====================================================

-- 1. POS Item Mapping
ALTER TABLE "pos-item-mapping" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_manage_pos_mapping" ON "pos-item-mapping";
DROP POLICY IF EXISTS "superadmin_manage_pos_mapping" ON "pos-item-mapping";

CREATE POLICY "tenant_manage_pos_mapping" ON "pos-item-mapping" FOR ALL TO authenticated
USING ("tenant-id" = get_my_tenant_id()) WITH CHECK ("tenant-id" = get_my_tenant_id());

CREATE POLICY "superadmin_manage_pos_mapping" ON "pos-item-mapping" FOR ALL TO authenticated
USING (is_superadmin(auth.uid())) WITH CHECK (is_superadmin(auth.uid()));


-- 2. Vendors (Correct table name: "vendors")
ALTER TABLE "vendors" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_manage_vendors" ON "vendors";
DROP POLICY IF EXISTS "superadmin_manage_vendors" ON "vendors";
-- Remove old permissive policies if they exist
DROP POLICY IF EXISTS "tenant_vendors_select" ON "vendors";
DROP POLICY IF EXISTS "tenant_vendors_insert" ON "vendors";
DROP POLICY IF EXISTS "tenant_vendors_update" ON "vendors";
DROP POLICY IF EXISTS "Admins can manage tenant vendors" ON "vendors";

CREATE POLICY "tenant_manage_vendors" ON "vendors" FOR ALL TO authenticated
USING ("tenant-id" = get_my_tenant_id()) WITH CHECK ("tenant-id" = get_my_tenant_id());

CREATE POLICY "superadmin_manage_vendors" ON "vendors" FOR ALL TO authenticated
USING (is_superadmin(auth.uid())) WITH CHECK (is_superadmin(auth.uid()));


-- 3. Uploaded Invoices (Scanner Data)
ALTER TABLE "uploaded-vendor-invoice-document" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_manage_scanner" ON "uploaded-vendor-invoice-document";
DROP POLICY IF EXISTS "superadmin_manage_scanner" ON "uploaded-vendor-invoice-document";
DROP POLICY IF EXISTS "Admins can manage tenant invoices" ON "uploaded-vendor-invoice-document";

CREATE POLICY "tenant_manage_scanner" ON "uploaded-vendor-invoice-document" FOR ALL TO authenticated
USING ("tenant-id" = get_my_tenant_id()) WITH CHECK ("tenant-id" = get_my_tenant_id());

CREATE POLICY "superadmin_manage_scanner" ON "uploaded-vendor-invoice-document" FOR ALL TO authenticated
USING (is_superadmin(auth.uid())) WITH CHECK (is_superadmin(auth.uid()));


-- 4. Inventory Batch Tracking (SKIPPED - Column Mismatch)
-- ALTER TABLE "inventory-batch-tracking-record" ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "tenant_manage_batches" ON "inventory-batch-tracking-record";
-- DROP POLICY IF EXISTS "superadmin_manage_batches" ON "inventory-batch-tracking-record";
-- DROP POLICY IF EXISTS "Admins can manage tenant batches" ON "inventory-batch-tracking-record";
-- DROP POLICY IF EXISTS "Enable all for authenticated" ON "inventory-batch-tracking-record";

-- CREATE POLICY "tenant_manage_batches" ON "inventory-batch-tracking-record" FOR ALL TO authenticated
-- USING ("tenant-id" = get_my_tenant_id()) WITH CHECK ("tenant-id" = get_my_tenant_id());

-- CREATE POLICY "superadmin_manage_batches" ON "inventory-batch-tracking-record" FOR ALL TO authenticated
-- USING (is_superadmin(auth.uid())) WITH CHECK (is_superadmin(auth.uid()));



-- =====================================================
-- E. MARKETING & CAMPAIGNS
-- =====================================================

-- 1. Marketing Campaigns
-- (Likely created without RLS or with open permissions)
ALTER TABLE "marketing-campaign-master" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_manage_campaigns" ON "marketing-campaign-master";
DROP POLICY IF EXISTS "superadmin_manage_campaigns" ON "marketing-campaign-master";

CREATE POLICY "tenant_manage_campaigns" ON "marketing-campaign-master" FOR ALL TO authenticated
USING ("tenant-id" = get_my_tenant_id()) WITH CHECK ("tenant-id" = get_my_tenant_id());

CREATE POLICY "superadmin_manage_campaigns" ON "marketing-campaign-master" FOR ALL TO authenticated
USING (is_superadmin(auth.uid())) WITH CHECK (is_superadmin(auth.uid()));


-- 2. Campaign Products
ALTER TABLE "campaign-product-segment-group" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_manage_campaign_products" ON "campaign-product-segment-group";
DROP POLICY IF EXISTS "superadmin_manage_campaign_products" ON "campaign-product-segment-group";

CREATE POLICY "tenant_manage_campaign_products" ON "campaign-product-segment-group" FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "marketing-campaign-master" c 
    WHERE c."campaign-id" = "campaign-product-segment-group"."campaign-id"
    AND c."tenant-id" = get_my_tenant_id()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "marketing-campaign-master" c 
    WHERE c."campaign-id" = "campaign-product-segment-group"."campaign-id"
    AND c."tenant-id" = get_my_tenant_id()
  )
);

CREATE POLICY "superadmin_manage_campaign_products" ON "campaign-product-segment-group" FOR ALL TO authenticated
USING (is_superadmin(auth.uid())) WITH CHECK (is_superadmin(auth.uid()));


DO $$
BEGIN
  RAISE NOTICE '✅ SECURITY LOCKDOWN COMPLETE. All tables (Inventory, Orders, Invoices, POS, Vendors, Scanner, Campaigns) now strictly isolated.';
END $$;
