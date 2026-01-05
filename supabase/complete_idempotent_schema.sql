-- =====================================================
-- COMPLETE RETAIL STORE DATABASE SCHEMA (IDEMPOTENT)
-- Safe to run multiple times - skips existing objects
-- Database: PostgreSQL 15.x via Supabase
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. TENANTS & USER MANAGEMENT
-- =====================================================

CREATE TABLE IF NOT EXISTS "retail-store-tenant" (
  "tenant-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "store-name" TEXT NOT NULL,
  "store-address" TEXT,
  "store-city" TEXT,
  "store-state" TEXT,
  "store-zip-code" TEXT,
  "phone-number" TEXT,
  "email-address" TEXT UNIQUE,
  "owner-user-id" UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  "subscription-tier" TEXT DEFAULT 'beta' CHECK ("subscription-tier" IN ('free', 'beta', 'pro', 'enterprise')),
  "is-active" BOOLEAN DEFAULT true,
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

-- =====================================================
-- 2. GLOBAL PRODUCT CATALOG
-- =====================================================

CREATE TABLE IF NOT EXISTS "global-product-master-catalog" (
  "product-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "upc-ean-code" TEXT UNIQUE,
  "product-name" TEXT NOT NULL,
  "brand-name" TEXT,
  "manufacturer-name" TEXT,
  "category-name" TEXT,
  "subcategory-name" TEXT,
  "package-size" TEXT,
  "package-unit" TEXT,
  "image-url" TEXT,
  "description-text" TEXT,
  "is-active" BOOLEAN DEFAULT true,
  "created-at" TIMESTAMPTZ DEFAULT NOW(),
  "updated-at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx-product-name-search" ON "global-product-master-catalog" 
  USING gin(to_tsvector('english', "product-name"));
CREATE INDEX IF NOT EXISTS "idx-product-upc" ON "global-product-master-catalog"("upc-ean-code");

-- =====================================================
-- 3. STORE INVENTORY
-- =====================================================

CREATE TABLE IF NOT EXISTS "retail-store-inventory-item" (
  "inventory-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE,
  "global-product-id" UUID REFERENCES "global-product-master-catalog"("product-id"),
  "custom-product-name" TEXT,
  "current-stock-quantity" INTEGER DEFAULT 0,
  "reorder-point-value" INTEGER DEFAULT 10,
  "shelf-location-code" TEXT,
  "selling-price-amount" DECIMAL(10, 2),
  "cost-price-amount" DECIMAL(10, 2),
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
  "supplier-invoice-id" UUID,
  "created-at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx-inventory-tenant" ON "retail-store-inventory-item"("tenant-id");
CREATE INDEX IF NOT EXISTS "idx-inventory-product" ON "retail-store-inventory-item"("global-product-id");
CREATE INDEX IF NOT EXISTS "idx-batch-inventory" ON "inventory-batch-tracking-record"("inventory-id");
CREATE INDEX IF NOT EXISTS "idx-batch-expiry" ON "inventory-batch-tracking-record"("expiry-date-timestamp");

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

CREATE INDEX IF NOT EXISTS "idx-invoice-tenant" ON "uploaded-vendor-invoice-document"("tenant-id");
CREATE INDEX IF NOT EXISTS "idx-line-item-invoice" ON "invoice-line-item-detail"("invoice-id");

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

CREATE INDEX IF NOT EXISTS "idx-pos-mapping-tenant" ON "pos-product-mapping-record"("tenant-id");
CREATE INDEX IF NOT EXISTS "idx-pos-mapping-verified" ON "pos-product-mapping-record"("is-verified-flag");

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

CREATE INDEX IF NOT EXISTS "idx-order-tenant" ON "customer-order-header"("tenant-id");
CREATE INDEX IF NOT EXISTS "idx-order-customer" ON "customer-order-header"("customer-id");
CREATE INDEX IF NOT EXISTS "idx-order-status" ON "customer-order-header"("order-status-code");

-- =====================================================
-- 7. PROMOTIONS & CAMPAIGNS
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
  "badge-label" TEXT,
  "badge-color" TEXT,
  "title-text" TEXT,
  "subtitle-text" TEXT,
  "tagline-text" TEXT,
  "banner-image-url" TEXT,
  "sort-order" INTEGER,
  "created-at" TIMESTAMPTZ DEFAULT NOW(),
  "updated-at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "campaign-product-segment-group" (
  "segment-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "campaign-id" UUID REFERENCES "marketing-campaign-master"("campaign-id") ON DELETE CASCADE,
  "inventory-id" UUID REFERENCES "retail-store-inventory-item"("inventory-id") ON DELETE CASCADE,
  "highlight-label" TEXT,
  "sort-order" INTEGER,
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

CREATE INDEX IF NOT EXISTS "idx-campaign-tenant" ON "marketing-campaign-master"("tenant-id");
CREATE INDEX IF NOT EXISTS "idx-campaign-active" ON "marketing-campaign-master"("is-active-flag");
CREATE INDEX IF NOT EXISTS "idx-promotion-tenant" ON "promotion-discount-rule-config"("tenant-id");

-- =====================================================
-- 8. INVENTORY RECONCILIATION (NEW MODULE)
-- =====================================================

CREATE TABLE IF NOT EXISTS inventory_reconciliation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID,
  reconciliation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'in_progress' 
    CHECK (status IN ('in_progress', 'pending_approval', 'approved', 'rejected')),
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

CREATE INDEX IF NOT EXISTS idx_reconciliation_tenant ON inventory_reconciliation(tenant_id);
CREATE INDEX IF NOT EXISTS idx_reconciliation_status ON inventory_reconciliation(status);
CREATE INDEX IF NOT EXISTS idx_reconciliation_date ON inventory_reconciliation(reconciliation_date DESC);
CREATE INDEX IF NOT EXISTS idx_reconciliation_items_recon ON reconciliation_line_items(reconciliation_id);

-- =====================================================
-- 9. EXPENSES TRACKING
-- =====================================================

CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT CHECK (category IN ('rent', 'utilities', 'labor', 'supplies', 'marketing', 'other')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_tenant ON expenses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date DESC);

-- =====================================================
-- 10. LEGACY TABLE VIEWS (Compatibility)
-- Only create views if they don't already exist as tables
-- =====================================================

DO $$
BEGIN
  -- Check and create tenants view only if it doesn't exist as a table
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'tenants' AND table_type = 'BASE TABLE'
  ) THEN
    EXECUTE 'CREATE OR REPLACE VIEW "tenants" AS SELECT * FROM "retail-store-tenant"';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'store_inventory' AND table_type = 'BASE TABLE'
  ) THEN
    EXECUTE 'CREATE OR REPLACE VIEW "store_inventory" AS SELECT * FROM "retail-store-inventory-item"';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'global_products' AND table_type = 'BASE TABLE'
  ) THEN
    EXECUTE 'CREATE OR REPLACE VIEW "global_products" AS SELECT * FROM "global-product-master-catalog"';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'inventory_batches' AND table_type = 'BASE TABLE'
  ) THEN
    EXECUTE 'CREATE OR REPLACE VIEW "inventory_batches" AS SELECT * FROM "inventory-batch-tracking-record"';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'invoices' AND table_type = 'BASE TABLE'
  ) THEN
    EXECUTE 'CREATE OR REPLACE VIEW "invoices" AS SELECT * FROM "uploaded-vendor-invoice-document"';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'pos_mappings' AND table_type = 'BASE TABLE'
  ) THEN
    EXECUTE 'CREATE OR REPLACE VIEW "pos_mappings" AS SELECT * FROM "pos-product-mapping-record"';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'orders' AND table_type = 'BASE TABLE'
  ) THEN
    EXECUTE 'CREATE OR REPLACE VIEW "orders" AS SELECT * FROM "customer-order-header"';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'promotions' AND table_type = 'BASE TABLE'
  ) THEN
    EXECUTE 'CREATE OR REPLACE VIEW "promotions" AS SELECT * FROM "promotion-discount-rule-config"';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'product_segments' AND table_type = 'BASE TABLE'
  ) THEN
    EXECUTE 'CREATE OR REPLACE VIEW "product_segments" AS SELECT * FROM "marketing-campaign-master"';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'segment_products' AND table_type = 'BASE TABLE'
  ) THEN
    EXECUTE 'CREATE OR REPLACE VIEW "segment_products" AS SELECT * FROM "campaign-product-segment-group"';
  END IF;
