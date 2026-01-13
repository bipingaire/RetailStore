-- =================================================================
-- CREATE POS ITEM MAPPING TABLE
-- =================================================================

CREATE TABLE IF NOT EXISTS "pos-item-mapping" (
  "mapping-id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE,
  "pos-item-name" TEXT NOT NULL,
  "pos-item-code" TEXT,
  "matched-inventory-id" UUID REFERENCES "retail-store-inventory-item"("inventory-id") ON DELETE SET NULL,
  "last-sold-price" DECIMAL(10,2),
  "is-verified" BOOLEAN DEFAULT false,
  "created-at" TIMESTAMPTZ DEFAULT NOW(),
  "updated-at" TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_pos_mapping_tenant ON "pos-item-mapping"("tenant-id");

-- Disable RLS (as requested for other tables) to ensure visibility
ALTER TABLE "pos-item-mapping" DISABLE ROW LEVEL SECURITY;

-- =================================================================
-- SEED SAMPLE DATA (Linked to the first tenant)
-- =================================================================
WITH first_tenant AS (
  SELECT "tenant-id" FROM "retail-store-tenant" LIMIT 1
)
INSERT INTO "pos-item-mapping" ("tenant-id", "pos-item-name", "pos-item-code", "last-sold-price", "is-verified")
SELECT 
  (SELECT "tenant-id" FROM first_tenant),
  'UNKNOWN ITEM - SCANNED 12345',
  '12345',
  5.00,
  false
WHERE NOT EXISTS (SELECT 1 FROM "pos-item-mapping" WHERE "pos-item-code" = '12345');

WITH first_tenant AS (
  SELECT "tenant-id" FROM "retail-store-tenant" LIMIT 1
)
INSERT INTO "pos-item-mapping" ("tenant-id", "pos-item-name", "pos-item-code", "last-sold-price", "is-verified")
SELECT 
  (SELECT "tenant-id" FROM first_tenant),
  'GENERIC SODA CAN',
  '54321',
  1.50,
  false
WHERE NOT EXISTS (SELECT 1 FROM "pos-item-mapping" WHERE "pos-item-code" = '54321');

DO $$
BEGIN
  RAISE NOTICE '✅ POS Item Mapping table created and seeded.';
END $$;
