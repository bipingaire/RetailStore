
const { PrismaClient } = require('./src/generated/client');
const { PrismaClient: MasterClient } = require('./src/generated/master-client');
const bcrypt = require('bcryptjs');

async function seedTenantUser() {
    const masterPrisma = new MasterClient();
    try {
        console.log('Seeding Tenant User...');
        const tenant = await masterPrisma.tenant.findUnique({ where: { subdomain: 'anuj' } });
        if (!tenant) {
            console.error('Tenant anuj not found');
            return;
        }

        console.log('Target DB:', tenant.databaseUrl);

        const tenantPrisma = new PrismaClient({
            datasources: { db: { url: tenant.databaseUrl } }
        });

        const email = 'admin@retailos.com';
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await tenantPrisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                role: 'ADMIN',
                isActive: true
            },
            create: {
                email,
                password: hashedPassword,
                name: 'Anuj Admin',
                role: 'ADMIN',
                isActive: true
            }
        });

        console.log('✅ User seeded:', user.id, user.email);
        console.log('✅ Password set to:', password);

        await tenantPrisma.$disconnect();

    } catch (e) {
        console.error('❌ Seed Error:', e);
    } finally {
        await masterPrisma.$disconnect();
    }
}

seedTenantUser();
