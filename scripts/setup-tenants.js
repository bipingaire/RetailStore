#!/usr/bin/env node
/**
 * setup-tenants.js — One-shot tenant provisioning script.
 * Run on the server: node scripts/setup-tenants.js
 *
 * What it does:
 *  1. Creates tenant PostgreSQL databases (retail_store_highpoint, retail_store_greensboro)
 *  2. Runs prisma db push for the tenant schema on each DB
 *  3. Creates admin User records in each tenant DB
 *  4. Seeds the super admin in the master DB
 */

const { execSync } = require('child_process');
const http = require('http');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3011';

const TENANTS = [
    {
        subdomain: 'highpoint',
        dbName: 'retail_store_highpoint',
        adminEmail: 'admin@highpoint.indumart.us',
        adminPassword: 'Highpoint@2024',
        adminName: 'Highpoint Admin',
    },
    {
        subdomain: 'greensboro',
        dbName: 'retail_store_greensboro',
        adminEmail: 'admin@greensboro.indumart.us',
        adminPassword: 'Greensboro@2024',
        adminName: 'Greensboro Admin',
    },
];

function runInContainer(cmd) {
    return execSync(`docker exec retail_store_backend sh -c ${JSON.stringify(cmd)}`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
    });
}

function runInDb(sql) {
    return execSync(
        `docker exec retail_store_db psql -U postgres -c ${JSON.stringify(sql)}`,
        { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
}

async function main() {
    console.log('\n🚀 Setting up tenant databases and admin users...\n');

    for (const tenant of TENANTS) {
        console.log(`\n──── ${tenant.subdomain.toUpperCase()} ────────────────────────`);

        // 1. Create PostgreSQL database
        try {
            runInDb(`CREATE DATABASE "${tenant.dbName}";`);
            console.log(`  ✅ Created database: ${tenant.dbName}`);
        } catch (e) {
            if (e.message.includes('already exists')) {
                console.log(`  ℹ️  Database already exists: ${tenant.dbName}`);
            } else {
                console.error(`  ❌ Failed to create DB: ${e.message}`);
            }
        }

        // 2. Run tenant schema migration
        const dbUrl = `postgresql://postgres:123@db:5432/${tenant.dbName}?schema=public`;
        try {
            const result = runInContainer(
                `DATABASE_URL="${dbUrl}" npx prisma db push --schema prisma/schema-tenant.prisma --skip-generate`
            );
            console.log(`  ✅ Schema migrated`);
        } catch (e) {
            console.error(`  ❌ Migration failed: ${e.message}`);
        }

        // 3. Create admin user in tenant DB
        const bcryptHash = runInContainer(
            `node -e "const b=require('bcryptjs');b.hash('${tenant.adminPassword}',10).then(h=>process.stdout.write(h))"`
        ).trim();

        try {
            runInDb(
                `\\c "${tenant.dbName}"; INSERT INTO users (id, email, password, name, role, "createdAt", "updatedAt") VALUES (gen_random_uuid()::text, '${tenant.adminEmail}', '${bcryptHash}', '${tenant.adminName}', 'ADMIN', NOW(), NOW()) ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;`
            );
            console.log(`  ✅ Admin user created: ${tenant.adminEmail}`);
        } catch (e) {
            console.error(`  ❌ Failed to create user: ${e.message}`);
        }

        // 4. Update tenant record databaseUrl in master DB
        try {
            runInDb(
                `UPDATE tenants SET "databaseUrl" = '${dbUrl}' WHERE subdomain = '${tenant.subdomain}';`
            );
            console.log(`  ✅ Tenant databaseUrl updated`);
        } catch (e) {
            console.error(`  ❌ Failed to update tenant: ${e.message}`);
        }
    }

    // 5. Seed super admin in master DB
    console.log('\n──── SUPER ADMIN ────────────────────────');
    const saHash = runInContainer(
        `node -e "const b=require('bcryptjs');b.hash('RetailOS@2024',10).then(h=>process.stdout.write(h))"`
    ).trim();
    try {
        runInDb(
            `INSERT INTO super_admin_users (id, email, password, name, "createdAt", "updatedAt") VALUES (gen_random_uuid()::text, 'admin@retailos.cloud', '${saHash}', 'Super Administrator', NOW(), NOW()) ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;`
        );
        console.log(`  ✅ Super admin: admin@retailos.cloud / RetailOS@2024`);
    } catch (e) {
        console.error(`  ❌ Super admin failed: ${e.message}`);
    }

    console.log('\n\n✅ Setup Complete!\n');
    console.log('┌─────────────────────────────────────────────────────┐');
    console.log('│  CREDENTIALS                                        │');
    console.log('├─────────────────────────────────────────────────────┤');
    console.log('│  Super Admin:                                       │');
    console.log('│    URL:      https://retailos.cloud/super-admin     │');
    console.log('│    Email:    admin@retailos.cloud                   │');
    console.log('│    Password: RetailOS@2024                          │');
    console.log('├─────────────────────────────────────────────────────┤');
    console.log('│  Highpoint Admin:                                   │');
    console.log('│    URL:      https://highpoint.indumart.us/admin    │');
    console.log('│    Email:    admin@highpoint.indumart.us            │');
    console.log('│    Password: Highpoint@2024                         │');
    console.log('├─────────────────────────────────────────────────────┤');
    console.log('│  Greensboro Admin:                                  │');
    console.log('│    URL:      https://greensboro.indumart.us/admin   │');
    console.log('│    Email:    admin@greensboro.indumart.us           │');
    console.log('│    Password: Greensboro@2024                        │');
    console.log('└─────────────────────────────────────────────────────┘\n');
}

main().catch(e => {
    console.error('Setup failed:', e.message);
    process.exit(1);
});
