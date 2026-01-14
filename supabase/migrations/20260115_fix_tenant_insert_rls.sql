-- =====================================================
-- FIX TENANT MANAGEMENT RLS (Allow Update/Insert)
-- =====================================================

-- 1. DROP EXISTING RESTRICTIVE POLICIES (if any interfering ones exist)
DROP POLICY IF EXISTS "tenant_update_own" ON "retail-store-tenant";
DROP POLICY IF EXISTS "tenant_insert_new" ON "retail-store-tenant";

-- 2. ALLOW TENANT OWNERS TO UPDATE THEIR OWN TENANT
CREATE POLICY "tenant_update_own"
ON "retail-store-tenant"
FOR UPDATE
TO authenticated
USING (
    "tenant-id" = get_my_tenant_id()
)
WITH CHECK (
    "tenant-id" = get_my_tenant_id()
);

-- 3. ALLOW NEW USERS TO INSERT A TENANT
-- (Only if they are going to become the owner immediately)
-- This is tricky because "get_my_tenant_id" relies on tenant-user-role existing.
-- For the registration flow, the user might not have a role yet when inserting the tenant.
-- So we allow authenticated users to INSERT, but we trust the trigger/API to link them.
CREATE POLICY "tenant_insert_new"
ON "retail-store-tenant"
FOR INSERT
TO authenticated
WITH CHECK (true); 
-- Note: 'true' is permissive for INSERT, but strict RLS on SELECT/UPDATE 
-- prevents them from messing with others.

-- 4. ENSURE SELECT POLICY IS ROBUST (Re-apply from previous just in case)
DROP POLICY IF EXISTS "user_read_own_tenant" ON "retail-store-tenant";
CREATE POLICY "user_read_own_tenant"
ON "retail-store-tenant"
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "tenant-user-role"
        WHERE "user-id" = auth.uid()
        AND "tenant-id" = "retail-store-tenant"."tenant-id"
    )
);

DO $$
BEGIN
  RAISE NOTICE '✅ Enabled INSERT/UPDATE policies for retail-store-tenant.';
END $$;
