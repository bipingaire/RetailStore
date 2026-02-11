import { PrismaClient as MasterClient } from '../generated/master-client';
import { PrismaClient as TenantClient } from '../generated/tenant-client';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load env from .env file (2 levels up from src/scripts -> backend root)
dotenv.config({ path: path.join(__dirname, '../../.env') });

const logFile = path.join(__dirname, '../../verify_results.log');
// fs.writeFileSync(logFile, ''); // Clear file (optional)

function log(msg: string) {
    console.log(msg);
    // fs.appendFileSync(logFile, msg + '\n');
}

const master = new MasterClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

async function main() {
    log('--- Connecting to Master DB ---');
    try {
        const tenants = await master.tenant.findMany(); // Using 'tenant' model from master schema
        log(`Found ${tenants.length} tenants.`);

        for (const t of tenants) {
            log(`\nTenant: ${t.storeName} (${t.subdomain})`);
            log(`DB URL: ${t.databaseUrl}`);

            if (t.databaseUrl) {
                // Connect to this tenant DB
                const tenantClient = new TenantClient({
                    datasources: { db: { url: t.databaseUrl } }
                });

                try {
                    const products = await tenantClient.product.findMany({ include: { Batches: true } });
                    log(`  > Products: ${products.length}`);

                    if (products.length === 0) {
                        log('    (No products found)');
                    }

                    for (const p of products) {
                        // Only show products with recent batches or relevant ones
                        if (p.Batches && p.Batches.length > 0) {
                            log(`    - Product: ${p.name} (Qty: ${p.stock})`);
                            p.Batches.forEach(b => {
                                log(`      * Batch: ${b.quantity} exp: ${b.expiryDate}`);
                            });
                        } else {
                            log(`    - Product: ${p.name} (Qty: ${p.stock}) [NO BATCHES]`);
                        }
                    }
                } catch (e: any) {
                    log(`  > Failed to connect/query tenant DB: ${e.message}`);
                } finally {
                    await tenantClient.$disconnect();
                }
            }
        }
    } catch (e: any) {
        log(`Master DB Error: ${e.message}`);
    } finally {
        await master.$disconnect();
    }
}

main();
