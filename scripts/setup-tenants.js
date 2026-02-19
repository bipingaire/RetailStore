#!/usr/bin/env node
/**
 * setup-tenants.js — One-shot tenant provisioning script.
 * Run on the server: node scripts/setup-tenants.js
 *
 * What it does:
 *  1. Creates tenant PostgreSQL databases
 *  2. Runs prisma db push for the tenant schema on each DB
 *  3. Creates admin User records in each tenant DB
 *  4. Updates tenant databaseUrl in master DB
 *  5. Seeds the super admin in the master DB
 */

const { execSync } = require('child_process');

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

// Run a command inside the backend container
function inBackend(cmd) {
    return execSync(`docker exec retail_store_backend sh -c ${JSON.stringify(cmd)}`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
    });
}

// Run SQL against a specific database (uses -d flag, NOT \c)
function inDb(database, sql) {
    return execSync(
        `docker exec retail_store_db psql -U postgres -d ${database} -c ${JSON.stringify(sql)}`,
        { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
}

// Create a new database (runs against postgres default DB, not -d)
function createDatabase(dbName) {
    return execSync(
        `docker exec retail_store_db psql -U postgres -c ${JSON.stringify(`CREATE DATABASE "${dbName}";`)}`,
        { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
}

async function main() {
    console.log('\n🚀 Setting up tenant databases and admin users...\n');

    for (const tenant of TENANTS) {
        console.log(`\n──── ${tenant.subdomain.toUpperCase()} ────────────────────────`);

        // 1. Create PostgreSQL database
        try {
            createDatabase(tenant.dbName);
            console.log(`  ✅ Created database: ${tenant.dbName}`);
        } catch (e) {
            if (e.stderr && e.stderr.includes('already exists')) {
                console.log(`  ℹ️  Database already exists: ${tenant.dbName}`);
            } else {
                console.error(`  ❌ Failed to create DB: ${e.stderr || e.message}`);
            }
        }

        // 2. Run tenant schema migration
        const dbUrl = `postgresql://postgres:123@db:5432/${tenant.dbName}?schema=public`;
        try {
            inBackend(
                `DATABASE_URL="${dbUrl}" npx prisma db push --schema prisma/schema-tenant.prisma --skip-generate 2>&1`
            );
            console.log(`  ✅ Tenant schema migrated`);
        } catch (e) {
            console.error(`  ❌ Migration failed: ${e.stderr || e.message}`);
        }

        // 3. Hash password using bcrypt inside the container
        let bcryptHash;
        try {
            bcryptHash = inBackend(
                `node -e "const b=require('bcryptjs');b.hash('${tenant.adminPassword}',10).then(h=>process.stdout.write(h))"`
            ).trim();
            console.log(`  ✅ Password hashed`);
        } catch (e) {
            console.error(`  ❌ Hashing failed: ${e.message}`);
            continue;
        }

        // 4. Create admin user in the TENANT database (using -d flag, not \c)
        try {
            inDb(tenant.dbName,
                `INSERT INTO users (id, email, password, name, role, "createdAt", "updatedAt")
         VALUES (gen_random_uuid()::text, '${tenant.adminEmail}', '${bcryptHash}',
                 '${tenant.adminName}', 'ADMIN', NOW(), NOW())
         ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password, role = 'ADMIN';`
            );
            console.log(`  ✅ Admin user created: ${tenant.adminEmail}`);
        } catch (e) {
            console.error(`  ❌ Failed to create user: ${e.stderr || e.message}`);
        }

        // 5. Update tenant databaseUrl in MASTER DB
        try {
            inDb('retail_store_master',
                `UPDATE tenants SET "databaseUrl" = '${dbUrl}' WHERE subdomain = '${tenant.subdomain}';`
            );
            console.log(`  ✅ Tenant databaseUrl updated`);
        } catch (e) {
            console.error(`  ❌ Failed to update tenant: ${e.stderr || e.message}`);
        }
    }

    // 6. Seed super admin in MASTER DB
    console.log('\n──── SUPER ADMIN ────────────────────────');
    let saHash;
    try {
        saHash = inBackend(
            `node -e "const b=require('bcryptjs');b.hash('RetailOS@2024',10).then(h=>process.stdout.write(h))"`
        ).trim();
    } catch (e) {
        console.error(`  ❌ Super admin hash failed: ${e.message}`);
    }

    if (saHash) {
        try {
            // Check actual table name for SuperAdmin in master DB
            inDb('retail_store_master',
                `INSERT INTO super_admin_users (id, email, password, name, "createdAt", "updatedAt")
         VALUES (gen_random_uuid()::text, 'admin@retailos.cloud', '${saHash}', 'Super Administrator', NOW(), NOW())
         ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;`
            );
            console.log(`  ✅ Super admin created: admin@retailos.cloud`);
        } catch (e) {
            // Try alternate table name 'SuperAdmin' (without @@map)
            try {
                inDb('retail_store_master',
                    `INSERT INTO "SuperAdmin" (id, email, password, name, "createdAt", "updatedAt")
           VALUES (gen_random_uuid()::text, 'admin@retailos.cloud', '${saHash}', 'Super Administrator', NOW(), NOW())
           ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;`
                );
                console.log(`  ✅ Super admin created (table: SuperAdmin)`);
            } catch (e2) {
                console.error(`  ❌ Super admin failed: ${e2.stderr || e2.message}`);
                // Show actual tables for debugging
                try {
                    const tables = inDb('retail_store_master', `\\dt`);
                    console.log('  Tables in retail_store_master:', tables);
                } catch { }
            }
        }
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
