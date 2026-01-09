import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const TABLES_TO_CHECK = [
    'superadmin-users',
    'retail-store-inventory-item',
    'customer-order-header',
    'marketing-campaign-master',
    'invoices',
    'vendors',
    'campaign-product-segment-group' // Added for CORS/Network error check
];

async function checkSchema() {
    console.log("=== CHECKING SCHEMA FOR FAILING TABLES ===\n");

    for (const table of TABLES_TO_CHECK) {
        console.log(`Checking table: '${table}'...`);

        // Check if table exists (by selecting 0 rows)
        const { error: existError } = await supabase.from(table).select('*').limit(0);

        if (existError) {
            console.log(`  ❌ Error accessing table: ${existError.message} (Code: ${existError.code})`);
            if (existError.code === '42P01') console.log("     -> Table likely DOES NOT EXIST.");
            continue;
        }

        console.log(`  ✅ Table exists.`);

        // Try to guess/inspect columns by selecting a dummy row or just relying on error messages if we try strict checks?
        // Unfortunately, client SDK doesn't give a "list columns" method easily without admin rights or creating a function.
        // However, we can try to Select a generic set of likely columns to see which fail, or ...
        // Better strategy: The error logs gave us the failing queries. Let's try to run a "correct" query and an "incorrect" one to confirm.

        // We will verify common varying column names
        const snakeCaseCols = ['is_active', 'status', 'created_at', 'tenant_id', 'customer_phone', 'reorder_point_quantity', 'current_stock_quantity'];
        const kebabCaseCols = ['is-active', 'status-code', 'created-at', 'tenant-id', 'customer-phone', 'reorder-point-quantity', 'current-stock-quantity'];

        const possibleCols = [...snakeCaseCols, ...kebabCaseCols];

        const foundCols: string[] = [];
        const missingCols: string[] = [];

        // This is slow but effective: check each column individually
        for (const col of possibleCols) {
            const { error } = await supabase.from(table).select(col).limit(0);
            if (!error) foundCols.push(col);
            else missingCols.push(col);
        }

        if (foundCols.length > 0) console.log(`  -> Found columns: ${foundCols.join(', ')}`);
        else console.log(`  -> Could not verify specific columns (might have none of the guessed ones).`);

        console.log("");
    }
}

checkSchema();
