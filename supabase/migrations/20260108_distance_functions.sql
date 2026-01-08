-- =====================================================
-- DISTANCE CALCULATION FUNCTIONS
-- Haversine formula for calculating distance between coordinates
-- =====================================================

-- Function to calculate distance between two points in miles
CREATE OR REPLACE FUNCTION calculate_distance_miles(
  lat1 DECIMAL, 
  lon1 DECIMAL,
  lat2 DECIMAL, 
  lon2 DECIMAL
)
RETURNS DECIMAL AS $$
DECLARE
  earth_radius DECIMAL := 3959; -- miles
  dlat DECIMAL;
  dlon DECIMAL;
  a DECIMAL;
  c DECIMAL;
BEGIN
  -- Haversine formula
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  
  a := sin(dlat/2) * sin(dlat/2) + 
       cos(radians(lat1)) * cos(radians(lat2)) * 
       sin(dlon/2) * sin(dlon/2);
  
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  
  RETURN earth_radius * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to find stores within radius of a location
CREATE OR REPLACE FUNCTION find_stores_within_radius(
  user_lat DECIMAL,
  user_lon DECIMAL,
  radius_miles DECIMAL DEFAULT 25
)
RETURNS TABLE (
  tenant_id UUID,
  store_name TEXT,
  distance_miles DECIMAL,
  latitude DECIMAL,
  longitude DECIMAL,
  store_address TEXT,
  phone_number TEXT,
  subdomain TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t."tenant-id",
    t."store-name",
    calculate_distance_miles(user_lat, user_lon, t."latitude", t."longitude") as distance_miles,
    t."latitude",
    t."longitude",
    t."store-address",
    t."phone-number",
    t."subdomain"
  FROM "retail-store-tenant" t
  WHERE 
    t."is-active" = true
    AND t."latitude" IS NOT NULL
    AND t."longitude" IS NOT NULL
    AND calculate_distance_miles(user_lat, user_lon, t."latitude", t."longitude") <= radius_miles
  ORDER BY distance_miles ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Notification
DO $$
BEGIN
  RAISE NOTICE '✅ Distance calculation functions created';
END $$;
