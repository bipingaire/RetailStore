-- Seed 3 Sample Tenants with Admin Users
-- Password for all users: password123

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
    -- Tenant IDs
    tech_tenant_id uuid := gen_random_uuid();
    fresh_tenant_id uuid := gen_random_uuid();
    style_tenant_id uuid := gen_random_uuid();
    
    -- User IDs
    tech_user_id uuid := gen_random_uuid();
    fresh_user_id uuid := gen_random_uuid();
    style_user_id uuid := gen_random_uuid();
BEGIN
    ---------- 1. TECH HAVEN ----------
    -- Create User
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
    VALUES (
        tech_user_id, 
        'admin@techhaven.com', 
        crypt('password123', gen_salt('bf')), 
        now(), 
        '{"full_name": "Tech Admin"}'
    );

    -- Create Tenant (Matches final_consolidated_schema.sql)
    INSERT INTO "retail-store-tenant" ("tenant-id", "store-name", "store-address", "store-city", "subscription-tier")
    VALUES (tech_tenant_id, 'Tech Haven', '123 Tech Blvd', 'San Francisco', 'pro');

    -- Create Subdomain Mapping
    INSERT INTO "subdomain-tenant-mapping" ("subdomain", "tenant-id")
    VALUES ('techhaven', tech_tenant_id);

    -- Grant Admin Role
    INSERT INTO "tenant-user-role" ("user-id", "tenant-id", "role-type")
    VALUES (tech_user_id, tech_tenant_id, 'owner');


    ---------- 2. FRESH MART ----------
    -- Create User
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
    VALUES (
        fresh_user_id, 
        'admin@freshmart.com', 
        crypt('password123', gen_salt('bf')), 
        now(), 
        '{"full_name": "Fresh Admin"}'
    );

    -- Create Tenant
    INSERT INTO "retail-store-tenant" ("tenant-id", "store-name", "store-address", "store-city", "subscription-tier")
    VALUES (fresh_tenant_id, 'Fresh Mart', '456 Farm Ln', 'Portland', 'beta');

    -- Create Subdomain Mapping
    INSERT INTO "subdomain-tenant-mapping" ("subdomain", "tenant-id")
    VALUES ('freshmart', fresh_tenant_id);

    -- Grant Admin Role
    INSERT INTO "tenant-user-role" ("user-id", "tenant-id", "role-type")
    VALUES (fresh_user_id, fresh_tenant_id, 'owner');


    ---------- 3. STYLE BOUTIQUE ----------
    -- Create User
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
    VALUES (
        style_user_id, 
        'admin@styleboutique.com', 
        crypt('password123', gen_salt('bf')), 
        now(), 
        '{"full_name": "Style Admin"}'
    );

    -- Create Tenant
    INSERT INTO "retail-store-tenant" ("tenant-id", "store-name", "store-address", "store-city", "subscription-tier")
    VALUES (style_tenant_id, 'Style Boutique', '789 Fashion Ave', 'New York', 'enterprise');

    -- Create Subdomain Mapping
    INSERT INTO "subdomain-tenant-mapping" ("subdomain", "tenant-id")
    VALUES ('styleboutique', style_tenant_id);

    -- Grant Admin Role
    INSERT INTO "tenant-user-role" ("user-id", "tenant-id", "role-type")
    VALUES (style_user_id, style_tenant_id, 'owner');

    RAISE NOTICE 'Seeded 3 tenants: Tech Haven (techhaven), Fresh Mart (freshmart), Style Boutique (styleboutique)';
END $$;
