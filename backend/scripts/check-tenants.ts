import { PrismaClient } from '../src/generated/master-client';

const prisma = new PrismaClient();

async function main() {
    const tenants = await prisma.tenant.findMany();
    console.log('Existing Tenants:', tenants);

    const anuj = tenants.find(t => t.subdomain === 'anuj');
    if (!anuj) {
        console.log('Creating anuj tenant...');
        // Use default DB URL for dev if process.env is missing
        // Assuming docker-compose default: postgres://postgres:postgres@localhost:5432/retail_store_master
        // And tenant: retail_store_anuj
        const dbUrl = process.env.DATABASE_URL
            ? process.env.DATABASE_URL.replace('retail_store_master', 'retail_store_anuj')
            : 'postgresql://postgres:postgres@localhost:5432/retail_store_anuj?schema=public';

        await prisma.tenant.create({
            data: {
                storeName: 'Anuj Store',
                subdomain: 'anuj',
                adminEmail: 'admin@anuj.com',
                databaseUrl: dbUrl,
            }
        });
        console.log('Anuj tenant created.');
    } else {
        console.log('Anuj tenant already exists.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
