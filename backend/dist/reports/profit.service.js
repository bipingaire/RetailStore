"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfitService = void 0;
const common_1 = require("@nestjs/common");
const tenant_prisma_service_1 = require("../prisma/tenant-prisma.service");
let ProfitService = class ProfitService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async calculateProfit(startDate, endDate, period) {
        const sales = await this.prisma.sale.findMany({
            where: {
                createdAt: { gte: startDate, lte: endDate },
            }
        });
        const revenue = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
        const invoices = await this.prisma.vendorInvoice.findMany({
            where: {
                status: 'committed',
                invoiceDate: { gte: startDate, lte: endDate },
            },
        });
        const cogs = invoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
        const expenses = await this.prisma.expense.findMany({
            where: {
                expenseDate: { gte: startDate, lte: endDate },
            },
        });
        const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
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
    async getProfitReports(period) {
        const where = period ? { period } : {};
        return this.prisma.profitReport.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 30,
        });
    }
    async getProfitTrends(days = 30) {
        const reports = await this.prisma.profitReport.findMany({
            where: {
                startDate: { gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) },
            },
            orderBy: { startDate: 'asc' },
        });
        return reports;
    }
    async getCategoryBreakdown(startDate, endDate) {
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
        const categoryMap = new Map();
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
    async addExpense(category, amount, description, expenseDate) {
        return this.prisma.expense.create({
            data: {
                category,
                amount,
                description,
                expenseDate: expenseDate || new Date(),
            },
        });
    }
    async getExpenses(startDate, endDate) {
        const where = startDate && endDate
            ? { expenseDate: { gte: startDate, lte: endDate } }
            : {};
        return this.prisma.expense.findMany({
            where,
            orderBy: { expenseDate: 'desc' },
        });
    }
};
exports.ProfitService = ProfitService;
exports.ProfitService = ProfitService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_prisma_service_1.TenantPrismaService])
], ProfitService);
//# sourceMappingURL=profit.service.js.map