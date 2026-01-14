-- =====================================================
-- NUCLEAR OPTION: RESET USER & TRIGGERS
-- =====================================================

-- 1. DROP THE TRIGGER (Again, to be 100% sure)
DROP TRIGGER IF EXISTS on_auth_user_created_customer ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_customer();
DROP FUNCTION IF EXISTS public.handle_new_customer_with_tenant();

-- 2. DELETE THE BROKEN USER USER (So we can recreate him fresh)
DELETE FROM auth.users WHERE email = 'admin@highpoint.indumart.us';

-- 3. CONFIRM CLEAN SLATE
DO $$
BEGIN
  RAISE NOTICE '✅ Deleted user "admin@highpoint.indumart.us" and dropped triggers.';
  RAISE NOTICE '👉 NOW: Run the "SETUP HIGHPOINT ADMIN" script again to recreate him properly.';
END $$;
