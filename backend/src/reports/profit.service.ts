import { Injectable } from '@nestjs/common';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';

@Injectable()
export class ProfitService {
    constructor(private readonly prisma: TenantPrismaService) { }

    async calculateProfit(startDate: Date, endDate: Date, period: 'daily' | 'weekly' | 'monthly') {
        // Get total revenue from sales
        const sales = await this.prisma.sale.findMany({
            where: {
                createdAt: { gte: startDate, lte: endDate },
            }
        });

        const revenue = sales.reduce((sum, sale) => sum + Number(sale.total), 0);

        // Get COGS from committed invoices
        const invoices = await this.prisma.vendorInvoice.findMany({
            where: {
                status: 'committed',
                invoiceDate: { gte: startDate, lte: endDate },
            },
        });

        const cogs = invoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);

        // Get operating expenses
        const expenses = await this.prisma.expense.findMany({
            where: {
                expenseDate: { gte: startDate, lte: endDate },
            },
        });

        const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

        // Calculate metrics
        const grossProfit = revenue - cogs;
        const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
        const netProfit = grossProfit - totalExpenses;

        const report = await this.prisma.profitReport.create({
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

    async getProfitReports(period?: string) {
        const where = period ? { period } : {};

        return this.prisma.profitReport.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 30,
        });
    }

    async getProfitTrends(days: number = 30) {
        const reports = await this.prisma.profitReport.findMany({
            where: {
                startDate: { gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) },
            },
            orderBy: { startDate: 'asc' },
        });

        return reports;
    }

    async getCategoryBreakdown(startDate: Date, endDate: Date) {
        // Get sales grouped by product category
        const saleItems = await this.prisma.saleItem.findMany({
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

    async addExpense(category: string, amount: number, description?: string, expenseDate?: Date) {
        return this.prisma.expense.create({
            data: {
                category,
                amount,
                description,
                expenseDate: expenseDate || new Date(),
            },
        });
    }

    async getExpenses(startDate?: Date, endDate?: Date) {
        const where = startDate && endDate
            ? { expenseDate: { gte: startDate, lte: endDate } }
            : {};

        return this.prisma.expense.findMany({
            where,
            orderBy: { expenseDate: 'desc' },
        });
    }
}
