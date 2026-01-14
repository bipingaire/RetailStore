-- =====================================================
-- DEBUG: LIST ALL TRIGGERS ON AUTH.USERS
-- =====================================================

DO $$
DECLARE
  r RECORD;
BEGIN
  RAISE NOTICE '🔍 SCANNING FOR TRIGGERS ON auth.users...';
  
  FOR r IN (
    SELECT 
      trigger_schema, 
      trigger_name, 
      event_manipulation, 
      action_statement, 
      action_timing
    FROM information_schema.triggers
    WHERE event_object_schema = 'auth' 
    AND event_object_table = 'users'
  ) LOOP
    RAISE NOTICE '👉 FOUND TRIGGER: % (%) - Fires % %', r.trigger_name, r.trigger_schema, r.action_timing, r.event_manipulation;
  END LOOP;
  
  -- Also check pg_trigger for internal system triggers just in case
  FOR r IN (
    SELECT tgname 
    FROM pg_trigger 
    WHERE tgrelid = 'auth.users'::regclass
  ) LOOP
    RAISE NOTICE '   (pg_trigger entry): %', r.tgname;
  END LOOP;
  
  RAISE NOTICE '✅ SCAN COMPLETE.';
END $$;