END $$;

-- =====================================================
-- 11. TRIGGERS & FUNCTIONS
-- =====================================================

-- Auto-update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updated-at" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers (will skip if already exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_tenant_timestamp') THEN
    CREATE TRIGGER update_tenant_timestamp BEFORE UPDATE ON "retail-store-tenant"
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_inventory_timestamp') THEN
    CREATE TRIGGER update_inventory_timestamp BEFORE UPDATE ON "retail-store-inventory-item"
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_product_timestamp') THEN
    CREATE TRIGGER update_product_timestamp BEFORE UPDATE ON "global-product-master-catalog"
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Reconciliation variance update trigger
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

-- Function to apply approved reconciliation to inventory
CREATE OR REPLACE FUNCTION apply_reconciliation(p_reconciliation_id UUID)
RETURNS VOID AS $$
DECLARE
  line_record RECORD;
BEGIN
  FOR line_record IN 
    SELECT inventory_id, variance
    FROM reconciliation_line_items
    WHERE reconciliation_id = p_reconciliation_id
      AND variance != 0
  LOOP
    UPDATE store_inventory
    SET current_stock_quantity = current_stock_quantity + line_record.variance,
        updated_at = NOW()
    WHERE inventory_id = line_record.inventory_id;
  END LOOP;
  
  UPDATE inventory_reconciliation
  SET status = 'approved',
      approved_at = NOW()
  WHERE id = p_reconciliation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get inventory health stats
CREATE OR REPLACE FUNCTION get_inventory_health_stats(p_tenant_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_items', COUNT(*),
    'low_stock_count', COUNT(*) FILTER (WHERE "current-stock-quantity" <= "reorder-point-value"),
    'out_of_stock_count', COUNT(*) FILTER (WHERE "current-stock-quantity" = 0),
    'expiring_soon_count', (
      SELECT COUNT(*) FROM "inventory-batch-tracking-record" b
      WHERE b."inventory-id" IN (
        SELECT "inventory-id" FROM "retail-store-inventory-item" 
        WHERE "tenant-id" = p_tenant_id
      )
      AND b."expiry-date-timestamp" BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
    )
  ) INTO result
  FROM "retail-store-inventory-item"
  WHERE "tenant-id" = p_tenant_id AND "is-active" = true;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update inventory after order
CREATE OR REPLACE FUNCTION update_inventory_after_order()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE "retail-store-inventory-item"
  SET "current-stock-quantity" = "current-stock-quantity" - NEW."quantity-ordered"
  WHERE "inventory-id" = NEW."inventory-id";
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'order_line_item_inventory_update') THEN
    CREATE TRIGGER order_line_item_inventory_update
      AFTER INSERT ON "order-line-item-detail"
      FOR EACH ROW
      EXECUTE FUNCTION update_inventory_after_order();
  END IF;
END $$;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================

-- Display confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Database schema setup complete!';
  RAISE NOTICE 'All tables, views, indexes, triggers, and functions are ready.';
END $$;
