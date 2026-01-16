-- DIAGNOSE ACCESS LEAK
-- 1. List ALL policies on the inventory table to see what survived.
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual 
FROM pg_policies 
WHERE tablename = 'retail-store-inventory-item';

-- 2. Check if this specific user is somehow a 'Superadmin'
-- (Replace params with actual user/email check if possible, but context 'auth.uid()' relies on session)
-- unique query to check superadmin status directly from table
SELECT * FROM "superadmin-users";
