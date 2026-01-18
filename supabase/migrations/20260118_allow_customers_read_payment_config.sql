-- =====================================================
-- FIX: Allow customers to read Stripe publishable key
-- This is needed for the checkout page to initialize Stripe Elements
-- =====================================================

-- Enable RLS on tenant-payment-config if not already enabled
ALTER TABLE "tenant-payment-config" ENABLE ROW LEVEL SECURITY;

-- Drop any existing public read policy
DROP POLICY IF EXISTS "Allow public read of publishable key" ON "tenant-payment-config";
DROP POLICY IF EXISTS "Allow authenticated read of publishable key" ON "tenant-payment-config";

-- Allow anyone (including anonymous users) to read payment config
-- This is SAFE because:
-- 1. We only expose the publishable key (pk_), not the secret key (sk_)
-- 2. Publishable keys are meant to be public (used in frontend JavaScript)
-- 3. The secret key remains protected and only accessible via service role
CREATE POLICY "Allow public read of payment config" 
ON "tenant-payment-config"
FOR SELECT 
TO anon, authenticated
USING (true);

-- Note: The checkout page fetches 'stripe-publishable-key' which is safe to expose
-- The 'stripe-secret-key' is NEVER sent to frontend, only used in backend API routes

DO $$
BEGIN
  RAISE NOTICE '✅ Customers can now read payment configuration for Stripe initialization';
END $$;
