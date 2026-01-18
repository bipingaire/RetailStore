-- ===================================================================
-- FIX: Allow customers (authenticated users) to VIEW store inventory
-- Problem: Current RLS only allows authenticated users with tenant-user-role
-- Solution: Add separate SELECT policy for authenticated/anon users
-- ===================================================================

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "tenant_isolation_inventory" ON "retail-store-inventory-item";

-- Policy 1: Admins/Managers can manage their tenant's inventory
CREATE POLICY "tenant_admins_manage_inventory" 
ON "retail-store-inventory-item"
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

-- Policy 2: EVERYONE (including logged-in customers) can VIEW inventory
CREATE POLICY "public_can_view_inventory" 
ON "retail-store-inventory-item"
FOR SELECT 
TO authenticated, anon
USING (true);  -- Allow all users to see inventory

DO $$
BEGIN
  RAISE NOTICE '✅ Inventory now visible to all users (customers can shop)';
END $$;
