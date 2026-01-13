-- Fix customer-order-header RLS policy for customer access
-- This ensures customers can view their own orders

-- Drop existing policies
DROP POLICY IF EXISTS "Enable select for all" ON "customer-order-header";
DROP POLICY IF EXISTS "Enable insert for all" ON "customer-order-header";

-- Create policy that allows customers to view their own orders
CREATE POLICY "Customers can view their own orders"
ON "customer-order-header"
FOR SELECT
USING (auth.uid() = "customer-id");

-- Allow authenticated users to insert orders (for checkout)
CREATE POLICY "Authenticated users can create orders"
ON "customer-order-header"
FOR INSERT
WITH CHECK (auth.uid() = "customer-id");

-- Optional: Allow admins to view all orders
-- CREATE POLICY "Admins can view all orders"
-- ON "customer-order-header"
-- FOR SELECT
-- USING (
--   EXISTS (
--     SELECT 1 FROM "tenant-user-role"
--     WHERE "user-id" = auth.uid() AND "role-type" = 'admin'
--   )
-- );
