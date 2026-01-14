-- Auto-create store location mapping when tenant is created with address
-- This trigger ensures every new store with an address gets a subdomain mapping

BEGIN;

-- =====================================================
-- AUTO-CREATE SUBDOMAIN MAPPING TRIGGER
-- =====================================================

-- Function to auto-create subdomain mapping when tenant is created
CREATE OR REPLACE FUNCTION auto_create_subdomain_mapping()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is a new tenant (INSERT) that doesn't have a mapping yet
  IF TG_OP = 'INSERT' AND NEW.subdomain IS NOT NULL THEN
    INSERT INTO "subdomain-tenant-mapping" (
      "subdomain",
      "tenant-id",
      "is-active"
    ) VALUES (
      NEW.subdomain,
      NEW."tenant-id",
      NEW."is-active"
    )
    ON CONFLICT ("subdomain") DO NOTHING;
    
    RAISE NOTICE 'Auto-created subdomain mapping for: %', NEW.subdomain;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trg_auto_create_subdomain ON "retail-store-tenant";
CREATE TRIGGER trg_auto_create_subdomain
  AFTER INSERT OR UPDATE ON "retail-store-tenant"
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_subdomain_mapping();

COMMENT ON FUNCTION auto_create_subdomain_mapping IS 'Automatically creates subdomain-tenant-mapping entry when tenant is created with subdomain';
COMMENT ON TRIGGER trg_auto_create_subdomain ON "retail-store-tenant" IS 'Auto-creates subdomain mapping for new tenants';

-- =====================================================
-- HELPER VIEW: Stores with Location Status
-- =====================================================

-- View to easily see which stores have been geocoded
CREATE OR REPLACE VIEW "stores-with-location-status" AS
SELECT 
  t."tenant-id",
  t."store-name",
  t."store-address",
  t."store-city",
  t."store-state",
  t."store-zip-code",
  sm."subdomain",
  sl."latitude",
  sl."longitude",
  CASE 
    WHEN sl."location-id" IS NOT NULL THEN true
    ELSE false
  END AS "has-location",
  sl."updated-at" AS "location-updated-at"
FROM "retail-store-tenant" t
LEFT JOIN "subdomain-tenant-mapping" sm ON t."tenant-id" = sm."tenant-id"
LEFT JOIN "store-location-mapping" sl ON sm."subdomain" = sl."subdomain"
WHERE t."is-active" = true
ORDER BY "has-location" ASC, t."created-at" DESC;

COMMENT ON VIEW "stores-with-location-status" IS 'Shows all stores and whether they have been geocoded with location data';

COMMIT;

-- Verification
SELECT * FROM "stores-with-location-status";
