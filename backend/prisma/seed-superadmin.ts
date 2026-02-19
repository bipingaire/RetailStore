import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedSuperAdmin() {
    const email = 'admin@retailos.cloud';
    const plainPassword = 'RetailOS@2024';

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const existing = await prisma.superAdmin.findUnique({ where: { email } });

    if (existing) {
        await prisma.superAdmin.update({
            where: { email },
            data: { password: hashedPassword }
        });
        console.log('✅ Super admin password updated');
    } else {
        await prisma.superAdmin.create({
            data: {
                email,
                password: hashedPassword,
                name: 'Super Administrator'
            }
        });
        console.log('✅ Super admin created');
    }

    console.log(`\n🔑 Super Admin Credentials:`);
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${plainPassword}`);
    console.log(`   Login at: https://retailos.cloud/super-admin\n`);
}

seedSuperAdmin()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
