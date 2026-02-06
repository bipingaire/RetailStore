-- FIX 1: Allow users to read their own Retail Store Tenant record
-- This is needed for Owners to log in
ALTER TABLE public."retail-store-tenant" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for owners" ON public."retail-store-tenant"
FOR SELECT
TO authenticated
USING (
  auth.uid() = "owner-user-id"
);

-- FIX 2: Allow users to read their own Role record
-- This is needed for Staff/Managers to log in
ALTER TABLE public."tenant-user-role" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for own roles" ON public."tenant-user-role"
FOR SELECT
TO authenticated
USING (
  auth.uid() = "user-id"
);


-- FIX 3: Allow Staff to read the Tenant record if they have a role
-- (The app queries tenant-user-role !inner join retail-store-tenant)
CREATE POLICY "Enable read access for staff based on role" ON public."retail-store-tenant"
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
