-- COMPREHENSIVE FIX FOR MARKETING CAMPAIGN PERMISSIONS
-- Run this entire script in Supabase SQL Editor

-- 1. Ensure table permissions are granted to authenticated users
GRANT ALL ON TABLE public."marketing-campaign-master" TO authenticated;
GRANT ALL ON TABLE public."marketing-campaign-master" TO service_role;

-- 2. Enable RLS (idempotent)
ALTER TABLE public."marketing-campaign-master" ENABLE ROW LEVEL SECURITY;

-- 3. Drop ALL existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public read active campaigns" ON public."marketing-campaign-master";
DROP POLICY IF EXISTS "Enable read access for marketing" ON public."marketing-campaign-master";
DROP POLICY IF EXISTS "Enable insert access for marketing" ON public."marketing-campaign-master";
DROP POLICY IF EXISTS "Enable update access for marketing" ON public."marketing-campaign-master";
DROP POLICY IF EXISTS "Enable delete access for marketing" ON public."marketing-campaign-master";

-- 4. Re-create Permissive Policies

-- SELECT: Public can see active, Authenticated can see all (for now, to unblock)
CREATE POLICY "Public read active campaigns"
ON public."marketing-campaign-master"
FOR SELECT
USING (
  "is-active-flag" = true
);

CREATE POLICY "Authenticated read all campaigns"
ON public."marketing-campaign-master"
FOR SELECT
TO authenticated
USING (true); -- Temporarily allow reading ALL campaigns to debug

-- INSERT/UPDATE/DELETE: Super Admin OR Tenant Owner
CREATE POLICY "Enable write access for marketing"
ON public."marketing-campaign-master"
FOR ALL -- Covers INSERT, UPDATE, DELETE
TO authenticated
USING (
    -- Allow if Super Admin
    is_superadmin(auth.uid()) OR
    -- Allow if User belongs to the Tenant
    EXISTS (
        SELECT 1 
        FROM public."tenant-user-role" tur 
        WHERE tur."tenant-id" = "marketing-campaign-master"."tenant-id"
        AND tur."user-id" = auth.uid()
    )
)
WITH CHECK (
    -- Allow if Super Admin
    is_superadmin(auth.uid()) OR
    -- Allow if User belongs to the Tenant
    EXISTS (
        SELECT 1 
        FROM public."tenant-user-role" tur 
        WHERE tur."tenant-id" = "marketing-campaign-master"."tenant-id"
        AND tur."user-id" = auth.uid()
    )
);
