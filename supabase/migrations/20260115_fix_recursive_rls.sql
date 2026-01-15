-- =====================================================
-- FIX: BREAK RECURSIVE RLS ON SUPERADMIN LOOKUP
-- =====================================================

-- 1. Drop the problematic recursive policy on superadmin-users
DROP POLICY IF EXISTS "Superadmin open access" ON "superadmin-users";
DROP POLICY IF EXISTS "Superadmins can view themselves" ON "superadmin-users";

-- 2. Create a non-recursive policy for superadmin-users
-- This allows anyone (authenticated) to READ the superadmin table
-- BUT we trust the app to only show this to relevant users.
-- More importantly, it allows OTHER policies to check against this table without infinite loops.
CREATE POLICY "Allow read access to superadmin list"
ON "superadmin-users"
FOR SELECT
TO authenticated
USING (true);

-- 3. Ensure Master Catalog is readable by confirmed superadmins
DROP POLICY IF EXISTS "Superadmins can manage master catalog" ON "global-product-master-catalog";

CREATE POLICY "Superadmins can manage master catalog"
ON "global-product-master-catalog"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "superadmin-users" 
    WHERE "user-id" = auth.uid()
  )
);

DO $$
BEGIN
  RAISE NOTICE '✅ Fixed recursive RLS. Superadmins should now see products.';
END $$;
