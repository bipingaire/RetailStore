-- =====================================================
-- UPDATE ORDER SCHEMA FOR PAYMENT DETAILS
-- Adds payment-details column to store bank/wallet info
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'customer-order-header' AND column_name = 'payment-details'
  ) THEN
    ALTER TABLE "customer-order-header" 
    ADD COLUMN "payment-details" JSONB;
  END IF;

  -- Verify payment-method constraint if any (it was TEXT in previous migration, so likely no enum to drop)
  -- But just in case we want to be explicit or if there was a constraint I missed. 
  -- The previous check showed "payment-method TEXT", so we are good.
  
  RAISE NOTICE '✅ Added payment-details column to customer-order-header';
END $$;
