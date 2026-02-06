-- =================================================================
-- FIX: RE-LINK ADMIN USER TO INDUMART TENANT
-- The logs show "role data null", meaning the user is NOT linked.
-- We will force the link for 'anujpokharel2engineer@gmail.com'
-- =================================================================

-- 1. Get the User ID for 'anujpokharel2engineer@gmail.com'
DO $$
DECLARE
    v_user_id UUID;
    v_tenant_id UUID := '11111111-1111-1111-1111-111111111111'; -- InduMart Demo
BEGIN
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'anujpokharel2engineer@gmail.com';

    IF v_user_id IS NOT NULL THEN
        -- 2. Clear old links to be safe
        DELETE FROM "tenant-user-role" WHERE "user-id" = v_user_id;

        -- 3. Insert the correct link
        INSERT INTO "tenant-user-role" ("tenant-id", "user-id", "role-type")
        VALUES (v_tenant_id, v_user_id, 'owner');
        
        RAISE NOTICE 'Successfully linked user % to tenant %', v_user_id, v_tenant_id;
    ELSE
        RAISE NOTICE 'User anujpokharel2engineer@gmail.com not found!';
    END IF;
END $$;
