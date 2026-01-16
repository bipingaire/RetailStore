-- CLEANUP SCRIPT: Delete broken Greensboro users (FIXED SYNTAX)
-- Run this to clear old users so you can re-create them in the Dashboard.

DO $$
BEGIN
    DELETE FROM auth.users 
    WHERE email IN (
        'admin@greensboro.indumart.us', 
        'manager@greensboro.indumart.us', 
        'owner@greensboro.indumart.us',
        'support@greensboro.indumart.us'
    );

    RAISE NOTICE 'Deleted old users. Now go to Authentication -> Users and create admin@greensboro.indumart.us manually.';
END $$;
