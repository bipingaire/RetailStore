-- =====================================================
-- CUSTOMER PROFILE MIGRATION
-- Creates a customers table and links it to auth.users
-- =====================================================

-- 1. Create Customers Table
CREATE TABLE IF NOT EXISTS "customers" (
  "id" UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  "full-name" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "created-at" TIMESTAMPTZ DEFAULT NOW(),
  "updated-at" TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own profile" 
ON "customers" FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON "customers" FOR UPDATE 
USING (auth.uid() = id);

-- 2. Create Trigger Function to Auto-Create Profile
CREATE OR REPLACE FUNCTION public.handle_new_customer() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."customers" ("id", "full-name", "email", "phone")
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.email,
    new.raw_user_meta_data->>'phone'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create Trigger
DROP TRIGGER IF EXISTS on_auth_user_created_customer ON auth.users;
CREATE TRIGGER on_auth_user_created_customer
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_customer();

-- 4. Backfill existing users (Optional, safe to run)
INSERT INTO "customers" ("id", "full-name", "email", "phone")
SELECT 
  id,
  raw_user_meta_data->>'full_name',
  email,
  raw_user_meta_data->>'phone'
FROM auth.users
WHERE NOT EXISTS (SELECT 1 FROM "customers" WHERE "customers".id = auth.users.id);

DO $$
BEGIN
  RAISE NOTICE '✅ Customers table created and trigger set up.';
END $$;
