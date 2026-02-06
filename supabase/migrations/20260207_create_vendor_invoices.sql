-- Create Vendor Invoices Table
-- Matches schema expected by app/admin/vendors and app/admin/invoices

CREATE TABLE IF NOT EXISTS "vendor-invoices" (
  "invoice-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE,
  "vendor-name" TEXT, -- Can be linked to vendors table later, but code uses text
  "invoice-number" TEXT,
  "invoice-date" TIMESTAMPTZ,
  "due-date" TIMESTAMPTZ,
  "total-amount" DECIMAL(10, 2) DEFAULT 0,
  "status" TEXT DEFAULT 'pending', -- pending, paid, overdue
  "image-url" TEXT,
  "line-items-json" JSONB, -- Stores items from invoice scan
  "created-at" TIMESTAMPTZ DEFAULT NOW(),
  "updated-at" TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS "idx_vendor_invoices_tenant" ON "vendor-invoices"("tenant-id");
CREATE INDEX IF NOT EXISTS "idx_vendor_invoices_date" ON "vendor-invoices"("invoice-date");

-- RLS
ALTER TABLE "vendor-invoices" ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "tenant_vendor_invoices_select" ON "vendor-invoices";
CREATE POLICY "tenant_vendor_invoices_select" ON "vendor-invoices"
  FOR SELECT USING ("tenant-id" IN (SELECT "tenant-id" FROM "tenant-user-role" WHERE "user-id" = auth.uid()));

DROP POLICY IF EXISTS "tenant_vendor_invoices_insert" ON "vendor-invoices";
CREATE POLICY "tenant_vendor_invoices_insert" ON "vendor-invoices"
  FOR INSERT WITH CHECK ("tenant-id" IN (SELECT "tenant-id" FROM "tenant-user-role" WHERE "user-id" = auth.uid()));

DROP POLICY IF EXISTS "tenant_vendor_invoices_update" ON "vendor-invoices";
CREATE POLICY "tenant_vendor_invoices_update" ON "vendor-invoices"
  FOR UPDATE USING ("tenant-id" IN (SELECT "tenant-id" FROM "tenant-user-role" WHERE "user-id" = auth.uid()));

DROP POLICY IF EXISTS "tenant_vendor_invoices_delete" ON "vendor-invoices";
CREATE POLICY "tenant_vendor_invoices_delete" ON "vendor-invoices"
  FOR DELETE USING ("tenant-id" IN (SELECT "tenant-id" FROM "tenant-user-role" WHERE "user-id" = auth.uid()));

-- Grant access
GRANT ALL ON "vendor-invoices" TO authenticated;
