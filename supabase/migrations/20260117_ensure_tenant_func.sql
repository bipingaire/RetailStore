-- ========================================================
-- FIX: ENSURE RLS HELPER FUNCTION EXISTS
-- The policies rely on get_my_tenant_id(), so we must ensure it exists.
-- ========================================================

CREATE OR REPLACE FUNCTION get_my_tenant_id()
RETURNS UUID AS $$
  SELECT "tenant-id" 
  FROM "tenant-user-role" 
  WHERE "user-id" = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Grant execution to authenticated users
GRANT EXECUTE ON FUNCTION get_my_tenant_id() TO authenticated;
GRANT EXECUTE ON FUNCTION get_my_tenant_id() TO service_role;

DO $$
BEGIN
  RAISE NOTICE '✅ get_my_tenant_id() function secured.';
END $$;
