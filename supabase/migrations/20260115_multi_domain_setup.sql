-- Multi-Domain Architecture Setup
-- Creates store location mapping for geolocation-based routing

BEGIN;

-- =====================================================
-- 1. CREATE STORE LOCATION MAPPING TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS "store-location-mapping" (
  "location-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant-id" UUID NOT NULL REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE,
  "subdomain" TEXT NOT NULL UNIQUE,
  "latitude" DECIMAL(10,8) NOT NULL,
  "longitude" DECIMAL(11,8) NOT NULL,
  "address-text" TEXT,
  "city" TEXT,
  "state-province" TEXT,
  "country" TEXT DEFAULT 'USA',
  "postal-code" TEXT,
  "is-active" BOOLEAN DEFAULT true,
  "created-at" TIMESTAMPTZ DEFAULT NOW(),
  "updated-at" TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for fast geolocation queries
CREATE INDEX IF NOT EXISTS "idx-store-location-tenant" ON "store-location-mapping"("tenant-id");
CREATE INDEX IF NOT EXISTS "idx-store-location-subdomain" ON "store-location-mapping"("subdomain");
CREATE INDEX IF NOT EXISTS "idx-store-location-active" ON "store-location-mapping"("is-active") WHERE "is-active" = true;

-- Create spatial index for geolocation coordinates (if PostGIS available, otherwise comment out)
-- CREATE INDEX IF NOT EXISTS "idx-store-location-coords" ON "store-location-mapping" USING GIST (ll_to_earth("latitude", "longitude"));

COMMENT ON TABLE "store-location-mapping" IS 'Physical store locations for geolocation-based routing';
COMMENT ON COLUMN "store-location-mapping"."latitude" IS 'Store latitude coordinate (decimal degrees)';
COMMENT ON COLUMN "store-location-mapping"."longitude" IS 'Store longitude coordinate (decimal degrees)';

-- =====================================================
-- 2. SEED SAMPLE STORE LOCATIONS
-- =====================================================

-- First, get or create tenant IDs for our sample stores
DO $$
DECLARE
  v_highpoint_tenant_id UUID;
  v_store2_tenant_id UUID;
BEGIN
  -- Get existing tenant ID for highpoint (or create if needed)
  SELECT "tenant-id" INTO v_highpoint_tenant_id
  FROM "retail-store-tenant"
  WHERE "store-name" ILIKE '%highpoint%' OR "tenant-id" IN (
    SELECT "tenant-id" FROM "subdomain-tenant-mapping" WHERE "subdomain" = 'highpoint'
  )
  LIMIT 1;

  -- If no highpoint tenant exists, create one
  IF v_highpoint_tenant_id IS NULL THEN
    INSERT INTO "retail-store-tenant" (
      "store-name",
      "store-address",
      "store-city",
      "subscription-tier",
      "is-active"
    ) VALUES (
      'HighPoint Indumart Store',
      '123 Main Street',
      'High Point',
      'pro',
      true
    ) RETURNING "tenant-id" INTO v_highpoint_tenant_id;

    -- Create subdomain mapping
    INSERT INTO "subdomain-tenant-mapping" ("subdomain", "tenant-id", "is-active")
    VALUES ('highpoint', v_highpoint_tenant_id, true)
    ON CONFLICT ("subdomain") DO UPDATE SET "tenant-id" = v_highpoint_tenant_id;
  END IF;

  -- Get existing tenant ID for store2 (or create if needed)
  SELECT "tenant-id" INTO v_store2_tenant_id
  FROM "retail-store-tenant"
  WHERE "store-name" ILIKE '%store2%' OR "tenant-id" IN (
    SELECT "tenant-id" FROM "subdomain-tenant-mapping" WHERE "subdomain" = 'store2'
  )
  LIMIT 1;

  -- If no store2 tenant exists, create one
  IF v_store2_tenant_id IS NULL THEN
    INSERT INTO "retail-store-tenant" (
      "store-name",
      "store-address",
      "store-city",
      "subscription-tier",
      "is-active"
    ) VALUES (
      'Greensboro Indumart Store',
      '456 Oak Avenue',
      'Greensboro',
      'pro',
      true
    ) RETURNING "tenant-id" INTO v_store2_tenant_id;

    -- Create subdomain mapping
    INSERT INTO "subdomain-tenant-mapping" ("subdomain", "tenant-id", "is-active")
    VALUES ('store2', v_store2_tenant_id, true)
    ON CONFLICT ("subdomain") DO UPDATE SET "tenant-id" = v_store2_tenant_id;
  END IF;

  -- Insert store locations
  -- HighPoint Store (High Point, NC - Furniture Capital of the World)
  INSERT INTO "store-location-mapping" (
    "tenant-id",
    "subdomain",
    "latitude",
    "longitude",
    "address-text",
    "city",
    "state-province",
    "country",
    "postal-code"
  ) VALUES (
    v_highpoint_tenant_id,
    'highpoint',
    35.9557,      -- High Point, NC coordinates
    -80.0053,
    '123 Main Street',
    'High Point',
    'NC',
    'USA',
    '27260'
  ) ON CONFLICT ("subdomain") DO UPDATE SET
    "latitude" = EXCLUDED."latitude",
    "longitude" = EXCLUDED."longitude",
    "address-text" = EXCLUDED."address-text",
    "updated-at" = NOW();

  -- Store 2 (Greensboro, NC - nearby city, about 15 miles from High Point)
  INSERT INTO "store-location-mapping" (
    "tenant-id",
    "subdomain",
    "latitude",
    "longitude",
    "address-text",
    "city",
    "state-province",
    "country",
    "postal-code"
  ) VALUES (
    v_store2_tenant_id,
    'store2',
    36.0726,      -- Greensboro, NC coordinates
    -79.7920,
    '456 Oak Avenue',
    'Greensboro',
    'NC',
    'USA',
    '27401'
  ) ON CONFLICT ("subdomain") DO UPDATE SET
    "latitude" = EXCLUDED."latitude",
    "longitude" = EXCLUDED."longitude",
    "address-text" = EXCLUDED."address-text",
    "updated-at" = NOW();

  RAISE NOTICE 'Store locations seeded successfully for highpoint and store2';
END $$;

-- =====================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

ALTER TABLE "store-location-mapping" ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active store locations (needed for geolocation API)
DROP POLICY IF EXISTS "store_locations_public_read" ON "store-location-mapping";
CREATE POLICY "store_locations_public_read" 
  ON "store-location-mapping"
  FOR SELECT
  USING ("is-active" = true);

-- Only superadmins can modify store locations
DROP POLICY IF EXISTS "store_locations_superadmin_all" ON "store-location-mapping";
CREATE POLICY "store_locations_superadmin_all"
  ON "store-location-mapping"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "superadmin-users"
      WHERE "user-id" = auth.uid()
      AND "is-active" = true
    )
  );

-- =====================================================
-- 4. CREATE HELPER FUNCTION FOR DISTANCE CALCULATION
-- =====================================================

-- Haversine distance function (returns distance in kilometers)
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 DECIMAL,
  lon1 DECIMAL,
  lat2 DECIMAL,
  lon2 DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
  earth_radius DECIMAL := 6371; -- Earth's radius in kilometers
  dlat DECIMAL;
  dlon DECIMAL;
  a DECIMAL;
  c DECIMAL;
BEGIN
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  
  a := sin(dlat/2) * sin(dlat/2) + 
       cos(radians(lat1)) * cos(radians(lat2)) * 
       sin(dlon/2) * sin(dlon/2);
  
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  
  RETURN earth_radius * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION calculate_distance IS 'Calculate distance between two coordinates using Haversine formula (returns km)';

COMMIT;

-- Verification query
SELECT 
  sl."subdomain",
  t."store-name",
  sl."city",
  sl."state-province",
  sl."latitude",
  sl."longitude",
  sl."is-active"
FROM "store-location-mapping" sl
JOIN "retail-store-tenant" t ON t."tenant-id" = sl."tenant-id"
ORDER BY sl."subdomain";
