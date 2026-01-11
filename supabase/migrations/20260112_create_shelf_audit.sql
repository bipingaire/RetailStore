-- =================================================================
-- CREATE SHELF AUDIT RECORD TABLE
-- =================================================================

CREATE TABLE IF NOT EXISTS "shelf-audit-record" (
  "audit-id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE,
  "performed-by-user-id" UUID, -- Can be null if using anon token (not recommended but fallback)
  "audit-date" TIMESTAMPTZ DEFAULT NOW(),
  "total-items-checked" INT,
  "total-discrepancies" INT,
  "notes" TEXT
);

CREATE TABLE IF NOT EXISTS "shelf-audit-item" (
  "audit-item-id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "audit-id" UUID REFERENCES "shelf-audit-record"("audit-id") ON DELETE CASCADE,
  "inventory-id" UUID REFERENCES "retail-store-inventory-item"("inventory-id") ON DELETE CASCADE,
  "expected-quantity" INT,
  "actual-quantity" INT,
  "variance-quantity" INT GENERATED ALWAYS AS ("actual-quantity" - "expected-quantity") STORED,
  "reason-code" TEXT
);

-- Index for faster lookups
CREATE INDEX idx_audit_record_tenant ON "shelf-audit-record"("tenant-id");
CREATE INDEX idx_audit_item_audit ON "shelf-audit-item"("audit-id");

-- Disable RLS
ALTER TABLE "shelf-audit-record" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "shelf-audit-item" DISABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  RAISE NOTICE '✅ Shelf Audit tables created.';
END $$;
