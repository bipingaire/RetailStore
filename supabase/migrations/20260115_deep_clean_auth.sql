-- =====================================================
-- DEEP CLEAN: WIPE ALL TRIGGERS IN AUTH SCHEMA
-- =====================================================
-- If the error persists, the trigger is likely on 'sessions' not 'users'.

DO $$
DECLARE
    r RECORD;
    count INT := 0;
BEGIN
    RAISE NOTICE '🔥 STARTING DEEP SCAN...';

    -- Loop through ALL triggers in the 'auth' schema (users, sessions, refresh_tokens, etc.)
    FOR r IN (
        SELECT event_object_table, trigger_name 
        FROM information_schema.triggers 
        WHERE event_object_schema = 'auth'
    )
    LOOP
        -- Dynamic DROP
        EXECUTE 'DROP TRIGGER IF EXISTS "' || r.trigger_name || '" ON auth."' || r.event_object_table || '"';
        
        RAISE NOTICE '❌ DESTROYED: % ON auth.%', r.trigger_name, r.event_object_table;
        count := count + 1;
    END LOOP;
    
    IF count = 0 THEN
        RAISE NOTICE '✅ No triggers found anywhere in auth schema.';
    ELSE
        RAISE NOTICE '✅ CLEANUP COMPLETE. Removed % triggers.', count;
    END IF;
    
END $$;
