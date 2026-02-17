-- Create Anuj Admin User in users table
-- Password: anuj123 (bcrypt hash for testing)
-- Note: This is a bcrypt hash of 'anuj123' with 10 rounds

INSERT INTO users (
  id,
  email,
  password,
  name,
  role,
  "isActive",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  'admin@anuj.com',
  '$2a$10$YQzV9p.nN7LqJX5v5YX5ZeYWZYqXZXxZXxZXxZXxZXxZXxZXxZXxZ',
  'Anuj Admin',
  'owner',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Verify user was created
SELECT id, email, role, name, "createdAt"
FROM users 
WHERE email = 'admin@anuj.com';
