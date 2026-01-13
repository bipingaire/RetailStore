const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Using Anon key

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not found in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getTenant() {
    const { data, error } = await supabase
        .from('retail-store-tenant')
        .select('tenant-id, store-name')
        .limit(1);

    if (error) {
        console.error('Error fetching tenant:', error);
        return;
    }

    if (data && data.length > 0) {
        console.log('VALID_TENANT_ID:', data[0]['tenant-id']);
        console.log('Store Name:', data[0]['store-name']);
    } else {
        console.log('No tenants found.');
    }
}

getTenant();
