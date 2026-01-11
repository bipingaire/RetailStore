const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Try to use Service Role Key if available for admin access, otherwise fall back to Anon (might fail)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Check your .env.local keys.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedTenant() {
    console.log('Checking for tenants...');
    const { data: existing, error: fetchError } = await supabase
        .from('retail-store-tenant')
        .select('tenant-id')
        .limit(1);

    if (fetchError) {
        console.error('Error fetching:', fetchError.message);
        return;
    }

    if (existing && existing.length > 0) {
        console.log('✅ Valid tenant found:', existing[0]['tenant-id']);
        return;
    }

    console.log('No tenants found. Attempting to seed default tenant...');

    const defaultTenant = {
        'tenant-id': '11111111-1111-1111-1111-111111111111',
        'store-name': 'InduMart Demo Store',
        'store-address': '123 Demo St',
        'store-city': 'Tech City',
        'subscription-tier': 'pro',
        'subdomain': 'indumart'
    };

    const { data, error } = await supabase
        .from('retail-store-tenant')
        .insert(defaultTenant)
        .select();

    if (error) {
        console.error('❌ Failed to seed tenant (likely permission/RLS error):', error.message);
        console.log('👉 ACTION REQUIRED: Please run supabase/migrations/20260111_seed_fixed_tenant.sql in your Supabase Dashboard.');
    } else {
        console.log('✅ Successfully seeded tenant:', data[0]['tenant-id']);

        // Also seed subdomain mapping
        await supabase.from('subdomain-tenant-mapping').insert({
            'subdomain': 'indumart',
            'tenant-id': '11111111-1111-1111-1111-111111111111'
        });
        console.log('✅ Seeded subdomain mapping.');
    }
}

seedTenant();
