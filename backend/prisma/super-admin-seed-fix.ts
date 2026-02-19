import { PrismaClient } from '../src/generated/master-client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding Super Admin into MASTER database...');

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
        },
    });

    console.log('✅ Super Admin Seeded Successfully!');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${plainPassword}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
