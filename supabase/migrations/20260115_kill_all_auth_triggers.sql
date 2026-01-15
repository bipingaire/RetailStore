-- =====================================================
-- PANIC BUTTON: DYNAMICALLY WIPE ALL AUTH TRIGGERS
-- =====================================================
-- Use this when you don't know the trigger name but need it gone.

DO $$
DECLARE
    r RECORD;
    count INT := 0;
BEGIN
    RAISE NOTICE '🔥 STARTING TRIGGER PURGE ON auth.users...';

    -- Loop through every trigger attached to auth.users
    FOR r IN (
        SELECT trigger_name 
        FROM information_schema.triggers 
        WHERE event_object_schema = 'auth' 
        AND event_object_table = 'users'
    )
    LOOP
        -- Dynamic DROP
        EXECUTE 'DROP TRIGGER IF EXISTS "' || r.trigger_name || '" ON auth.users';
        RAISE NOTICE '❌ DESTROYED TRIGGER: %', r.trigger_name;
        count := count + 1;
    END LOOP;
    
    IF count = 0 THEN
        RAISE NOTICE '✅ No triggers found. The table is clean.';
    ELSE
        RAISE NOTICE '✅ Successfully removed % triggers.', count;
    END IF;
    
END $$;
