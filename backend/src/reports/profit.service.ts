import { Injectable } from '@nestjs/common';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { TenantService } from '../tenant/tenant.service';

@Injectable()
export class ProfitService {
    constructor(
        private readonly tenantPrisma: TenantPrismaService,
        private readonly tenantService: TenantService,
    ) { }

    async calculateProfit(subdomain: string, startDate: Date, endDate: Date, period: 'daily' | 'weekly' | 'monthly') {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        // Get total revenue from sales
        const sales = await client.sale.findMany({
            where: {
                createdAt: { gte: startDate, lte: endDate },
            }
        });

        const revenue = sales.reduce((sum, sale) => sum + Number(sale.total), 0);

        // Get COGS from committed invoices
        const invoices = await client.vendorInvoice.findMany({
            where: {
                status: 'committed',
                invoiceDate: { gte: startDate, lte: endDate },
            },
        });

        const cogs = invoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);

        // Get operating expenses
        const expenses = await client.expense.findMany({
            where: {
                expenseDate: { gte: startDate, lte: endDate },
            },
        });

        const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

        // Calculate metrics
        const grossProfit = revenue - cogs;
        const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
        const netProfit = grossProfit - totalExpenses;

        const report = await client.profitReport.create({
            data: {
                period,
                startDate,
                endDate,
                revenue,
                cogs,
                grossProfit,
                grossMargin,
                expenses: totalExpenses,
                netProfit,
            },
        });

        return report;
    }

    async getProfitReports(subdomain: string, period?: string) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        const where = period ? { period } : {};

        return client.profitReport.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 30,
        });
    }

    async getProfitTrends(subdomain: string, days: number = 30) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        const reports = await client.profitReport.findMany({
            where: {
                startDate: { gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) },
            },
            orderBy: { startDate: 'asc' },
        });

        return reports;
    }

    async getCategoryBreakdown(subdomain: string, startDate: Date, endDate: Date) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        // Get sales grouped by product category
        const saleItems = await client.saleItem.findMany({
            where: {
                sale: {
                    createdAt: { gte: startDate, lte: endDate },
                },
            },
            include: {
                product: true,
            },
        });

        const categoryMap = new Map<string, { revenue: number; count: number }>();

        for (const item of saleItems) {
            const category = item.product.category || 'Uncategorized';
            const current = categoryMap.get(category) || { revenue: 0, count: 0 };

            categoryMap.set(category, {
                revenue: current.revenue + Number(item.subtotal),
                count: current.count + item.quantity,
            });
        }

        return Array.from(categoryMap.entries()).map(([category, data]) => ({
            category,
            ...data,
        }));
    }

    async addExpense(subdomain: string, category: string, amount: number, description?: string, expenseDate?: Date) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        return client.expense.create({
            data: {
                category,
                amount,
                description,
                expenseDate: expenseDate || new Date(),
            },
        });
    }

    async getExpenses(subdomain: string, startDate?: Date, endDate?: Date) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        const where = startDate && endDate
            ? { expenseDate: { gte: startDate, lte: endDate } }
            : {};

        return client.expense.findMany({
            where,
            orderBy: { expenseDate: 'desc' },
        });
    }
    async getDashboardStats(subdomain: string) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Total Revenue (All Time)
        const allTimeSales = await client.sale.aggregate({
            _sum: { total: true }
        });

        // 2. Pending Orders (PO + Sales)
        const pendingPO = await client.purchaseOrder.count({
            where: { status: { in: ['sent', 'confirmed'] } }
        });

        const pendingSales = await client.sale.count({
            where: { status: 'PENDING' }
        });

        const totalPending = pendingPO + pendingSales;

        // 3. Low Stock Items
        const lowStock = await client.product.count({
            where: { stock: { lte: 10 } } // employing fixed reorder level or use db raw query for dynamic
        });

        // Better: use findMany and filter in memory if volume is low, or raw query. 
        // Prisma doesn't support field comparison in where clause easily.
        // Let's just use a fixed threshold of 10 for now as 'Low Stock' generic indicator,
        // or fetch all active products and count.
        // Actually, we can just recount 'stock' <= 'reorderLevel' using raw query if needed, 
        // but for simplicity let's stick to fixed 10 or fetch all.
        // Let's fetch all products to check dynamic reorderLevel.
        const allProducts = await client.product.findMany({ select: { stock: true, reorderLevel: true } });
        const lowStockCount = allProducts.filter(p => p.stock <= p.reorderLevel).length;


        // 4. Active Campaigns
        const activeCampaigns = await client.campaign.count({
            where: { status: 'ACTIVE' }
        });

        // 5. Recent Orders (Sales)
        const recentOrders = await client.sale.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { customer: true }
        });

        return {
            revenue: Number(allTimeSales._sum.total || 0),
            pendingOrders: totalPending,
            lowStock: lowStockCount,
            activeCampaigns,
            recentOrders: recentOrders.map(o => ({
                id: o.id,
                orderNumber: o.saleNumber,
                customer: o.customer?.name || 'Guest',
                amount: Number(o.total),
                status: o.status,
                date: o.createdAt
            }))
        };
    }
}
