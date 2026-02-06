-- Create Vendors Table (Missing from initial schema)
CREATE TABLE IF NOT EXISTS "vendors" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  
  -- Details
  "contact-phone" TEXT,
  "email" TEXT,
  "website" TEXT,
  "address" TEXT,
  "ein" TEXT,
  "fax" TEXT,
  
  -- POC
  "poc-name" TEXT,
  "poc-phone" TEXT,
  "poc-email" TEXT,
  
  -- Metrics (Denormalized or aggregated)
  "total-spend" DECIMAL(10, 2) DEFAULT 0,
  "invoice-count" INTEGER DEFAULT 0,
  "last-order-date" DATE,
  "reliability-score" INTEGER DEFAULT 100,
  
  "created-at" TIMESTAMPTZ DEFAULT NOW(),
  "updated-at" TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE("tenant-id", "name")
);

-- RLS
ALTER TABLE "vendors" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tenant_vendors_select" ON "vendors";
CREATE POLICY "tenant_vendors_select" ON "vendors"
  FOR SELECT USING ("tenant-id" IN (SELECT "tenant-id" FROM "tenant-user-role" WHERE "user-id" = auth.uid()));

DROP POLICY IF EXISTS "tenant_vendors_insert" ON "vendors";
CREATE POLICY "tenant_vendors_insert" ON "vendors"
  FOR INSERT WITH CHECK ("tenant-id" IN (SELECT "tenant-id" FROM "tenant-user-role" WHERE "user-id" = auth.uid()));

DROP POLICY IF EXISTS "tenant_vendors_update" ON "vendors";
CREATE POLICY "tenant_vendors_update" ON "vendors"
  FOR UPDATE USING ("tenant-id" IN (SELECT "tenant-id" FROM "tenant-user-role" WHERE "user-id" = auth.uid()));

-- Index
CREATE INDEX IF NOT EXISTS "idx_vendors_tenant" ON "vendors"("tenant-id");

-- Update Invoice Table to Reference Vendor (Optional but good)
-- We will just rely on 'supplier-name' text matching for now to avoid breaking existing import logic too much.
