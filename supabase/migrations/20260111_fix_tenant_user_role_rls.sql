-- Fix tenant-user-role RLS policy for SELECT
-- This fixes the 406 Not Acceptable error when querying tenant-user-role

-- Enable RLS if not already enabled
ALTER TABLE "tenant-user-role" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own tenant roles" ON "tenant-user-role";
DROP POLICY IF EXISTS "Allow users to view their tenant roles" ON "tenant-user-role";

-- Create a SELECT policy that allows users to view their own roles
CREATE POLICY "Users can SELECT their own tenant roles"
ON "tenant-user-role"
FOR SELECT
USING (auth.uid() = "user-id");

-- Optional: If admins need to view all roles, you can add this
-- CREATE POLICY "Admins can SELECT all tenant roles"
-- ON "tenant-user-role"
-- FOR SELECT
-- USING (
--   EXISTS (
--     SELECT 1 FROM "tenant-user-role" 
--     WHERE "user-id" = auth.uid() AND "role-type" = 'admin'
--   )
-- );
