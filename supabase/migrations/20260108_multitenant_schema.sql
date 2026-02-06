-- =====================================================
-- MULTI-TENANT ARCHITECTURE MIGRATION
-- Adds superadmin, product enrichment, and subdomain support
-- =====================================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. SUPERADMIN USERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS "superadmin-users" (
  "superadmin-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user-id" UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  "full-name" TEXT,
  "email" TEXT,
  "permissions-json" JSONB DEFAULT '{"manage_stores": true, "manage_products": true, "manage_users": true, "view_analytics": true}'::jsonb,
  "is-active" BOOLEAN DEFAULT true,
  "created-at" TIMESTAMPTZ DEFAULT NOW(),
  "updated-at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx-superadmin-user" ON "superadmin-users"("user-id");
CREATE INDEX IF NOT EXISTS "idx-superadmin-active" ON "superadmin-users"("is-active");

-- =====================================================
-- 2. SUBDOMAIN TO TENANT MAPPING
-- =====================================================

CREATE TABLE IF NOT EXISTS "subdomain-tenant-mapping" (
  "mapping-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "subdomain" TEXT NOT NULL UNIQUE,
  "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE,
  "is-active" BOOLEAN DEFAULT true,
  "created-at" TIMESTAMPTZ DEFAULT NOW(),
  "updated-at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx-subdomain-lookup" ON "subdomain-tenant-mapping"("subdomain");
CREATE INDEX IF NOT EXISTS "idx-subdomain-tenant" ON "subdomain-tenant-mapping"("tenant-id");

-- =====================================================
-- 3. PRODUCT ENRICHMENT HISTORY
-- =====================================================

CREATE TABLE IF NOT EXISTS "product-enrichment-history" (
  "enrichment-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "product-id" UUID REFERENCES "global-product-master-catalog"("product-id") ON DELETE CASCADE,
  "enriched-by-user-id" UUID REFERENCES auth.users(id),
  "enrichment-type" TEXT CHECK ("enrichment-type" IN ('superadmin', 'store-admin-override', 'ai-generated')),
  "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id") ON DELETE SET NULL,
  "changes-json" JSONB,
  "previous-data-json" JSONB,
  "enrichment-source" TEXT DEFAULT 'manual',
  "created-at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx-enrichment-product" ON "product-enrichment-history"("product-id");
CREATE INDEX IF NOT EXISTS "idx-enrichment-user" ON "product-enrichment-history"("enriched-by-user-id");
CREATE INDEX IF NOT EXISTS "idx-enrichment-type" ON "product-enrichment-history"("enrichment-type");

-- =====================================================
-- 4. PENDING PRODUCT ADDITIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS "pending-product-additions" (
  "pending-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE,
  "added-by-user-id" UUID REFERENCES auth.users(id),
  "product-name" TEXT NOT NULL,
  "upc-ean-code" TEXT,
  "brand-name" TEXT,
  "manufacturer-name" TEXT,
  "category-name" TEXT,
  "description-text" TEXT,
  "image-url" TEXT,
  "suggested-match-product-id" UUID REFERENCES "global-product-master-catalog"("product-id"),
  "ai-confidence-score" DECIMAL(3, 2),
  "ai-analysis-json" JSONB,
  "status" TEXT DEFAULT 'pending' CHECK ("status" IN ('pending', 'approved', 'rejected', 'auto-added', 'merged')),
  "reviewed-by" UUID REFERENCES auth.users(id),
  "reviewed-at" TIMESTAMPTZ,
  "created-at" TIMESTAMPTZ DEFAULT NOW(),
  "updated-at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx-pending-tenant" ON "pending-product-additions"("tenant-id");
CREATE INDEX IF NOT EXISTS "idx-pending-status" ON "pending-product-additions"("status");
CREATE INDEX IF NOT EXISTS "idx-pending-created" ON "pending-product-additions"("created-at" DESC);

-- =====================================================
-- 5. ALTER EXISTING TABLES
-- =====================================================

-- Add subdomain to retail-store-tenant
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'retail-store-tenant' AND column_name = 'subdomain'
  ) THEN
    ALTER TABLE "retail-store-tenant" 
    ADD COLUMN "subdomain" TEXT UNIQUE;
  END IF;
END $$;

-- Add enrichment fields to global-product-master-catalog
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'global-product-master-catalog' AND column_name = 'enriched-by-superadmin'
  ) THEN
    ALTER TABLE "global-product-master-catalog" 
    ADD COLUMN "enriched-by-superadmin" BOOLEAN DEFAULT false,
    ADD COLUMN "last-enriched-at" TIMESTAMPTZ,
    ADD COLUMN "last-enriched-by" UUID REFERENCES auth.users(id),
    ADD COLUMN "enrichment-source" TEXT DEFAULT 'manual',
    ADD COLUMN "metadata-json" JSONB;
  END IF;
END $$;

-- Add local enrichment to retail-store-inventory-item
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'retail-store-inventory-item' AND column_name = 'local-enrichment-json'
  ) THEN
    ALTER TABLE "retail-store-inventory-item" 
    ADD COLUMN "local-enrichment-json" JSONB,
    ADD COLUMN "has-local-override" BOOLEAN DEFAULT false,
    ADD COLUMN "override-image-url" TEXT,
    ADD COLUMN "override-description" TEXT;
  END IF;
