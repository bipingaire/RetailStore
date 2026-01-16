-- =====================================================
-- FIX: INVOICE SCANNER & VENDOR SCHEMA
-- Addresses 403 Forbidden on Invoice Upload & 400/406 on Vendors
-- =====================================================

-- 1. Ensure 'vendors' table has correct structure (Fixing potential missing cols)
ALTER TABLE "vendors" ADD COLUMN IF NOT EXISTS "contact-phone" TEXT;
ALTER TABLE "vendors" ADD COLUMN IF NOT EXISTS "poc-name" TEXT;
ALTER TABLE "vendors" ADD COLUMN IF NOT EXISTS "fax" TEXT;
ALTER TABLE "vendors" ADD COLUMN IF NOT EXISTS "address" TEXT;

-- 2. Ensure 'uploaded-vendor-invoice-document' exists and has correct columns
CREATE TABLE IF NOT EXISTS "uploaded-vendor-invoice-document" (
    "invoice-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE,
    "file-url-path" TEXT,
    "processing-status" TEXT,
    "supplier-name" TEXT,
    "invoice-number" TEXT,
    "invoice-date" DATE,
    "total-amount-value" DECIMAL(10, 2),
    "ai-extracted-data-json" JSONB,
    "created-at" TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RESET RLS for 'uploaded-vendor-invoice-document' to be sure
ALTER TABLE "uploaded-vendor-invoice-document" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tenant_manage_scanner" ON "uploaded-vendor-invoice-document";
DROP POLICY IF EXISTS "tenant_insert_scanner" ON "uploaded-vendor-invoice-document";
DROP POLICY IF EXISTS "tenant_select_scanner" ON "uploaded-vendor-invoice-document";

-- Split insert/select for clearer debugging if needed, or keep combined
CREATE POLICY "tenant_manage_scanner" 
ON "uploaded-vendor-invoice-document" 
FOR ALL 
TO authenticated
USING ("tenant-id" = get_my_tenant_id())
WITH CHECK ("tenant-id" = get_my_tenant_id());

-- 4. Ensure Vendors RLS is also correct
ALTER TABLE "vendors" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_manage_vendors" ON "vendors";

CREATE POLICY "tenant_manage_vendors" 
ON "vendors" 
FOR ALL 
TO authenticated
USING ("tenant-id" = get_my_tenant_id())
WITH CHECK ("tenant-id" = get_my_tenant_id());

DO $$
BEGIN
  RAISE NOTICE '✅ Fixed Invoice Scanner & Vendor Schema.';
END $$;
