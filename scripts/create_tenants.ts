import { apiClient } from '../lib/api-client';

async function createTenants() {
    const tenants = [
        {
            subdomain: 'greensboro',
            store_name: 'InduMart Greensboro',
            admin_email: 'admin@greensboro.indumart.us',
            admin_password: 'Password123!', // Change this after login!
            address: 'Greensboro, NC',
            city: 'Greensboro',
            state: 'NC',
            zip_code: '27401',
            phone_number: '336-555-0101'
        },
        {
            subdomain: 'highpoint',
            store_name: 'InduMart High Point',
            admin_email: 'admin@highpoint.indumart.us',
            admin_password: 'Password123!', // Change this after login!
            address: 'High Point, NC',
            city: 'High Point',
            state: 'NC',
            zip_code: '27260',
            phone_number: '336-555-0102'
        }
    ];

    console.log('🚀 Creating tenants...');

    for (const tenant of tenants) {
        try {
            console.log(`Creating ${tenant.store_name} (${tenant.subdomain})...`);

            // Note: apiClient.createTenant calls /api/tenants/register
            const result = await apiClient.createTenant({
                subdomain: tenant.subdomain,
                store_name: tenant.store_name,
                admin_email: tenant.admin_email,
                admin_password: tenant.admin_password
            });

            console.log(`✅ Success! Created ${tenant.subdomain}`);
            console.log(`   Admin Login: ${tenant.admin_email}`);
            console.log(`   Password: ${tenant.admin_password}`);

        } catch (error: any) {
            if (error.message && error.message.includes('already exists')) {
                console.log(`⚠️ Tenant ${tenant.subdomain} already exists.`);
            } else {
                console.error(`❌ Failed to create ${tenant.subdomain}:`, error.message || error);
            }
        }
    }
}

// Check if running directly
if (require.main === module) {
    createTenants()
        .then(() => process.exit(0))
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}
