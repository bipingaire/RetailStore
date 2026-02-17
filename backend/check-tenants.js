
const { PrismaClient } = require('./src/generated/master-client');
const prisma = new PrismaClient();

async function checkTenants() {
    try {
        const tenants = await prisma.tenant.findMany();
        console.log('Subdomains:', tenants.map(t => t.subdomain));
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

checkTenants();
