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
const tenant_service_1 = require("../tenant/tenant.service");
let ProfitService = class ProfitService {
    constructor(tenantPrisma, tenantService) {
        this.tenantPrisma = tenantPrisma;
        this.tenantService = tenantService;
    }
    async calculateProfit(subdomain, startDate, endDate, period) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const sales = await client.sale.findMany({
            where: {
                createdAt: { gte: startDate, lte: endDate },
            }
        });
        const revenue = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
        const invoices = await client.vendorInvoice.findMany({
            where: {
                status: 'committed',
                invoiceDate: { gte: startDate, lte: endDate },
            },
        });
        const cogs = invoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
        const expenses = await client.expense.findMany({
            where: {
                expenseDate: { gte: startDate, lte: endDate },
            },
        });
        const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
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
    async getProfitReports(subdomain, period) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const where = period ? { period } : {};
        return client.profitReport.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 30,
        });
    }
    async getProfitTrends(subdomain, days = 30) {
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
    async getCategoryBreakdown(subdomain, startDate, endDate) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
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
    async addExpense(subdomain, category, amount, description, expenseDate) {
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
    async getExpenses(subdomain, startDate, endDate) {
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
    async getDashboardStats(subdomain) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const allTimeSales = await client.sale.aggregate({
            _sum: { total: true }
        });
        const pendingPO = await client.purchaseOrder.count({
            where: { status: { in: ['sent', 'confirmed'] } }
        });
        const pendingSales = await client.sale.count({
            where: { status: 'PENDING' }
        });
        const totalPending = pendingPO + pendingSales;
        const lowStock = await client.product.count({
            where: { stock: { lte: 10 } }
        });
        const allProducts = await client.product.findMany({ select: { stock: true, reorderLevel: true } });
        const lowStockCount = allProducts.filter(p => p.stock <= p.reorderLevel).length;
        const activeCampaigns = await client.campaign.count({
            where: { status: 'ACTIVE' }
        });
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
};
exports.ProfitService = ProfitService;
exports.ProfitService = ProfitService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_prisma_service_1.TenantPrismaService,
        tenant_service_1.TenantService])
], ProfitService);
//# sourceMappingURL=profit.service.js.map