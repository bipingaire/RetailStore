import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wljylwtbgrillwsmrwxn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_SmLVdC5FCaSCns_XurWAkQ_5dbQudk1';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkSchema() {
    console.log("INSPECTING SCHEMA...");

    // 1. Inspect 'orders' columns (by selecting 0 rows)
    const { data: orders, error: errOrders } = await supabase
        .from('orders')
        .select('*')
        .limit(0);

    if (errOrders) {
        console.log("Table 'orders': NOT ACCESSIBLE (" + errOrders.message + ")");
    } else {
        // We can't see columns from empty data, need to fetch one or rely on error if we select specific columns.
        console.log("Table 'orders': EXISTS. trying to guess columns...");
        // Try selecting customer_phone
        const { error: errPhone } = await supabase.from('orders').select('customer_phone').limit(0);
        if (errPhone) console.log("  - customer_phone: MISSING (" + errPhone.message + ")");
        else console.log("  - customer_phone: EXISTS");

        const { error: errPhoneKebab } = await supabase.from('orders').select('customer-phone').limit(0);
        if (errPhoneKebab) console.log("  - customer-phone: MISSING or invalid");
        else console.log("  - customer-phone: EXISTS");
    }

    // 2. Inspect 'customer-order-header' columns
    console.log("Table 'customer-order-header': INSPECTING...");
    const { data: header, error: errHeader } = await supabase
        .from('customer-order-header')
        .select('*')
        .limit(0);

    if (errHeader) {
        console.log("Table 'customer-order-header': NOT ACCESSIBLE (" + errHeader.message + ")");
    } else {
        console.log("Table 'customer-order-header': EXISTS.");

        // Check specific checkout columns
        const cols = ['customer-phone', 'customer_phone', 'customer-email', 'customer_email'];
        for (const col of cols) {
            const { error } = await supabase.from('customer-order-header').select(col).limit(0);
            if (error) console.log("  - " + col + ": MISSING (" + error.message + ")");
            else console.log("  - " + col + ": EXISTS");
        }
    }
}

checkSchema();
