-- CREATE THE ONE MASTER SUPERADMIN ACCOUNT
-- This is the OWNER of the entire platform, separate from all retail store admins

-- Enable required extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create or update the superadmin user
DO $$
DECLARE
    superadmin_user_id uuid;
    user_exists boolean;
BEGIN
    -- Check if user already exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'superadmin@retailos.com') INTO user_exists;
    
    IF user_exists THEN
        -- Update existing user
        UPDATE auth.users
        SET 
            encrypted_password = crypt('password123', gen_salt('bf')),
            email_confirmed_at = NOW(),
            updated_at = NOW()
        WHERE email = 'superadmin@retailos.com';
        
        -- Get the user ID
        SELECT id INTO superadmin_user_id FROM auth.users WHERE email = 'superadmin@retailos.com';
    ELSE
        -- Create new user
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'superadmin@retailos.com',
            crypt('password123', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider":"email","providers":["email"]}',
            '{"full_name":"Master Superadmin"}',
            NOW(),
            NOW(),
            '',
            '',
            '',
            ''
        )
        RETURNING id INTO superadmin_user_id;
    END IF;
    
    -- Add/update in superadmin-users table
    INSERT INTO "superadmin-users" (
        "user-id",
        "full-name",
        "email",
        "permissions-json",
        "is-active"
    ) VALUES (
        superadmin_user_id,
        'Master Superadmin',
        'superadmin@retailos.com',
        '{"manage_stores": true, "manage_products": true, "manage_users": true, "view_analytics": true, "global_admin": true}'::jsonb,
        true
    )
    ON CONFLICT ("user-id") 
    DO UPDATE SET 
        "email" = 'superadmin@retailos.com',
        "is-active" = true,
        "permissions-json" = '{"manage_stores": true, "manage_products": true, "manage_users": true, "view_analytics": true, "global_admin": true}'::jsonb;
        
    RAISE NOTICE 'Master Superadmin account ready. Email: superadmin@retailos.com';
END $$;
