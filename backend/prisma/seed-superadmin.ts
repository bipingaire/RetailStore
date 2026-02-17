import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedSuperAdmin() {
    const email = 'superadmin@retailstore.com';
    const plainPassword = 'password123';

    // Hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Check if super admin already exists
    const existing = await prisma.superAdmin.findUnique({
        where: { email }
    });

    if (existing) {
        console.log('Super admin already exists, updating password...');
        await prisma.superAdmin.update({
            where: { email },
            data: { password: hashedPassword }
        });
        console.log('✅ Super admin password updated');
    } else {
        console.log('Creating super admin...');
        await prisma.superAdmin.create({
            data: {
                email,
                password: hashedPassword,
                name: 'Super Administrator'
            }
        });
        console.log('✅ Super admin created');
    }

    console.log(`\nCredentials:`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${plainPassword}`);
}

seedSuperAdmin()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
