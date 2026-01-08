-- =====================================================
-- CROSS-STORE INVENTORY FINDER - LOCATION SUPPORT
-- Add geolocation capabilities for finding nearby stores
-- =====================================================

-- Add location fields to retail-store-tenant table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'retail-store-tenant' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE "retail-store-tenant" 
    ADD COLUMN "latitude" DECIMAL(9, 6),
    ADD COLUMN "longitude" DECIMAL(9, 6),
    ADD COLUMN "store-hours" JSONB,
    ADD COLUMN "features" TEXT[] DEFAULT ARRAY['pickup', 'delivery'],
    ADD COLUMN "timezone" TEXT DEFAULT 'America/New_York';
  END IF;
END $$;

-- Create spatial index for efficient location queries
CREATE INDEX IF NOT EXISTS "idx-store-location-lat" 
  ON "retail-store-tenant"("latitude");

CREATE INDEX IF NOT EXISTS "idx-store-location-lon" 
  ON "retail-store-tenant"("longitude");

-- Notification
DO $$
BEGIN
  RAISE NOTICE '✅ Location fields added to retail-store-tenant table';
END $$;
