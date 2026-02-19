#!/usr/bin/env node
/**
 * Seed script: Create highpoint and greensboro tenants via the backend API.
 * Run after the backend is up: node scripts/seed-indumart-tenants.js
 */
const http = require('http');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3011';

// Payload matches backend CreateTenantDto exactly: name, subdomain, adminEmail, adminPassword
const TENANTS = [
    {
        name: 'InduMart Highpoint',
        subdomain: 'highpoint',
        adminEmail: 'admin@highpoint.indumart.us',
        adminPassword: 'Highpoint@123',
    },
    {
        name: 'InduMart Greensboro',
        subdomain: 'greensboro',
        adminEmail: 'admin@greensboro.indumart.us',
        adminPassword: 'Greensboro@123',
    },
];

async function post(path, body) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(body);
        const url = new URL(BACKEND_URL + path);
        const options = {
            hostname: url.hostname,
            port: url.port || 80,
            path: url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data),
            },
        };
        const req = http.request(options, (res) => {
            let raw = '';
            res.on('data', (chunk) => (raw += chunk));
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
                catch { resolve({ status: res.statusCode, body: raw }); }
            });
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function main() {
    console.log(`\n🌱 Seeding InduMart tenants on ${BACKEND_URL}...\n`);

    for (const tenant of TENANTS) {
        console.log(`→ Creating tenant: ${tenant.name} (${tenant.subdomain}.indumart.us)`);

        const res = await post('/api/tenants', {
            name: tenant.name,
            subdomain: tenant.subdomain,
            adminEmail: tenant.adminEmail,
            adminPassword: tenant.adminPassword,
        });

        if (res.status === 201 || res.status === 200) {
            console.log(`  ✅ Created: ${tenant.subdomain} (ID: ${res.body.id || res.body.tenantId || 'unknown'})`);
            console.log(`     Admin email:    ${tenant.adminEmail}`);
            console.log(`     Admin password: ${tenant.adminPassword}`);
        } else if (res.status === 409) {
            console.log(`  ⚠️  Already exists: ${tenant.subdomain} — skipping`);
        } else {
            console.error(`  ❌ Failed: HTTP ${res.status}`, res.body);
        }

        console.log();
    }

    console.log('✅ Seeding complete!\n');
    console.log('Store URLs:');
    console.log('  • https://highpoint.indumart.us');
    console.log('  • https://greensboro.indumart.us');
    console.log('  • Admin: https://highpoint.indumart.us/admin');
    console.log('  • Admin: https://greensboro.indumart.us/admin\n');
}

main().catch((err) => {
    console.error('Seed failed:', err.message);
    process.exit(1);
});
