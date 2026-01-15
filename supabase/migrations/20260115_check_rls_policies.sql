````````````````````-- =====================================================
-- DIAGNOSTIC: Check RLS Policies on Master Catalog
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '--- Checking Table RLS Status ---';
  
  -- 1. Is RLS enabled?
  IF (SELECT relrowsecurity FROM pg_class WHERE oid = 'global-product-master-catalog'::regclass) THEN
    RAISE NOTICE '🔒 RLS is ENABLED on global-product-master-catalog';
  ELSE
    RAISE NOTICE '🔓 RLS is DISABLED on global-product-master-catalog (Everyone sees everything)';
  END IF;

  RAISE NOTICE ' ';
  RAISE NOTICE '--- Listing Active Policies ---';
END $$;

-- 2. List Policies
SELECT policyname, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'global-product-master-catalog';

-- 3. Check if Superadmin Table allows reads (often used in policies)
-- If this table is locked, policies doing `EXISTS (SELECT 1 FROM "superadmin-users" ...)` will fail
SELECT 
  'superadmin-users RLS Status',
  CASE WHEN relrowsecurity THEN 'Enabled' ELSE 'Disabled' END 
FROM pg_class WHERE oid = 'superadmin-users'::regclass;
````````````````````