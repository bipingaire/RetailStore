#!/usr/bin/env node
/**
 * scripts/clean-inventory.js
 * 
 * RUN: node scripts/clean-inventory.js
 * 
 * Safely clears ONLY inventory-related data from all tenant databases.
 * Retains Users, Customers, Vendors, and general Store settings.
 * 
 * Tables cleared via CASCADE:
 * - products (and automatically product_batches, stock_movements, invoice_items, sale_items)
 * - vendor_invoices
 * - sales
 */

const { execSync } = require('child_process');

const TENANTS = [
    'retail_store_highpoint',
    'retail_store_greensboro'
];

function inDb(database, sql) {
    return execSync(
        `docker exec retail_store_db psql -U postgres -d ${database} -c ${JSON.stringify(sql)}`,
        { encoding: 'utf8' }
    );
}

async function main() {
    console.log('\n🧹 Cleaning Inventory Data from Tenant Databases...\n');

    for (const dbName of TENANTS) {
        console.log(`──── Cleaning DB: ${dbName} ────────────────────────`);

        try {
            // Using CASCADE automatically deletes dependent records in join tables 
            // (like vendor_invoice_items, sale_items, product_batches) without having to specify them all.
            const query = `TRUNCATE TABLE products, vendor_invoices, sales CASCADE;`;

            inDb(dbName, query);

            console.log(`  ✅ Successfully wiped inventory from ${dbName}`);
            console.log(`     (Users, Auth, Customers, and Vendors were kept intact)`);
        } catch (e) {
            console.error(`  ❌ Failed to clean ${dbName}: ${e.stderr || e.message}`);
        }
        console.log('');
    }

    console.log('✅ Inventory cleanup complete!\n');
}

main().catch((err) => {
    console.error('Script failed:', err.message);
    process.exit(1);
});
