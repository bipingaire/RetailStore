const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function main() {
    console.log('🌱 Seeding Super Admin into MASTER database (JS Fix)...');

    // Try to find the generated client
    // In prod, it should be in ../dist/generated/master-client
    // In dev, it might be in ../src/generated/master-client

    let clientPath = path.join(__dirname, '../dist/generated/master-client');
    if (!fs.existsSync(clientPath)) {
        clientPath = path.join(__dirname, '../src/generated/master-client');
    }

    console.log(`Loading Prisma Client from: ${clientPath}`);

    if (!fs.existsSync(clientPath)) {
        console.error('❌ Could not find generated master-client. Did you build the project?');
        process.exit(1);
    }

    const { PrismaClient } = require(clientPath);
    const prisma = new PrismaClient();

    try {
        const email = 'admin@retailos.cloud';
        const plainPassword = 'RetailOS@2024';
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        // Use upsert to handle existing or new
        const admin = await prisma.superAdmin.upsert({
            where: { email },
            update: {
                password: hashedPassword,
            },
            create: {
                email,
                password: hashedPassword,
                // name: 'Super Admin' // schema-master doesn't have name? Let's check.
            },
        });

        console.log('✅ Super Admin Seeded Successfully!');
        console.log(`   ID: ${admin.id}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Password: ${plainPassword}`);
    } catch (error) {
        console.error('❌ Error seeding super admin:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
