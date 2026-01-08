-- =====================================================
-- FINAL CONSOLIDATED SCHEMA (2026-01-08)
-- Merges all previous migrations into a single source of truth
-- Includes: Base Schema, Multi-Tenancy, Location Support, Social Features
-- =====================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Enable postgis if utilizing advanced geo features (optional, sticking to decimal for now)

-- =====================================================
-- 1. TENANT & USER MANAGEMENT
-- =====================================================

CREATE TABLE IF NOT EXISTS "retail-store-tenant" (
  "tenant-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "store-name" TEXT NOT NULL,
  
  -- Store Info
  "store-address" TEXT,
  "store-city" TEXT,
  "store-state" TEXT,
  "store-zip-code" TEXT,
  "phone-number" TEXT,
  "email-address" TEXT UNIQUE,
  
  -- Architecture
  "subdomain" TEXT UNIQUE, -- Added from multi-tenant
  "owner-user-id" UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Configuration
  "subscription-tier" TEXT DEFAULT 'beta' CHECK ("subscription-tier" IN ('free', 'beta', 'pro', 'enterprise')),
  "is-active" BOOLEAN DEFAULT true,
  
  -- Location Support (Added from location_support.sql)
  "latitude" DECIMAL(9, 6),
  "longitude" DECIMAL(9, 6),
  "store-hours" JSONB,
  "features" TEXT[] DEFAULT ARRAY['pickup', 'delivery'],
  "timezone" TEXT DEFAULT 'America/New_York',
  
  -- Timestamps
  "created-at" TIMESTAMPTZ DEFAULT NOW(),
  "updated-at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "tenant-user-role" (
  "role-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE,
  "user-id" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  "role-type" TEXT NOT NULL CHECK ("role-type" IN ('owner', 'manager', 'staff', 'viewer')),
  "permissions-json" JSONB,
  "created-at" TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE("tenant-id", "user-id")
);

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

