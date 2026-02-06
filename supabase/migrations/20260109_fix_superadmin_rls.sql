-- Enable RLS on superadmin-users
ALTER TABLE "superadmin-users" ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to read their OWN superadmin status
-- This is critical for isSuperadmin() check on client side
CREATE POLICY "Allow users to read own superadmin status"
ON "superadmin-users"
FOR SELECT
TO authenticated
USING (auth.uid() = "user-id");

-- Policy: Allow superadmins to read ALL superadmin rows
-- (Optional, but good for management)
CREATE POLICY "Allow superadmins to read all superadmin records"
ON "superadmin-users"
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "superadmin-users"
    WHERE "user-id" = auth.uid()
    AND "is-active" = true
  )
);

-- Policy: Allow Service Role (server-side) full access
-- (Implicitly true for service_role, but good for completeness if needed)

-- REPEAT for other tables if necessary
-- Ensure subdomain-tenant-mapping is readable
ALTER TABLE "subdomain-tenant-mapping" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to subdomain mapping"
ON "subdomain-tenant-mapping"
FOR SELECT
TO public
USING (true);
