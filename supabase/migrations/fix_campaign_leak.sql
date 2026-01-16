-- FIX CAMPAIGN LEAK (Targeting Exact Policy Name from Screenshot)

BEGIN;

-- 1. FIX CAMPAIGNS (marketing-campaign-master)
-- The screenshot showed "Public can view active campaigns" is applied to {anon, authenticated}
-- This causes the leak for Admins.

DROP POLICY IF EXISTS "Public can view active campaigns" ON "marketing-campaign-master";

-- Re-create for ANON (Guests) only
CREATE POLICY "Public (Anon) can view active campaigns"
ON "marketing-campaign-master"
FOR SELECT
TO anon
USING ("is-active-flag" = true);

-- 2. FIX BATCHES (inventory-batch-tracking-record)
-- Just in case there is a "Public can view..." here too
DROP POLICY IF EXISTS "Public can view batches" ON "inventory-batch-tracking-record";
DROP POLICY IF EXISTS "Public can view active batches" ON "inventory-batch-tracking-record";

-- Ensure strict inheritance from Inventory Item
-- (If this policy already exists from previous script, this is a no-op or replaces it)
DROP POLICY IF EXISTS "Inherit Inventory Security" ON "inventory-batch-tracking-record";

CREATE POLICY "Inherit Inventory Security"
ON "inventory-batch-tracking-record"
FOR ALL
USING (
  "inventory-id" IN (
    SELECT "inventory-id" FROM "retail-store-inventory-item"
  )
);

COMMIT;

-- VERIFICATION
SELECT tablename, policyname, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'marketing-campaign-master';
