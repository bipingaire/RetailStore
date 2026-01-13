-- =================================================================
-- DISABLE RLS POLICIES FOR INVENTORY (AS REQUESTED)
-- Drops security policies and disables RLS to allow full access.
-- =================================================================

-- 1. Disable RLS on inventory table
ALTER TABLE "retail-store-inventory-item" DISABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to be clean
DROP POLICY IF EXISTS "Enable all for authenticated" ON "retail-store-inventory-item";
DROP POLICY IF EXISTS "Admins can view tenant inventory" ON "retail-store-inventory-item";
DROP POLICY IF EXISTS "Admins can manage tenant inventory" ON "retail-store-inventory-item";

-- 3. Disable RLS on Global Catalog
ALTER TABLE "global-product-master-catalog" DISABLE ROW LEVEL SECURITY;

-- 4. Drop Global Catalog policies
DROP POLICY IF EXISTS "Global products viewable by all" ON "global-product-master-catalog";

DO $$
BEGIN
  RAISE NOTICE '✅ RLS disabled for inventory and global catalog. All data is now visible.';
END $$;
