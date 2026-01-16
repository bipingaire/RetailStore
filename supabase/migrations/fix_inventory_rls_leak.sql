-- FIX INVENTORY LEAK
-- The "Public" policy was too broad (included 'authenticated'), which allowed
-- Admins to bypass their strict tenant checks.
-- This script splits the policies so Admins are ALWAYS checked strictly.

BEGIN;

-- 1. Drop the leaky policy
DROP POLICY IF EXISTS "Public can view active inventory" ON "retail-store-inventory-item";

-- 2. Re-create it STRICTLY for 'anon' (Guest Shoppers)
-- Guests can see active items (Frontend filters by tenant)
CREATE POLICY "Public (Anon) can view active inventory"
ON "retail-store-inventory-item"
FOR SELECT
TO anon
USING ("is-active" = true);

-- 3. Ensure 'authenticated' users (Admins & Customers) use the Strict Policy
-- (This is already covered by 'tenant_admin_manage_inventory' which uses get_my_tenant_id())

COMMIT;

-- Verify Policies after change
SELECT policyname, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'retail-store-inventory-item';
