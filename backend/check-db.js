
const { PrismaClient } = require('./src/generated/master-client');
const fs = require('fs');
const prisma = new PrismaClient();

async function checkData() {
    try {
        const tenants = await prisma.tenant.findMany({ select: { id: true, subdomain: true, name: true } });
        const users = await prisma.user.findMany({ select: { email: true, role: true } });

        const output = {
            tenants,
            users
        };

        fs.writeFileSync('db_output.txt', JSON.stringify(output, null, 2));
        console.log('Data written to db_output.txt');
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

checkData();
