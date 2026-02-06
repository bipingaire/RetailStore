-- FIX: Drop the recursive policy that caused 500 errors
DROP POLICY IF EXISTS "Allow superadmins to read all superadmin records" ON "superadmin-users";

-- Ensure the "read own" policy is present (it is safe)
DROP POLICY IF EXISTS "Allow users to read own superadmin status" ON "superadmin-users";
CREATE POLICY "Allow users to read own superadmin status"
ON "superadmin-users"
FOR SELECT
TO authenticated
USING (auth.uid() = "user-id");

-- Create a secure function to check superadmin status (avoids recursion for future policies)
CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM "superadmin-users"
    WHERE "user-id" = auth.uid()
    AND "is-active" = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- (Optional) If we really need "read all", we can use the function now, 
-- but we must be careful. The function uses SECURITY DEFINER so it bypasses RLS 
-- to check the table, preventing the recursion loop in the policy check itself.
CREATE POLICY "Allow superadmins to read all records"
ON "superadmin-users"
FOR SELECT
TO authenticated
USING ( is_superadmin() );
