-- Reset Password for user dfeaeff6...
-- Sets password to "password123"
UPDATE auth.users
SET encrypted_password = crypt('password123', gen_salt('bf'))
WHERE id = 'dfeaeff6-3aa3-40d5-9674-7a51d41f6945';

-- Also ensure email is confirmed just in case
UPDATE auth.users
SET email_confirmed_at = now()
WHERE id = 'dfeaeff6-3aa3-40d5-9674-7a51d41f6945';
