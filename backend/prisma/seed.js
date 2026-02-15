require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'superadmin@retailstore.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Seeding superadmin...');

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: 'SUPERADMIN',
        },
        create: {
            email,
            password: hashedPassword,
            name: 'Super Admin',
            role: 'SUPERADMIN',
            isActive: true,
        },
    });

    console.log('User created/updated:', user.id);

    // Create SuperAdmin profile
    await prisma.superAdminUser.upsert({
        where: { userId: user.id },
        update: {},
        create: {
            userId: user.id,
        },
    });

    console.log('Super Admin seeded successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
