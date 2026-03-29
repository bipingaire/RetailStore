"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const master_client_1 = require("../generated/master-client");
const tenant_client_1 = require("../generated/tenant-client");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, '../../.env') });
const logFile = path.join(__dirname, '../../verify_results.log');
function log(msg) {
    console.log(msg);
}
const master = new master_client_1.PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});
async function main() {
    log('--- Connecting to Master DB ---');
    try {
        const tenants = await master.tenant.findMany();
        log(`Found ${tenants.length} tenants.`);
        for (const t of tenants) {
            log(`\nTenant: ${t.storeName} (${t.subdomain})`);
            log(`DB URL: ${t.databaseUrl}`);
            if (t.databaseUrl) {
                const tenantClient = new tenant_client_1.PrismaClient({
                    datasources: { db: { url: t.databaseUrl } }
                });
                try {
                    const products = await tenantClient.product.findMany({ include: { Batches: true } });
                    log(`  > Products: ${products.length}`);
                    if (products.length === 0) {
                        log('    (No products found)');
                    }
                    for (const p of products) {
                        if (p.Batches && p.Batches.length > 0) {
                            log(`    - Product: ${p.name} (Qty: ${p.stock})`);
                            p.Batches.forEach(b => {
                                log(`      * Batch: ${b.quantity} exp: ${b.expiryDate}`);
                            });
                        }
                        else {
                            log(`    - Product: ${p.name} (Qty: ${p.stock}) [NO BATCHES]`);
                        }
                    }
                }
                catch (e) {
                    log(`  > Failed to connect/query tenant DB: ${e.message}`);
                }
                finally {
                    await tenantClient.$disconnect();
                }
            }
        }
    }
    catch (e) {
        log(`Master DB Error: ${e.message}`);
    }
    finally {
        await master.$disconnect();
    }
}
main();
//# sourceMappingURL=verify_batches.js.map