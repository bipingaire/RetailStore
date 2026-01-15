-- 1. Allow Public Read on Subdomain Mapping (so frontend can find tenant ID)
ALTER TABLE "subdomain-tenant-mapping" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can lookup tenants" ON "subdomain-tenant-mapping";
CREATE POLICY "Public can lookup tenants"
ON "subdomain-tenant-mapping"
FOR SELECT
TO anon, authenticated
USING (true); -- Allow looking up any subdomain mapping

-- 2. Allow Public Read on Inventory Items (so store visitors can see products)
ALTER TABLE "retail-store-inventory-item" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active inventory" ON "retail-store-inventory-item";
CREATE POLICY "Public can view active inventory"
ON "retail-store-inventory-item"
FOR SELECT
TO anon, authenticated
USING ("is-active" = true); -- Allow viewing any active item (filtered by tenant in frontend)

-- 3. Allow Public Read on Campaigns (so store visitors can see deals)
ALTER TABLE "marketing-campaign-master" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active campaigns" ON "marketing-campaign-master";
CREATE POLICY "Public can view active campaigns"
ON "marketing-campaign-master"
FOR SELECT
TO anon, authenticated
USING ("is-active-flag" = true);