END $$;

-- =====================================================
-- 6. HELPER FUNCTIONS
-- =====================================================

-- Function to check if user is superadmin
CREATE OR REPLACE FUNCTION is_superadmin(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM "superadmin-users"
    WHERE "user-id" = p_user_id AND "is-active" = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get tenant from subdomain
CREATE OR REPLACE FUNCTION get_tenant_from_subdomain(p_subdomain TEXT)
RETURNS UUID AS $$
DECLARE
  v_tenant_id UUID;
BEGIN
  SELECT "tenant-id" INTO v_tenant_id
  FROM "subdomain-tenant-mapping"
  WHERE "subdomain" = p_subdomain AND "is-active" = true;
  
  RETURN v_tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log product enrichment
CREATE OR REPLACE FUNCTION log_product_enrichment(
  p_product_id UUID,
  p_user_id UUID,
  p_enrichment_type TEXT,
  p_tenant_id UUID,
  p_changes JSONB,
  p_previous_data JSONB
)
RETURNS UUID AS $$
DECLARE
  v_enrichment_id UUID;
BEGIN
  INSERT INTO "product-enrichment-history" (
    "product-id",
    "enriched-by-user-id",
    "enrichment-type",
    "tenant-id",
    "changes-json",
    "previous-data-json"
  ) VALUES (
    p_product_id,
    p_user_id,
    p_enrichment_type,
    p_tenant_id,
    p_changes,
    p_previous_data
  ) RETURNING "enrichment-id" INTO v_enrichment_id;
  
  RETURN v_enrichment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. TRIGGERS
-- =====================================================

-- Trigger to update last-enriched-at on product enrichment
CREATE OR REPLACE FUNCTION update_product_enrichment_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE "global-product-master-catalog"
  SET "last-enriched-at" = NOW(),
      "last-enriched-by" = NEW."enriched-by-user-id"
  WHERE "product-id" = NEW."product-id";
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_update_product_enrichment') THEN
    CREATE TRIGGER trg_update_product_enrichment
      AFTER INSERT ON "product-enrichment-history"
      FOR EACH ROW
      EXECUTE FUNCTION update_product_enrichment_timestamp();
  END IF;
END $$;

-- Trigger to auto-create subdomain mapping when tenant is created
CREATE OR REPLACE FUNCTION auto_create_subdomain_mapping()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW."subdomain" IS NOT NULL THEN
    INSERT INTO "subdomain-tenant-mapping" ("subdomain", "tenant-id")
    VALUES (NEW."subdomain", NEW."tenant-id")
    ON CONFLICT ("subdomain") DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_auto_create_subdomain') THEN
    CREATE TRIGGER trg_auto_create_subdomain
      AFTER INSERT OR UPDATE ON "retail-store-tenant"
      FOR EACH ROW
      EXECUTE FUNCTION auto_create_subdomain_mapping();
  END IF;
END $$;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Multi-tenant schema migration complete!';
  RAISE NOTICE 'Added: superadmin-users, subdomain-tenant-mapping, product-enrichment-history, pending-product-additions';
  RAISE NOTICE 'Updated: retail-store-tenant, global-product-master-catalog, retail-store-inventory-item';
END $$;
