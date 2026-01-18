-- =====================================================
-- CREATE RETAIL CUSTOMER TABLE WITH WALLET BALANCE
-- This is separate from "customers" and includes ecommerce features
-- =====================================================

CREATE TABLE IF NOT EXISTS "retail-store-customer" (
  "customer-id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user-id" UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  "wallet-balance" DECIMAL(10,2) DEFAULT 0,
  "loyalty-points" INTEGER DEFAULT 0,
  "created-at" TIMESTAMPTZ DEFAULT NOW(),
  "updated-at" TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE "retail-store-customer" ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own record
CREATE POLICY "Users can view their own customer record" 
ON "retail-store-customer" FOR SELECT 
TO authenticated
USING (auth.uid() = "user-id");

-- Allow users to update their own record (for admin wallet top-ups)
CREATE POLICY "Admins can manage customer records" 
ON "retail-store-customer" FOR ALL 
TO authenticated
USING (is_superadmin(auth.uid()));

-- Auto-create customer record on signup
CREATE OR REPLACE FUNCTION public.handle_new_retail_customer() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."retail-store-customer" ("user-id", "wallet-balance", "loyalty-points")
  VALUES (new.id, 0, 0)
  ON CONFLICT ("user-id") DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create Trigger
DROP TRIGGER IF EXISTS on_auth_user_created_retail_customer ON auth.users;
CREATE TRIGGER on_auth_user_created_retail_customer
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_retail_customer();

-- Backfill existing users
INSERT INTO "retail-store-customer" ("user-id", "wallet-balance", "loyalty-points")
SELECT id, 0, 0
FROM auth.users
WHERE id NOT IN (SELECT "user-id" FROM "retail-store-customer" WHERE "user-id" IS NOT NULL);

DO $$
BEGIN
  RAISE NOTICE '✅ retail-store-customer table created with auto-trigger';
END $$;
