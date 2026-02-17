
const { PrismaClient } = require('./src/generated/client');
const { PrismaClient: MasterClient } = require('./src/generated/master-client');
const bcrypt = require('bcryptjs');

async function debugAuth() {
    const masterPrisma = new MasterClient();
    console.log('--- Debugging Auth ---');

    try {
        const tenant = await masterPrisma.tenant.findUnique({ where: { subdomain: 'anuj' } });
        if (!tenant) {
            console.error('❌ Tenant "anuj" not found');
            return;
        }

        const tenantPrisma = new PrismaClient({
            datasources: { db: { url: tenant.databaseUrl } }
        });

        // Use findFirst to avoid potential unique constraint issues if schema is weird
        // Select only fields we know exist to avoid 'tenant-id' error
        const user = await tenantPrisma.user.findFirst({
            where: { email: 'admin@retailos.com' },
            select: {
                id: true,
                email: true,
                password: true,
                role: true
            }
        });

        if (!user) {
            console.error(`❌ User "admin@retailos.com" not found`);
        } else {
            console.log(`✅ Found User`);
            // Check password
            const isValid = await bcrypt.compare('password123', user.password);
            console.log(isValid ? '✅ Password OK' : '❌ Password INVALID');
        }

        await tenantPrisma.$disconnect();

    } catch (e) {
        console.error('❌ Error:', e);
    } finally {
        await masterPrisma.$disconnect();
    }
}

debugAuth();
