import { PrismaClient } from '../src/generated/master-client';
import { execSync } from 'child_process';

const masterPrisma = new PrismaClient();

async function main() {
    console.log('Fetching all tenants from Master Database...');
    const tenants = await masterPrisma.tenant.findMany();
    
    if (tenants.length === 0) {
        console.log('No tenants found.');
        return;
    }

    console.log(`Found ${tenants.length} tenants. Starting schema push...`);

    for (const tenant of tenants) {
        console.log(`\n===========================================`);
        console.log(`Migrating Tenant: ${tenant.storeName} (${tenant.subdomain})`);
        console.log(`Database URL: ${tenant.databaseUrl}`);
        
        try {
            // Run Prisma DB Push with the specific tenant's database URL
            execSync('npx prisma db push --schema=prisma/schema-tenant.prisma --accept-data-loss', {
                env: {
                    ...process.env,
                    TENANT_DATABASE_URL: tenant.databaseUrl,
                },
                stdio: 'inherit',
            });
            console.log(`✅ Successfully pushed schema for ${tenant.subdomain}`);
        } catch (error) {
            console.error(`❌ Failed to push schema for ${tenant.subdomain}:`, error);
        }
    }

    console.log(`\n===========================================`);
    console.log('All tenant migrations completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await masterPrisma.$disconnect();
    });
