-- Create admin user in Anuj tenant database
-- Password: anuj123 (will be hashed by bcrypt in real app)
INSERT INTO "User" ("user-id", "email", "password-hash", "role", "name", "created-at")
VALUES (
  gen_random_uuid(),
  'admin@anuj.com',
  '$2a$10$YourHashedPasswordHere', -- In production, use bcrypt
  'owner',
  'Anuj Admin',
  NOW()
);

-- Show the created user
SELECT "user-id", "email", "role", "name" FROM "User" WHERE email = 'admin@anuj.com';
