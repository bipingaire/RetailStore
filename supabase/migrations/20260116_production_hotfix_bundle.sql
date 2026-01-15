-- =====================================================
-- PRODUCTION HOTFIX BUNDLE (Final Robust Version)
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '🚀 Starting Production Hotfix (Schema-Aware)...';
END $$;

-- -----------------------------------------------------
-- 1. FIX RECURSIVE RLS (Visibility Fix)
-- -----------------------------------------------------
DROP POLICY IF EXISTS "Superadmin open access" ON "superadmin-users";
DROP POLICY IF EXISTS "Superadmins can view themselves" ON "superadmin-users";
DROP POLICY IF EXISTS "Allow read access to superadmin list" ON "superadmin-users";

CREATE POLICY "Allow read access to superadmin list"
ON "superadmin-users" FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "Superadmins can manage master catalog" ON "global-product-master-catalog";

CREATE POLICY "Superadmins can manage master catalog"
ON "global-product-master-catalog" FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "superadmin-users" 
    WHERE "user-id" = auth.uid()
  )
);

-- -----------------------------------------------------
-- 2. ENABLE AUTO-SYNC TRIGGER (Safe Version)
-- -----------------------------------------------------
-- Only uses columns that ACTUALLY exist in inventory table
CREATE OR REPLACE FUNCTION auto_sync_inventory_to_catalog()
RETURNS TRIGGER AS $$
DECLARE
  v_product_exists BOOLEAN;
BEGIN
  -- Check if product exists in master
  SELECT EXISTS (
    SELECT 1 FROM "global-product-master-catalog"
    WHERE "product-id" = NEW."global-product-id"
  ) INTO v_product_exists;

  -- Create dummy product if missing (since we don't have name from inventory)
  IF NOT v_product_exists THEN
    INSERT INTO "global-product-master-catalog" (
      "product-id", 
      "product-name", 
      "description-text", 
      "enriched-by-superadmin", 
      "created-at"
    ) VALUES (
      NEW."global-product-id",
      'Draft Product (' || substr(NEW."global-product-id"::text, 1, 8) || ')',
      'Auto-created from inventory listing. Needs enrichment.',
      false, 
      NOW()
    ) 
    ON CONFLICT ("product-id") DO NOTHING;
    
    RAISE NOTICE 'Auto-created stub product: %', NEW."global-product-id";
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS trg_auto_sync_inventory_to_catalog ON "retail-store-inventory-item";

CREATE TRIGGER trg_auto_sync_inventory_to_catalog
BEFORE INSERT OR UPDATE OF "global-product-id"
ON "retail-store-inventory-item"
FOR EACH ROW
WHEN (NEW."global-product-id" IS NOT NULL)
EXECUTE FUNCTION auto_sync_inventory_to_catalog();

-- -----------------------------------------------------
-- 3. SYNC ORPHANED INVENTORY (Backfill)
-- -----------------------------------------------------
DO $$
DECLARE
  v_rec RECORD;
BEGIN
  -- Find inventory items pointing to non-existent global products
  FOR v_rec IN (
    SELECT DISTINCT i."global-product-id"
    FROM "retail-store-inventory-item" i
    LEFT JOIN "global-product-master-catalog" g
      ON i."global-product-id" = g."product-id"
    WHERE g."product-id" IS NULL 
      AND i."global-product-id" IS NOT NULL
  )
  LOOP
    INSERT INTO "global-product-master-catalog" (
      "product-id", 
      "product-name", 
      "description-text",
      "created-at"
    ) VALUES (
      v_rec."global-product-id",
      'Recovered Product (' || substr(v_rec."global-product-id"::text, 1, 8) || ')',
      'Recovered from orphaned inventory.',
      NOW()
    ) 
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;

-- -----------------------------------------------------
-- 4. FIX MIXED CONTENT IMAGES
-- -----------------------------------------------------
UPDATE "global-product-master-catalog"
SET "image-url" = REPLACE("image-url", 'http://', 'https://')
WHERE "image-url" LIKE 'http://%';

RAISE NOTICE '✅ PRODUCTION PATCH COMPLETE (VERSION 2.0). REFRESH YOUR BROWSER.';
