-- ========================================================
-- SECURE PUBLIC ACCESS: VIEWS FOR SAFE SHOPPING
-- Problem: Allowing "Public Read" on the main table exposes "Cost Price" and "Supplier Info".
-- Solution: 
-- 1. Revert Tables to STRICT RLS (Staff Only).
-- 2. Create VIEWS that only expose safe columns (Price, Name, Stock) for the Shop App.
-- ========================================================

-- 1. RE-LOCKDOWN INVENTORY TABLE (Strict Staff Only)
ALTER TABLE "retail-store-inventory-item" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_inventory" ON "retail-store-inventory-item";

-- Ensure strict policies exist (re-apply if needed to be sure)
DROP POLICY IF EXISTS "tenant_isolation_inventory" ON "retail-store-inventory-item";
DROP POLICY IF EXISTS "tenant_write_inventory" ON "retail-store-inventory-item";
DROP POLICY IF EXISTS "tenant_full_access_inventory" ON "retail-store-inventory-item";

CREATE POLICY "tenant_full_access_inventory"
ON "retail-store-inventory-item"
FOR ALL
TO authenticated
USING (
    ("tenant-id" = get_my_tenant_id()) OR (is_superadmin(auth.uid()))
)
WITH CHECK (
    ("tenant-id" = get_my_tenant_id()) OR (is_superadmin(auth.uid()))
);


-- 2. CREATE SECURE VIEW FOR INVENTORY (Public Read)
DROP VIEW IF EXISTS "store_inventory_view" CASCADE;

CREATE OR REPLACE VIEW "store_inventory_view" AS
SELECT 
    i."inventory-id" as id,
    i."tenant-id",
    i."selling-price-amount" as price,
    i."current-stock-quantity" as stock,
    i."is-active",
    -- Join Global Product Data
    p."product-name" as name,
    p."image-url",
    p."category-name" as category,
    p."manufacturer-name" as manufacturer,
    p."upc-ean-code" as upc_ean
FROM "retail-store-inventory-item" i
JOIN "global-product-master-catalog" p ON i."global-product-id" = p."product-id" -- CORRECTED JOIN COLUMN
WHERE i."is-active" = true;

-- Grant Access to Public
GRANT SELECT ON "store_inventory_view" TO postgres, anon, authenticated, service_role;


-- 3. RE-LOCKDOWN CAMPAIGNS (Strict Staff Only)
ALTER TABLE "marketing-campaign-master" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_campaigns" ON "marketing-campaign-master";
-- (Existing tenant_write_campaigns or similar will handle staff access, but let's ensure one exists)
DROP POLICY IF EXISTS "tenant_full_access_campaigns" ON "marketing-campaign-master";
CREATE POLICY "tenant_full_access_campaigns"
ON "marketing-campaign-master"
FOR ALL TO authenticated
USING ( "tenant-id" = get_my_tenant_id() OR is_superadmin(auth.uid()) )
WITH CHECK ( "tenant-id" = get_my_tenant_id() OR is_superadmin(auth.uid()) );


-- 4. CREATE SECURE VIEW FOR CAMPAIGNS (Public Read)
DROP VIEW IF EXISTS "store_campaigns_view" CASCADE;

CREATE OR REPLACE VIEW "store_campaigns_view" AS
SELECT
    c."campaign-id" as id,
    c."tenant-id",
    c."campaign-slug" as slug,
    c."title-text" as title,
    c."subtitle-text" as subtitle,
    c."badge-label",
    c."badge-color",
    c."tagline-text" as tagline,
    c."campaign-type" as segment_type,
    c."sort-order",
    c."is-promoted",
    c."promotion-ends-at",
    c."discount-percentage",
    c."featured-on-website"
FROM "marketing-campaign-master" c
WHERE c."is-active-flag" = true;

GRANT SELECT ON "store_campaigns_view" TO postgres, anon, authenticated, service_role;


-- 5. SECURE VIEW FOR CAMPAIGN PRODUCTS (Junction)
-- We need a view that links Campaign -> Inventory -> Product
DROP VIEW IF EXISTS "store_campaign_products_view";

CREATE OR REPLACE VIEW "store_campaign_products_view" AS
SELECT
    s."segment-id",
    s."campaign-id",
    s."highlight-label",
    s."sort-order",
    -- Inventory fields via join (exposed safely)
    v.id as inventory_id,
    v.price,
    v.stock,
    v.name,
    v."image-url",
    v.category,
    v.manufacturer
FROM "campaign-product-segment-group" s
JOIN "store_inventory_view" v ON s."inventory-id" = v.id;

GRANT SELECT ON "store_campaign_products_view" TO postgres, anon, authenticated, service_role;


DO $$
BEGIN
  RAISE NOTICE '✅ Secure Views Created. Tables Locked Down.';
END $$;
