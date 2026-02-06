-- DELETE BROKEN USER TO ALLOW RE-SIGNUP
-- We delete the user with the known ID so you can sign up again with a fresh password.

DELETE FROM auth.users
WHERE id = 'dfeaeff6-3aa3-40d5-9674-7a51d41f6945';

-- Also clean up the superadmin table entry if it exists to avoid conflicts
DELETE FROM "superadmin-users"
WHERE "user-id" = 'dfeaeff6-3aa3-40d5-9674-7a51d41f6945';
