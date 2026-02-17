
const { PrismaClient } = require('./src/generated/client');
const { PrismaClient: MasterClient } = require('./src/generated/master-client');
const bcrypt = require('bcryptjs');

async function seedTenantUserRaw() {
    const masterPrisma = new MasterClient();
    try {
        console.log('Seeding Tenant User (RAW SQL)...');
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
        const name = 'Anuj Admin';
        const role = 'ADMIN';

        // Check if exists first using safe select
        const existing = await tenantPrisma.user.findFirst({
            where: { email },
            select: { id: true }
        });

        if (existing) {
            console.log('User already exists, updating password...');
            // Update password
            await tenantPrisma.$executeRaw`
                UPDATE users SET password = ${hashedPassword} WHERE email = ${email}
            `;
            console.log('✅ Password updated');
        } else {
            console.log('Creating new user...');
            // Insert
            // Note: 'id' is uuid, need to generate it or let DB handle it if default
            // UUID generation in raw SQL might be tricky if pgcrypto not enabled, better to generate in JS
            const { v4: uuidv4 } = require('uuid');
            const id = uuidv4();

            await tenantPrisma.$executeRaw`
                INSERT INTO users (id, email, password, name, role, "isActive", "createdAt", "updatedAt")
                VALUES (${id}, ${email}, ${hashedPassword}, ${name}, ${role}, true, NOW(), NOW())
            `;
            console.log('✅ User created');
        }

        await tenantPrisma.$disconnect();

    } catch (e) {
        console.error('❌ Seed Error:', e);
    } finally {
        await masterPrisma.$disconnect();
    }
}

seedTenantUserRaw();
