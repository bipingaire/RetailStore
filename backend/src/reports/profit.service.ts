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
}