CREATE TABLE IF NOT EXISTS "subdomain-tenant-mapping" (
  "mapping-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "subdomain" TEXT NOT NULL UNIQUE,
  "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE,
  "is-active" BOOLEAN DEFAULT true,
  "created-at" TIMESTAMPTZ DEFAULT NOW(),
  "updated-at" TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. MASTER CATALOG & ENRICHMENT
-- =====================================================

CREATE TABLE IF NOT EXISTS "global-product-master-catalog" (
  "product-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "upc-ean-code" TEXT UNIQUE,
  "product-name" TEXT NOT NULL,
  
  -- Classification
  "brand-name" TEXT,
  "manufacturer-name" TEXT,
  "category-name" TEXT,
  "subcategory-name" TEXT,
  
  -- Details
  "package-size" TEXT,
  "package-unit" TEXT,
  "image-url" TEXT,
  "description-text" TEXT,
  
  -- Enrichment (Added from multi-tenant)
  "enriched-by-superadmin" BOOLEAN DEFAULT false,
  "last-enriched-at" TIMESTAMPTZ,
  "last-enriched-by" UUID REFERENCES auth.users(id),
  "enrichment-source" TEXT DEFAULT 'manual',
  "metadata-json" JSONB,
  
  "is-active" BOOLEAN DEFAULT true,
  "created-at" TIMESTAMPTZ DEFAULT NOW(),
  "updated-at" TIMESTAMPTZ DEFAULT NOW()
);

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

-- =====================================================
-- 3. STORE INVENTORY
-- =====================================================

CREATE TABLE IF NOT EXISTS "retail-store-inventory-item" (
  "inventory-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE,
  "global-product-id" UUID REFERENCES "global-product-master-catalog"("product-id"),
  
  -- Local Data
  "custom-product-name" TEXT,
  "current-stock-quantity" INTEGER DEFAULT 0,
  "reorder-point-value" INTEGER DEFAULT 10,
  "shelf-location-code" TEXT,
  "selling-price-amount" DECIMAL(10, 2),
  "cost-price-amount" DECIMAL(10, 2),
  
  -- Local Enrichment (Added from multi-tenant)
  "local-enrichment-json" JSONB,
  "has-local-override" BOOLEAN DEFAULT false,
  "override-image-url" TEXT,
  "override-description" TEXT,
  
  "is-active" BOOLEAN DEFAULT true,
  "created-at" TIMESTAMPTZ DEFAULT NOW(),
  "updated-at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "inventory-batch-tracking-record" (
  "batch-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "inventory-id" UUID REFERENCES "retail-store-inventory-item"("inventory-id") ON DELETE CASCADE,
  "batch-quantity-count" INTEGER NOT NULL,
  "purchase-price-amount" DECIMAL(10, 2),
  "selling-price-amount" DECIMAL(10, 2),
  "expiry-date-timestamp" DATE,
  "received-date" DATE DEFAULT CURRENT_DATE,
  "supplier-invoice-id" UUID, -- Can refer to uploaded-vendor-invoice-document later
  "created-at" TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. VENDOR INVOICES
-- =====================================================

CREATE TABLE IF NOT EXISTS "uploaded-vendor-invoice-document" (
  "invoice-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE,
  "invoice-number" TEXT,
  "invoice-date" DATE,
  "supplier-name" TEXT,
  "total-amount-value" DECIMAL(10, 2),
  "file-url-path" TEXT,
  "processing-status" TEXT DEFAULT 'pending' CHECK ("processing-status" IN ('pending', 'processing', 'processed', 'error', 'verified')),
  "ai-extracted-data-json" JSONB,
  "error-message-text" TEXT,
  "created-at" TIMESTAMPTZ DEFAULT NOW(),
  "processed-at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "invoice-line-item-detail" (
  "line-item-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "invoice-id" UUID REFERENCES "uploaded-vendor-invoice-document"("invoice-id") ON DELETE CASCADE,
  "product-name-text" TEXT NOT NULL,
  "quantity-ordered" INTEGER NOT NULL,
  "unit-price-amount" DECIMAL(10, 2),
  "total-price-amount" DECIMAL(10, 2),
  "expiry-date" DATE,
  "matched-global-product-id" UUID REFERENCES "global-product-master-catalog"("product-id"),
  "matched-inventory-id" UUID REFERENCES "retail-store-inventory-item"("inventory-id"),
  "match-confidence-score" DECIMAL(3, 2),
  "is-verified" BOOLEAN DEFAULT false,
  "created-at" TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. POS INTEGRATION
-- =====================================================

CREATE TABLE IF NOT EXISTS "pos-product-mapping-record" (
  "mapping-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE,
  "inventory-id" UUID REFERENCES "retail-store-inventory-item"("inventory-id") ON DELETE CASCADE,
  "pos-sku-code" TEXT NOT NULL,
  "pos-product-name" TEXT,
  "is-verified-flag" BOOLEAN DEFAULT false,
  "verification-confidence-score" DECIMAL(3, 2),
  "last-sold-price-amount" DECIMAL(10, 2),
  "last-sync-timestamp" TIMESTAMPTZ,
  "created-at" TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE("tenant-id", "pos-sku-code")
);

CREATE TABLE IF NOT EXISTS "daily-sales-z-report-data" (
  "report-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE,
  "report-date" DATE NOT NULL,
  "total-sales-amount" DECIMAL(10, 2),
  "transaction-count" INTEGER,
  "file-url-path" TEXT,
  "processing-status" TEXT DEFAULT 'pending',
  "created-at" TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE("tenant-id", "report-date")
);

-- =====================================================
-- 6. CUSTOMER ORDERS
-- =====================================================

CREATE TABLE IF NOT EXISTS "customer-order-header" (
  "order-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE,
  "customer-id" UUID REFERENCES auth.users(id),
  "customer-name" TEXT,
  "customer-email" TEXT,
  "customer-phone" TEXT,
  "order-date-time" TIMESTAMPTZ DEFAULT NOW(),
  "total-amount-value" DECIMAL(10, 2) NOT NULL,
  "discount-amount" DECIMAL(10, 2) DEFAULT 0,
  "tax-amount" DECIMAL(10, 2) DEFAULT 0,
  "final-amount" DECIMAL(10, 2) NOT NULL,
  "order-status-code" TEXT DEFAULT 'pending' CHECK ("order-status-code" IN ('pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled')),
  "fulfillment-type" TEXT DEFAULT 'delivery' CHECK ("fulfillment-type" IN ('delivery', 'pickup')),
  "payment-status" TEXT DEFAULT 'pending' CHECK ("payment-status" IN ('pending', 'paid', 'failed', 'refunded')),
  "payment-method" TEXT,
  "stripe-payment-intent-id" TEXT,
  "created-at" TIMESTAMPTZ DEFAULT NOW(),
  "updated-at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "order-line-item-detail" (
  "line-item-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "order-id" UUID REFERENCES "customer-order-header"("order-id") ON DELETE CASCADE,
  "inventory-id" UUID REFERENCES "retail-store-inventory-item"("inventory-id"),
  "product-name" TEXT NOT NULL,
  "quantity-ordered" INTEGER NOT NULL,
  "unit-price-amount" DECIMAL(10, 2) NOT NULL,
  "applied-discount-amount" DECIMAL(10, 2) DEFAULT 0,
  "total-amount" DECIMAL(10, 2) NOT NULL,
  "created-at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "delivery-address-information" (
  "address-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "order-id" UUID REFERENCES "customer-order-header"("order-id") ON DELETE CASCADE,
  "address-line-1" TEXT NOT NULL,
  "address-line-2" TEXT,
  "city-name" TEXT NOT NULL,
  "state-code" TEXT,
  "zip-code" TEXT NOT NULL,
  "delivery-instructions" TEXT,
  "created-at" TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 7. PROMOTIONS & MARKETING
-- =====================================================

CREATE TABLE IF NOT EXISTS "marketing-campaign-master" (
  "campaign-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE,
  "campaign-name" TEXT NOT NULL,
  "campaign-slug" TEXT UNIQUE,
  "campaign-type" TEXT CHECK ("campaign-type" IN ('flash_sale', 'clearance', 'festive', 'weekly_deal', 'new_arrival')),
  "start-date-time" TIMESTAMPTZ NOT NULL,
  "end-date-time" TIMESTAMPTZ NOT NULL,
  "is-active-flag" BOOLEAN DEFAULT true,
  
  -- Visuals
  "badge-label" TEXT,
  "badge-color" TEXT,
  "title-text" TEXT,
  "subtitle-text" TEXT,
  "tagline-text" TEXT,
  "banner-image-url" TEXT,
  "sort-order" INTEGER,
  
  -- Promotion Features (Added from social-features)
  "is-promoted" BOOLEAN DEFAULT false,
  "promotion-ends-at" TIMESTAMPTZ,
  "discount-percentage" INTEGER CHECK ("discount-percentage" BETWEEN 0 AND 100),
  "featured-on-website" BOOLEAN DEFAULT false,

  "created-at" TIMESTAMPTZ DEFAULT NOW(),
  "updated-at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "campaign-product-segment-group" (
  "segment-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "campaign-id" UUID REFERENCES "marketing-campaign-master"("campaign-id") ON DELETE CASCADE,
  "inventory-id" UUID REFERENCES "retail-store-inventory-item"("inventory-id") ON DELETE CASCADE,
  "highlight-label" TEXT,
  "sort-order" INTEGER,
  
  -- Sale Pricing (Added from social-features)
  "sale-price" NUMERIC(10,2),
  "original-price" NUMERIC(10,2),
  "discount-percentage" INTEGER,

  "created-at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "promotion-discount-rule-config" (
  "promotion-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE,
  "inventory-id" UUID REFERENCES "retail-store-inventory-item"("inventory-id"),
  "discount-type" TEXT CHECK ("discount-type" IN ('percentage', 'fixed_price', 'buy_x_get_y')),
  "discount-value-amount" DECIMAL(10, 2) NOT NULL,
  "start-date-time" TIMESTAMPTZ NOT NULL,
  "end-date-time" TIMESTAMPTZ NOT NULL,
  "fulfillment-restriction" TEXT DEFAULT 'all' CHECK ("fulfillment-restriction" IN ('all', 'store_only', 'online_only')),
  "is-active-flag" BOOLEAN DEFAULT true,
  "created-at" TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 8. SOCIAL MEDIA (New)
-- =====================================================

CREATE TABLE IF NOT EXISTS "social-media-posts" (
  "post-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE,
  "campaign-id" UUID REFERENCES "marketing-campaign-master"("campaign-id") ON DELETE SET NULL,
  "platform" TEXT NOT NULL CHECK ("platform" IN ('facebook', 'instagram', 'twitter', 'linkedin')),
  "post-content" TEXT NOT NULL,
  "image-url" TEXT,
  "facebook-post-id" TEXT,
  "instagram-post-id" TEXT,
  "posted-at" TIMESTAMPTZ DEFAULT NOW(),
  "status" TEXT DEFAULT 'published' CHECK ("status" IN ('draft', 'scheduled', 'published', 'failed')),
  "error-message" TEXT,
  "engagement-likes" INTEGER DEFAULT 0,
  "engagement-shares" INTEGER DEFAULT 0,
  "engagement-comments" INTEGER DEFAULT 0,
  "created-at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "social-media-accounts" (
  "account-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE,
  "platform" TEXT NOT NULL CHECK ("platform" IN ('facebook', 'instagram', 'twitter', 'linkedin')),
  "account-name" TEXT,
  "page-id" TEXT,
  "access-token" TEXT,
  "token-expires-at" TIMESTAMPTZ,
  "is-active" BOOLEAN DEFAULT true,
  "connected-at" TIMESTAMPTZ DEFAULT NOW(),
  "last-used-at" TIMESTAMPTZ,
  UNIQUE("tenant-id", "platform", "page-id")
);

-- =====================================================
-- 9. OPERATIONS (Reconciliation & Expenses)
-- =====================================================

CREATE TABLE IF NOT EXISTS inventory_reconciliation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID,
  reconciliation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'pending_approval', 'approved', 'rejected')),
  initiated_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  total_variance_value DECIMAL(10,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS reconciliation_line_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reconciliation_id UUID REFERENCES inventory_reconciliation(id) ON DELETE CASCADE,
  inventory_id UUID,
  product_name TEXT NOT NULL,
  expected_quantity INTEGER NOT NULL,
  counted_quantity INTEGER,
  variance INTEGER GENERATED ALWAYS AS (counted_quantity - expected_quantity) STORED,
  unit_cost DECIMAL(10,2),
  variance_value DECIMAL(10,2) GENERATED ALWAYS AS ((counted_quantity - expected_quantity) * unit_cost) STORED,
  notes TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT CHECK (category IN ('rent', 'utilities', 'labor', 'supplies', 'marketing', 'other')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 10. INDEXES
-- =====================================================

-- Catalog & Product
CREATE INDEX IF NOT EXISTS "idx-product-name-search" ON "global-product-master-catalog" USING gin(to_tsvector('english', "product-name"));
CREATE INDEX IF NOT EXISTS "idx-product-upc" ON "global-product-master-catalog"("upc-ean-code");

-- Inventory
CREATE INDEX IF NOT EXISTS "idx-inventory-tenant" ON "retail-store-inventory-item"("tenant-id");
CREATE INDEX IF NOT EXISTS "idx-inventory-product" ON "retail-store-inventory-item"("global-product-id");
CREATE INDEX IF NOT EXISTS "idx-batch-inventory" ON "inventory-batch-tracking-record"("inventory-id");
CREATE INDEX IF NOT EXISTS "idx-batch-expiry" ON "inventory-batch-tracking-record"("expiry-date-timestamp");

-- Tenant & Multi-tenant
CREATE INDEX IF NOT EXISTS "idx-subdomain-lookup" ON "subdomain-tenant-mapping"("subdomain");
CREATE INDEX IF NOT EXISTS "idx-subdomain-tenant" ON "subdomain-tenant-mapping"("tenant-id");
CREATE INDEX IF NOT EXISTS "idx-store-location-lat" ON "retail-store-tenant"("latitude");
CREATE INDEX IF NOT EXISTS "idx-store-location-lon" ON "retail-store-tenant"("longitude");

-- Superadmin & Enrichment
CREATE INDEX IF NOT EXISTS "idx-superadmin-user" ON "superadmin-users"("user-id");
CREATE INDEX IF NOT EXISTS "idx-enrichment-product" ON "product-enrichment-history"("product-id");
CREATE INDEX IF NOT EXISTS "idx-pending-tenant" ON "pending-product-additions"("tenant-id");
CREATE INDEX IF NOT EXISTS "idx-pending-status" ON "pending-product-additions"("status");

-- POS & Orders
CREATE INDEX IF NOT EXISTS "idx-pos-mapping-tenant" ON "pos-product-mapping-record"("tenant-id");
CREATE INDEX IF NOT EXISTS "idx-order-tenant" ON "customer-order-header"("tenant-id");
CREATE INDEX IF NOT EXISTS "idx-order-customer" ON "customer-order-header"("customer-id");

-- Marketing & Social
CREATE INDEX IF NOT EXISTS "idx-campaign-tenant" ON "marketing-campaign-master"("tenant-id");
CREATE INDEX IF NOT EXISTS idx_social_posts_tenant ON "social-media-posts"("tenant-id");
CREATE INDEX IF NOT EXISTS idx_social_posts_campaign ON "social-media-posts"("campaign-id");
CREATE INDEX IF NOT EXISTS idx_social_accounts_tenant ON "social-media-accounts"("tenant-id");

-- Operations
CREATE INDEX IF NOT EXISTS idx_reconciliation_tenant ON inventory_reconciliation(tenant_id);
CREATE INDEX IF NOT EXISTS idx_expenses_tenant ON expenses(tenant_id);

-- =====================================================
-- 11. FUNCTIONS & TRIGGERS
-- =====================================================

-- Helper: Distance Calculation (LOCATION SUPPORT)
CREATE OR REPLACE FUNCTION calculate_distance_miles(
  lat1 DECIMAL, lon1 DECIMAL,
  lat2 DECIMAL, lon2 DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
  earth_radius DECIMAL := 3959; -- miles
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

-- Helper: Find Stores (LOCATION SUPPORT)
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

-- Helper: Superadmin Check
CREATE OR REPLACE FUNCTION is_superadmin(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM "superadmin-users"
    WHERE "user-id" = p_user_id AND "is-active" = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Update Timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updated-at" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp triggers
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_tenant_timestamp') THEN
    CREATE TRIGGER update_tenant_timestamp BEFORE UPDATE ON "retail-store-tenant"
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_product_timestamp') THEN
    CREATE TRIGGER update_product_timestamp BEFORE UPDATE ON "global-product-master-catalog"
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Trigger: Auto-create Subdomain
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

-- Trigger: Update Reconciliation Total
CREATE OR REPLACE FUNCTION update_reconciliation_total() 
RETURNS TRIGGER AS $$
BEGIN
  UPDATE inventory_reconciliation
  SET total_variance_value = (
    SELECT COALESCE(SUM(variance_value), 0)
    FROM reconciliation_line_items
    WHERE reconciliation_id = NEW.reconciliation_id
  )
  WHERE id = NEW.reconciliation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_update_reconciliation_total') THEN
    CREATE TRIGGER trg_update_reconciliation_total
      AFTER INSERT OR UPDATE ON reconciliation_line_items
      FOR EACH ROW
      EXECUTE FUNCTION update_reconciliation_total();
  END IF;
END $$;

-- =====================================================
-- 12. ROW LEVEL SECURITY (RLS) - SOCIAL (Example)
-- =====================================================

ALTER TABLE "social-media-posts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "social-media-accounts" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tenant_social_posts_select" ON "social-media-posts";
CREATE POLICY "tenant_social_posts_select" ON "social-media-posts"
  FOR SELECT USING ("tenant-id" IN (SELECT "tenant-id" FROM "tenant-user-role" WHERE "user-id" = auth.uid()));

DROP POLICY IF EXISTS "tenant_social_posts_insert" ON "social-media-posts";
CREATE POLICY "tenant_social_posts_insert" ON "social-media-posts"
  FOR INSERT WITH CHECK ("tenant-id" IN (SELECT "tenant-id" FROM "tenant-user-role" WHERE "user-id" = auth.uid()));

-- =====================================================
-- END OF CONSOLIDATED SCHEMA
-- =====================================================
