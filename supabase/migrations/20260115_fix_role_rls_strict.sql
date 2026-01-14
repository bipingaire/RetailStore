-- =====================================================
-- FIX TENANT USER ROLE RLS (Allow Insert)
-- =====================================================

-- 1. DROP RESTRICTIVE POLICIES
DROP POLICY IF EXISTS "Users can SELECT their own tenant roles" ON "tenant-user-role";
DROP POLICY IF EXISTS "Users can INSERT their own tenant roles" ON "tenant-user-role";

-- 2. ALLOW SELECT (See own roles)
CREATE POLICY "Users can SELECT their own tenant roles"
ON "tenant-user-role"
FOR SELECT
TO authenticated
USING (auth.uid() = "user-id");

-- 3. ALLOW INSERT (Crucial for Registration)
-- A user should be able to assign THEMSELVES a role.
-- We can restrict it so they can only assign themselves (no one else).
-- And maybe restrict role type? For now, we trust the API/Trigger logic to validate logic, 
-- but RLS needs to allow the row creation.
CREATE POLICY "Users can INSERT their own tenant roles"
ON "tenant-user-role"
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "user-id");

-- 4. OPTIONAL: Allow Superadmin full access
CREATE POLICY "Superadmin manage roles"
ON "tenant-user-role"
FOR ALL
TO authenticated
USING (is_superadmin(auth.uid()))
WITH CHECK (is_superadmin(auth.uid()));

DO $$
BEGIN
  RAISE NOTICE '✅ Enabled INSERT/SELECT policies for tenant-user-role.';
END $$;
