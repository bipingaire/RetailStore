-- Migration: Fix RLS Policies for Admin Login (2026-02-07)
-- Description: Ensures Owners and Staff can read their own tenant/role data to log in.

-- 1. Enable RLS on tables (Safety check)
ALTER TABLE public."retail-store-tenant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."tenant-user-role" ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts duplicates
DROP POLICY IF EXISTS "Enable read access for owners" ON public."retail-store-tenant";
DROP POLICY IF EXISTS "Enable read access for own roles" ON public."tenant-user-role";
DROP POLICY IF EXISTS "Enable read access for staff store" ON public."retail-store-tenant";
DROP POLICY IF EXISTS "Enable read access for staff" ON public."retail-store-tenant"; -- Remove potential old name

-- 3. Create Policy: Owners can see their own store
CREATE POLICY "Enable read access for owners" 
ON public."retail-store-tenant"
FOR SELECT 
TO authenticated
USING ( 
    auth.uid() = "owner-user-id" 
);

-- 4. Create Policy: Users can see their own role assignment
CREATE POLICY "Enable read access for own roles" 
ON public."tenant-user-role"
FOR SELECT 
TO authenticated
USING ( 
    auth.uid() = "user-id" 
);

-- 5. Create Policy: Staff can see the Store they are assigned to
CREATE POLICY "Enable read access for staff store" 
ON public."retail-store-tenant"
FOR SELECT 
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM public."tenant-user-role" tur 
        WHERE tur."tenant-id" = "retail-store-tenant"."tenant-id"
        AND tur."user-id" = auth.uid()
    )
);
