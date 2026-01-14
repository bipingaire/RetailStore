-- =====================================================
-- FIX SUBDOMAIN MAPPING CONSTRAINTS & SECURITY
-- =====================================================

-- 1. Ensure Tenant ID is UNIQUE (One Subdomain per Tenant)
-- This is required for UPSERT { onConflict: 'tenant-id' } to work.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'subdomain_tenant_mapping_tenant_id_key'
  ) THEN
    ALTER TABLE "subdomain-tenant-mapping"
    ADD CONSTRAINT "subdomain_tenant_mapping_tenant_id_key" UNIQUE ("tenant-id");
  END IF;
END $$;


-- 2. ENABLE RLS (It was missing/disabled)
ALTER TABLE "subdomain-tenant-mapping" ENABLE ROW LEVEL SECURITY;

-- 3. DEFINE POLICIES
DROP POLICY IF EXISTS "public_read_mapping" ON "subdomain-tenant-mapping";
DROP POLICY IF EXISTS "tenant_manage_mapping" ON "subdomain-tenant-mapping";
DROP POLICY IF EXISTS "superadmin_manage_mapping" ON "subdomain-tenant-mapping";

-- 3a. Everyone can READ (Needed for middleware resolution)
CREATE POLICY "public_read_mapping"
ON "subdomain-tenant-mapping"
FOR SELECT
TO public
USING (true);

-- 3b. Tenants can MANAGE their own mapping
CREATE POLICY "tenant_manage_mapping"
ON "subdomain-tenant-mapping"
FOR ALL
TO authenticated
USING ("tenant-id" = get_my_tenant_id())
WITH CHECK ("tenant-id" = get_my_tenant_id());

-- 3c. Superadmins have full access
CREATE POLICY "superadmin_manage_mapping"
ON "subdomain-tenant-mapping"
FOR ALL
TO authenticated
USING (is_superadmin(auth.uid()))
WITH CHECK (is_superadmin(auth.uid()));


-- 4. CLEANUP ORPHANS (Optional Safety)
-- Delete mappings pointing to deleted tenants
DELETE FROM "subdomain-tenant-mapping" 
WHERE "tenant-id" NOT IN (SELECT "tenant-id" FROM "retail-store-tenant");

DO $$
BEGIN
  RAISE NOTICE '✅ Fixed Subdomain Constraints (Unique Tenant) & Enabled RLS Policies.';
END $$;
