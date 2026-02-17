const { PrismaClient } = require('@prisma/client');

async function checkUsers() {
    const prismaUrl = 'postgresql://postgres:123@localhost:5432/retail_tenant_v2?schema=public';
    const prisma = new PrismaClient({
        datasources: { db: { url: prismaUrl } }
    });

    try {
        console.log('Checking users in tenant database...\n');
        const users = await prisma.user.findMany();

        console.log(`Found ${users.length} user(s):\n`);
        users.forEach(user => {
            console.log(`- Email: ${user.email}`);
            console.log(`  Role: ${user.role}`);
            console.log(`  Name: ${user.name}`);
            console.log(`  Active: ${user.isActive}`);
            console.log(`  Password starts with: ${user.password.substring(0, 10)}`);
            console.log(`  Password length: ${user.password.length}`);
            console.log('');
        });
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();
