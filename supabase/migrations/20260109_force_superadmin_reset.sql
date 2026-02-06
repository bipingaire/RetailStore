-- COMPREHENSIVE FIX FOR SUPERADMIN LOGIN

-- 1. Enable the pgcrypto extension (Redirects need this for password hashing)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Force Update the user credentials so we KNOW the email and password
-- User ID from logs: dfeaeff6-3aa3-40d5-9674-7a51d41f6945
UPDATE auth.users
SET 
    email = 'superadmin@retailos.com',
    encrypted_password = crypt('password123', gen_salt('bf')),
    email_confirmed_at = now(),
    updated_at = now(),
    raw_app_meta_data = '{"provider": "email", "providers": ["email"]}',
    raw_user_meta_data = '{"full_name": "Super Admin"}'
WHERE id = 'dfeaeff6-3aa3-40d5-9674-7a51d41f6945';

-- 3. Ensure this specific UUID exists in auth.users if it somehow doesn't (Optional safety)
-- (We assume the ID exists because it's in your logs)

-- 4. Re-Grant Superadmin Access (Just in case)
INSERT INTO "superadmin-users" ("user-id", "full-name", "email", "permissions-json", "is-active")
VALUES (
  'dfeaeff6-3aa3-40d5-9674-7a51d41f6945',
  'Super Admin',
  'superadmin@retailos.com',
  '{"manage_stores": true, "manage_products": true, "manage_users": true, "view_analytics": true}'::jsonb,
  true
)
ON CONFLICT ("user-id") 
DO UPDATE SET 
    "email" = 'superadmin@retailos.com',
    "is-active" = true;
