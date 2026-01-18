-- =====================================================
-- FIX: Allow customers to create and view their own orders
-- =====================================================

-- 1. Enable RLS on order tables
ALTER TABLE "customer-order-header" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "order-line-item-detail" ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing restrictive policies
DROP POLICY IF EXISTS "Customers can view own orders" ON "customer-order-header";
DROP POLICY IF EXISTS "Customers can create own orders" ON "customer-order-header";
DROP POLICY IF EXISTS "Customers can view own line items" ON "order-line-item-detail";
DROP POLICY IF EXISTS "Customers can create own line items" ON "order-line-item-detail";

-- 3. Allow customers to INSERT their own orders
CREATE POLICY "Customers can create own orders" 
ON "customer-order-header"
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = "customer-id");

-- 4. Allow customers to SELECT (view) their own orders
CREATE POLICY "Customers can view own orders" 
ON "customer-order-header"
FOR SELECT 
TO authenticated
USING (auth.uid() = "customer-id");

-- 5. Allow customers to INSERT line items for their orders
CREATE POLICY "Customers can create own line items" 
ON "order-line-item-detail"
FOR INSERT 
TO authenticated
WITH CHECK (
  "order-id" IN (
    SELECT "order-id" FROM "customer-order-header" 
    WHERE "customer-id" = auth.uid()
  )
);

-- 6. Allow customers to view line items for their orders
CREATE POLICY "Customers can view own line items" 
ON "order-line-item-detail"
FOR SELECT 
TO authenticated
USING (
  "order-id" IN (
    SELECT "order-id" FROM "customer-order-header" 
    WHERE "customer-id" = auth.uid()
  )
);

DO $$
BEGIN
  RAISE NOTICE '✅ Order RLS policies updated - customers can now create and view orders';
END $$;
