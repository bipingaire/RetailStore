
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.TENANT_DATABASE_URL,
        },
    },
});

async function main() {
    console.log('Checking Database Stats...');

    const totalSales = await prisma.sale.count();
    const allTimeRevenue = await prisma.sale.aggregate({ _sum: { total: true } });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySales = await prisma.sale.count({ where: { createdAt: { gte: today } } });
    const todayRevenue = await prisma.sale.aggregate({ _sum: { total: true }, where: { createdAt: { gte: today } } });

    const totalPOs = await prisma.purchaseOrder.count();
    const pendingPOs = await prisma.purchaseOrder.count({ where: { status: { in: ['sent', 'confirmed'] } } });

    console.log('--- Sales ---');
    console.log(`Total Sales Count: ${totalSales}`);
    console.log(`All Time Revenue: ${allTimeRevenue._sum.total || 0}`);
    console.log(`Today Sales Count: ${todaySales}`);
    console.log(`Today Revenue: ${todayRevenue._sum.total || 0}`);

    console.log('--- Purchase Orders ---');
    console.log(`Total POs: ${totalPOs}`);
    console.log(`Pending POs (sent/confirmed): ${pendingPOs}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
