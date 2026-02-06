-- =====================================================
-- FIX ORDERS SCHEMA
-- Resolves "Could not find the 'customer_phone' column of 'orders'" error
-- by ensuring customer-order-header is a proper table with correct columns.
-- =====================================================

-- 1. Drop the view if it exists (in case it was mapped to 'orders')
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_views WHERE viewname = 'customer-order-header') THEN
    EXECUTE 'DROP VIEW "customer-order-header"';
  END IF;
END $$;

-- 2. Create the customer-order-header table if it doesn't exist
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

-- 3. Create Order Line Items table if missing
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

-- 4. Create Delivery Address table if missing
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

-- 5. Enable RLS and Add Policies (Crucial for anon access)
ALTER TABLE "customer-order-header" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "order-line-item-detail" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "delivery-address-information" ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customer-order-header' AND policyname = 'Enable insert for all') THEN
        CREATE POLICY "Enable insert for all" ON "customer-order-header" FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customer-order-header' AND policyname = 'Enable select for all') THEN
       CREATE POLICY "Enable select for all" ON "customer-order-header" FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'order-line-item-detail' AND policyname = 'Enable insert for all') THEN
        CREATE POLICY "Enable insert for all" ON "order-line-item-detail" FOR INSERT WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'delivery-address-information' AND policyname = 'Enable insert for all') THEN
        CREATE POLICY "Enable insert for all" ON "delivery-address-information" FOR INSERT WITH CHECK (true);
    END IF;
END $$;

NOTIFY "pgrst", 'reload schema';
