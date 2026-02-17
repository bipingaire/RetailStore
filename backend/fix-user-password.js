const { PrismaClient } = require('./src/generated/tenant-client');

async function fixPassword() {
    const bcrypt = require('bcryptjs');

    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: 'postgresql://postgres:123@localhost:5432/retail_tenant_v2?schema=public'
            }
        }
    });

    try {
        // Check current user
        const user = await prisma.user.findUnique({
            where: { email: 'admin@anuj.com' }
        });

        if (!user) {
            console.log('❌ User not found!');
            return;
        }

        console.log('Current user:');
        console.log('- Email:', user.email);
        console.log('- Password starts with:', user.password.substring(0, 10));
        console.log('- Password length:', user.password.length);
        console.log('- Starts with $2b$:', user.password.startsWith('$2b$'));
        console.log('');

        // Generate new hash
        const newHash = await bcrypt.hash('anuj123', 10);
        console.log('New hash generated:', newHash);
        console.log('New hash length:', newHash.length);
        console.log('');

        // Update password
        await prisma.user.update({
            where: { email: 'admin@anuj.com' },
            data: { password: newHash }
        });

        console.log('✅ Password updated successfully!');
        console.log('');

        // Verify
        const updatedUser = await prisma.user.findUnique({
            where: { email: 'admin@anuj.com' }
        });

        console.log('Verification:');
        console.log('- New password starts with:', updatedUser.password.substring(0, 10));
        console.log('- New password length:', updatedUser.password.length);
        console.log('- Test bcrypt compare:', await bcrypt.compare('anuj123', updatedUser.password));

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

fixPassword();
