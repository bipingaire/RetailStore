-- Add UOM (Unit of Measurement) relationship columns to global-product-master-catalog
-- This allows products to have pack configurations and bulk pack relationships

DO $$
BEGIN
  -- Add base-unit-name column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'global-product-master-catalog' 
    AND column_name = 'base-unit-name'
  ) THEN
    ALTER TABLE "global-product-master-catalog" 
    ADD COLUMN "base-unit-name" TEXT DEFAULT 'piece';
    
    RAISE NOTICE '✅ Added column: base-unit-name';
  END IF;

  -- Add pack-size column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'global-product-master-catalog' 
    AND column_name = 'pack-size'
  ) THEN
    ALTER TABLE "global-product-master-catalog" 
    ADD COLUMN "pack-size" INTEGER DEFAULT 1;
    
    RAISE NOTICE '✅ Added column: pack-size';
  END IF;

  -- Add pack-unit-name column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'global-product-master-catalog' 
    AND column_name = 'pack-unit-name'
  ) THEN
    ALTER TABLE "global-product-master-catalog" 
    ADD COLUMN "pack-unit-name" TEXT;
    
    RAISE NOTICE '✅ Added column: pack-unit-name';
  END IF;

  -- Add bulk-pack-product-id column (self-referencing FK)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'global-product-master-catalog' 
    AND column_name = 'bulk-pack-product-id'
  ) THEN
    ALTER TABLE "global-product-master-catalog" 
    ADD COLUMN "bulk-pack-product-id" UUID REFERENCES "global-product-master-catalog"("product-id") ON DELETE SET NULL;
    
    RAISE NOTICE '✅ Added column: bulk-pack-product-id (FK to self)';
  END IF;

  -- Add is-bulk-pack flag
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'global-product-master-catalog' 
    AND column_name = 'is-bulk-pack'
  ) THEN
    ALTER TABLE "global-product-master-catalog" 
    ADD COLUMN "is-bulk-pack" BOOLEAN DEFAULT false;
    
    RAISE NOTICE '✅ Added column: is-bulk-pack';
  END IF;

  RAISE NOTICE '🎉 UOM columns added successfully to global-product-master-catalog';
END $$;

-- Create index on bulk-pack-product-id for faster lookups
CREATE INDEX IF NOT EXISTS "idx-global-product-bulk-pack" 
ON "global-product-master-catalog"("bulk-pack-product-id") 
WHERE "bulk-pack-product-id" IS NOT NULL;

-- Create index on is-bulk-pack for filtering
CREATE INDEX IF NOT EXISTS "idx-global-product-is-bulk" 
ON "global-product-master-catalog"("is-bulk-pack") 
WHERE "is-bulk-pack" = true;

COMMENT ON COLUMN "global-product-master-catalog"."base-unit-name" IS 'Base unit of measurement (e.g., piece, kg, liter, each)';
COMMENT ON COLUMN "global-product-master-catalog"."pack-size" IS 'Number of base units in one pack (multiplier)';
COMMENT ON COLUMN "global-product-master-catalog"."pack-unit-name" IS 'Pack unit name (e.g., box, case, carton, dozen)';
COMMENT ON COLUMN "global-product-master-catalog"."bulk-pack-product-id" IS 'Reference to bulk pack variant of this product';
COMMENT ON COLUMN "global-product-master-catalog"."is-bulk-pack" IS 'Flag indicating if this is a bulk pack variant';
