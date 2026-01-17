-- =====================================================
-- TENANT PAYMENT CONFIGURATION
-- Stores Stripe API keys per tenant for checkout
-- =====================================================

CREATE TABLE IF NOT EXISTS "tenant-payment-config" (
  "config-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE UNIQUE,
  "stripe-publishable-key" TEXT,
  "stripe-secret-key" TEXT,
  "payment-enabled" BOOLEAN DEFAULT false,
  "created-at" TIMESTAMPTZ DEFAULT NOW(),
  "updated-at" TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE "tenant-payment-config" ENABLE ROW LEVEL SECURITY;

-- Policy: Tenants can only see/edit their own payment config
DROP POLICY IF EXISTS "tenant_isolation_payment_config" ON "tenant-payment-config";
CREATE POLICY "tenant_isolation_payment_config"
ON "tenant-payment-config"
FOR ALL
TO authenticated
USING (
  "tenant-id" = get_my_tenant_id()
  OR is_superadmin(auth.uid())
)
WITH CHECK (
  "tenant-id" = get_my_tenant_id()
  OR is_superadmin(auth.uid())
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS "idx_payment_config_tenant" ON "tenant-payment-config"("tenant-id");

DO $$
BEGIN
  RAISE NOTICE '✅ Tenant Payment Configuration table created with RLS enabled.';
END $$;
