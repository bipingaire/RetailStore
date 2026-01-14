-- Fix RLS policies for retail-store-tenant table
-- Allow superadmins to read all tenant data

-- Enable RLS if not already enabled
ALTER TABLE "retail-store-tenant" ENABLE ROW LEVEL SECURITY;

-- Drop existing restrictive policies if any
DROP POLICY IF EXISTS "tenant_read_own" ON "retail-store-tenant";
DROP POLICY IF EXISTS "tenant_read_all" ON "retail-store-tenant";
DROP POLICY IF EXISTS "superadmin_read_all_tenants" ON "retail-store-tenant";
DROP POLICY IF EXISTS "user_read_own_tenant" ON "retail-store-tenant";

-- Allow superadmins to read ALL tenants
CREATE POLICY "superadmin_read_all_tenants"
ON "retail-store-tenant"
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "superadmin-users"
        WHERE "user-id" = auth.uid()
        AND "is-active" = true
    )
);

-- Allow users to read their own tenant
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
