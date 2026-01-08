-- Revenue & Billing Schema
-- Creates tables for subscription management and transaction tracking

-- 1. Tenant Subscriptions Table
CREATE TABLE IF NOT EXISTS "tenant-subscriptions" (
  "subscription-id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenant-id" UUID NOT NULL REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE,
  "plan-type" TEXT NOT NULL CHECK ("plan-type" IN ('free', 'beta', 'pro', 'enterprise')),
  "monthly-price" DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  "start-date" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "end-date" TIMESTAMPTZ,
  "status" TEXT NOT NULL DEFAULT 'active' CHECK ("status" IN ('active', 'cancelled', 'expired', 'trial')),
  "created-at" TIMESTAMPTZ DEFAULT NOW(),
  "updated-at" TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Billing Transactions Table
CREATE TABLE IF NOT EXISTS "billing-transactions" (
  "transaction-id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenant-id" UUID NOT NULL REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE,
  "subscription-id" UUID REFERENCES "tenant-subscriptions"("subscription-id") ON DELETE SET NULL,
  "amount" DECIMAL(10, 2) NOT NULL,
  "transaction-date" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "status" TEXT NOT NULL DEFAULT 'pending' CHECK ("status" IN ('paid', 'pending', 'failed', 'refunded')),
  "payment-method" TEXT,
  "receipt-url" TEXT,
  "description" TEXT,
  "created-at" TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_tenant_subscriptions_tenant ON "tenant-subscriptions"("tenant-id");
CREATE INDEX IF NOT EXISTS idx_tenant_subscriptions_status ON "tenant-subscriptions"("status");
CREATE INDEX IF NOT EXISTS idx_billing_transactions_tenant ON "billing-transactions"("tenant-id");
CREATE INDEX IF NOT EXISTS idx_billing_transactions_date ON "billing-transactions"("transaction-date" DESC);

-- 4. Enable RLS
ALTER TABLE "tenant-subscriptions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "billing-transactions" ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies - Superadmin Full Access
CREATE POLICY superadmin_manage_subscriptions ON "tenant-subscriptions"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "superadmin-users"
      WHERE "user-id" = auth.uid()
    )
  );

CREATE POLICY superadmin_manage_transactions ON "billing-transactions"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "superadmin-users"
      WHERE "user-id" = auth.uid()
    )
  );

-- 6. Seed Sample Subscriptions for Existing Tenants
INSERT INTO "tenant-subscriptions" ("tenant-id", "plan-type", "monthly-price", "start-date", "status")
SELECT 
  "tenant-id",
  "subscription-tier",
  CASE "subscription-tier"
    WHEN 'free' THEN 0.00
    WHEN 'beta' THEN 0.00
    WHEN 'pro' THEN 49.99
    WHEN 'enterprise' THEN 199.99
    ELSE 0.00
  END as monthly_price,
  "created-at",
  'active'
FROM "retail-store-tenant"
WHERE NOT EXISTS (
  SELECT 1 FROM "tenant-subscriptions" 
  WHERE "tenant-subscriptions"."tenant-id" = "retail-store-tenant"."tenant-id"
);

-- 7. Seed Sample Transactions for Pro/Enterprise Tenants
INSERT INTO "billing-transactions" ("tenant-id", "subscription-id", "amount", "transaction-date", "status", "payment-method", "description")
SELECT 
  ts."tenant-id",
  ts."subscription-id",
  ts."monthly-price",
  ts."start-date" + INTERVAL '1 month' * generate_series(0, 2),
  'paid',
  'stripe',
  'Monthly subscription payment - ' || ts."plan-type"
FROM "tenant-subscriptions" ts
WHERE ts."plan-type" IN ('pro', 'enterprise')
AND ts."monthly-price" > 0;
