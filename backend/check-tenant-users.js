
const { PrismaClient } = require('./src/generated/client');
const { PrismaClient: MasterClient } = require('./src/generated/master-client');
const fs = require('fs');

async function checkTenantUsers() {
    const masterPrisma = new MasterClient();
    try {
        const tenant = await masterPrisma.tenant.findUnique({ where: { subdomain: 'anuj' } });
        if (!tenant) return;

        console.log('Using tenant DB:', tenant.databaseUrl);

        const tenantPrisma = new PrismaClient({
            datasources: { db: { url: tenant.databaseUrl } }
        });

        const users = await tenantPrisma.user.findMany({
            select: {
                id: true,
                email: true,
                password: true,
                role: true
            }
        });
        console.log(`Found ${users.length} users.`);
        fs.writeFileSync('tenant_users.txt', JSON.stringify(users, null, 2));

        await tenantPrisma.$disconnect();

    } catch (e) {
        console.error(e);
    } finally {
        await masterPrisma.$disconnect();
    }
}

checkTenantUsers();
