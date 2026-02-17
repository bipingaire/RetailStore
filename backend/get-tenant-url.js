
const { PrismaClient } = require('./src/generated/master-client');
const prisma = new PrismaClient();

async function getTenantDbUrl() {
    try {
        const tenant = await prisma.tenant.findUnique({
            where: { subdomain: 'anuj' }
        });
        console.log('Tenant DB URL:', tenant ? tenant.databaseUrl : 'Tenant not found');
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

getTenantDbUrl();
