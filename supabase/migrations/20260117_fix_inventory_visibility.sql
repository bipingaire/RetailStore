-- ========================================================
-- STRICT TENANT ISOLATION: INVENTORY & OPERATIONS (CORRECTED)
-- Enforce "One Tenant Cannot See Data of Other"
-- covers: Inventory, POS Sales (Z-Reports), Shelf Audit, Restock
-- ========================================================

-- 1. INVENTORY (Enable RLS & Policy)
ALTER TABLE "retail-store-inventory-item" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tenant_isolation_inventory" ON "retail-store-inventory-item";
-- Allow Select/Insert/Update/Delete ONLY if tenant matches
CREATE POLICY "tenant_isolation_inventory" 
ON "retail-store-inventory-item"
FOR ALL 
TO authenticated
USING (
    "tenant-id" = get_my_tenant_id() 
    OR is_superadmin(auth.uid())
)
WITH CHECK (
    "tenant-id" = get_my_tenant_id() 
    OR is_superadmin(auth.uid())
);

-- 2. POS SALES (Z-Reports) - Correct Table Name: "daily_sales_z_report_data"
-- Ensure 'tenant_id' column exists for RLS
ALTER TABLE "daily_sales_z_report_data" ADD COLUMN IF NOT EXISTS "tenant_id" UUID REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE;

ALTER TABLE "daily_sales_z_report_data" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tenant_isolation_pos" ON "daily_sales_z_report_data";
CREATE POLICY "tenant_isolation_pos" 
ON "daily_sales_z_report_data"
FOR ALL 
TO authenticated
USING ("tenant_id" = get_my_tenant_id() OR is_superadmin(auth.uid()));

-- Also secure the mapping table if it exists
CREATE TABLE IF NOT EXISTS "pos-item-mapping" (
    "mapping-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id")
); -- Prevent error if exists

ALTER TABLE "pos-item-mapping" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_pos_map" ON "pos-item-mapping";
CREATE POLICY "tenant_isolation_pos_map" ON "pos-item-mapping" FOR ALL TO authenticated
USING ("tenant-id" = get_my_tenant_id() OR is_superadmin(auth.uid()));


-- 3. SHELF AUDIT (Inventory Check)
-- Ensure table exists first (it was added recently)
CREATE TABLE IF NOT EXISTS "shelf-audit-record" (
    "audit-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE,
    "user-id" UUID REFERENCES auth.users(id),
    "category-filter" TEXT,
    "variance-count" INTEGER,
    "created-at" TIMESTAMPTZ DEFAULT NOW(),
    -- Add items JSON storage if needed, assuming detail table or json col
    "audit-data-json" JSONB
);

ALTER TABLE "shelf-audit-record" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tenant_isolation_audit" ON "shelf-audit-record";
CREATE POLICY "tenant_isolation_audit" 
ON "shelf-audit-record"
FOR ALL 
TO authenticated
USING ("tenant-id" = get_my_tenant_id() OR is_superadmin(auth.uid()));


-- 4. PURCHASE ORDERS (Restock)
CREATE TABLE IF NOT EXISTS "purchase-orders" (
    "po-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id"),
    "vendor-id" UUID,
    "total-amount" DECIMAL(10,2),
    "status" TEXT,
    "created-at" TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE "purchase-orders" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tenant_isolation_po" ON "purchase-orders";
CREATE POLICY "tenant_isolation_po" 
ON "purchase-orders"
FOR ALL 
TO authenticated
USING ("tenant-id" = get_my_tenant_id() OR is_superadmin(auth.uid()));


DO $$
BEGIN
  RAISE NOTICE '✅ Strict Tenant Isolation Enforced (Corrected Tables).';
END $$;
