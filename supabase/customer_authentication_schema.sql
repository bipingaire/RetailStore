-- =====================================================
-- CUSTOMER AUTHENTICATION ENHANCEMENTS
-- Add to existing schema for customer login/register
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. CUSTOMER PROFILES TABLE
-- ============================================

-- Customer profiles table (extends auth.users with additional fields)
CREATE TABLE IF NOT EXISTS public.customer_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT DEFAULT 'US',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS for customer profiles
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.customer_profiles;
CREATE POLICY "Users can view own profile" 
    ON public.customer_profiles FOR SELECT 
    USING (auth.uid() = id);

-- Policy: Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.customer_profiles;
CREATE POLICY "Users can update own profile" 
    ON public.customer_profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Policy: Users can insert their own profile  
DROP POLICY IF EXISTS "Users can insert own profile" ON public.customer_profiles;
CREATE POLICY "Users can insert own profile" 
    ON public.customer_profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Ensure customer-order-header has proper RLS
ALTER TABLE "customer-order-header" ENABLE ROW LEVEL SECURITY;

-- Policy: Customers can view their own orders
DROP POLICY IF EXISTS "Customers can view own orders" ON "customer-order-header";
CREATE POLICY "Customers can view own orders" 
    ON "customer-order-header" FOR SELECT 
    USING (auth.uid() = "customer-id");

-- Policy: Authenticated users can create orders
DROP POLICY IF EXISTS "Authenticated users can create orders" ON "customer-order-header";
CREATE POLICY "Authenticated users can create orders" 
    ON "customer-order-header" FOR INSERT 
    WITH CHECK (auth.uid() = "customer-id");

-- ============================================
-- 3. VIEWS FOR CUSTOMER DATA
-- ============================================

-- View for customer orders (user-friendly column names)
CREATE OR REPLACE VIEW customer_orders AS 
SELECT 
    "order-id" as order_id,
    "tenant-id" as tenant_id,
    "customer-id" as customer_id,
    "order-date-time" as order_date_time,
    "total-amount-value" as total_amount,
    "final-amount" as final_amount,
    "order-status-code" as order_status,
    "payment-status" as payment_status,
    "payment-method" as payment_method,
    "fulfillment-type" as fulfillment_type,
    "customer-name" as customer_name,
    "customer-email" as customer_email,
    "customer-phone" as customer_phone,
    "created-at" as created_at
FROM "customer-order-header"
WHERE "customer-id" = auth.uid();

-- ============================================
-- 4. TRIGGER FUNCTIONS
-- ============================================

-- Function to create customer profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.customer_profiles (id, full_name, phone)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'phone'
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        full_name = COALESCE(EXCLUDED.full_name, customer_profiles.full_name),
        phone = COALESCE(EXCLUDED.phone, customer_profiles.phone),
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to update customer profile timestamp
CREATE OR REPLACE FUNCTION update_customer_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profile updates
DROP TRIGGER IF EXISTS update_customer_profile_updated_at ON public.customer_profiles;
CREATE TRIGGER update_customer_profile_updated_at
    BEFORE UPDATE ON public.customer_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_profile_timestamp();

-- ============================================
-- 5. INDEXES FOR PERFORMANCE
-- ============================================

-- Index for faster customer order lookups
CREATE INDEX IF NOT EXISTS idx_customer_profiles_phone 
    ON public.customer_profiles(phone);

CREATE INDEX IF NOT EXISTS idx_orders_customer_date 
    ON "customer-order-header"("customer-id", "order-date-time" DESC);

-- ============================================
-- 6. GRANT PERMISSIONS
-- ============================================

-- Grant access to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.customer_profiles TO authenticated;
GRANT SELECT ON customer_orders TO authenticated;
GRANT ALL ON "customer-order-header" TO authenticated;
GRANT SELECT ON "customer-order-header" TO authenticated;

-- Grant access to service role (for admin operations)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ============================================
-- SETUP COMPLETE
-- ============================================

DO $$ 
BEGIN 
    RAISE NOTICE '✅ Customer authentication schema updated successfully!';
    RAISE NOTICE 'Features enabled:';
    RAISE NOTICE '  - Customer profiles with phone and address';
    RAISE NOTICE '  - Row-level security for customer data';
    RAISE NOTICE '  - Auto-create profile on signup';
    RAISE NOTICE '  - Customer order history view';
END $$;
