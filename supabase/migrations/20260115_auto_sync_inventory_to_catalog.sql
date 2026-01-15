-- =====================================================
-- AUTO-SYNC TENANT INVENTORY TO MASTER CATALOG
-- =====================================================
-- When a tenant adds an inventory item, automatically create
-- the corresponding product in the master catalog if it doesn't exist

CREATE OR REPLACE FUNCTION auto_sync_inventory_to_catalog()
RETURNS TRIGGER AS $$
DECLARE
  v_product_exists BOOLEAN;
BEGIN
  -- Check if this inventory item references a valid global product
  SELECT EXISTS (
    SELECT 1 FROM "global-product-master-catalog"
    WHERE "product-id" = NEW."global-product-id"
  ) INTO v_product_exists;

  -- If product doesn't exist in master catalog, create it
  IF NOT v_product_exists THEN
    INSERT INTO "global-product-master-catalog" (
      "product-id",
      "product-name",
      "upc-ean-code",
      "brand-name",
      "category-name",
      "manufacturer-name",
      "image-url",
      "description-text",
      "enriched-by-superadmin",
      "created-at"
    ) VALUES (
      NEW."global-product-id",
      COALESCE(NEW."product-name", 'Unnamed Product'),
      NEW."upc-ean-code",
      NEW."brand-name",
      NEW."category-name",
      NEW."manufacturer-name",
      NEW."image-url",
      NEW."description-text",
      false,  -- Not enriched by superadmin
      NOW()
    )
    ON CONFLICT ("product-id") DO NOTHING;  -- Safe if concurrent insert
    
    RAISE NOTICE 'Auto-created product in master catalog: % (ID: %)', 
      COALESCE(NEW."product-name", 'Unnamed Product'),
      NEW."global-product-id";
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any
DROP TRIGGER IF EXISTS trg_auto_sync_inventory_to_catalog 
  ON "retail-store-inventory-item";

-- Create trigger (fires BEFORE INSERT or UPDATE)
CREATE TRIGGER trg_auto_sync_inventory_to_catalog
BEFORE INSERT OR UPDATE OF "global-product-id", "product-name", "brand-name"
ON "retail-store-inventory-item"
FOR EACH ROW
WHEN (NEW."global-product-id" IS NOT NULL)
EXECUTE FUNCTION auto_sync_inventory_to_catalog();

COMMENT ON FUNCTION auto_sync_inventory_to_catalog() IS 
  'Auto-syncs tenant inventory items to master catalog. Creates product if missing.';
