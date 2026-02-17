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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const tenant_service_1 = require("../tenant/tenant.service");
const tenant_prisma_service_1 = require("../prisma/tenant-prisma.service");
let DashboardService = class DashboardService {
    constructor(tenantService, tenantPrisma) {
        this.tenantService = tenantService;
        this.tenantPrisma = tenantPrisma;
    }
    async getOverview(subdomain, startDate, endDate) {
        try {
            const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
            const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
            const salesAgg = await client.sale.aggregate({
                _sum: { total: true },
                _count: true,
                where: {
                    status: 'COMPLETED',
                    ...(startDate || endDate ? {
                        createdAt: {
                            ...(startDate ? { gte: startDate } : {}),
                            ...(endDate ? { lte: endDate } : {}),
                        }
                    } : {})
                }
            });
            const pendingOrders = await client.sale.count({
                where: { status: { in: ['PENDING', 'PROCESSING'] } }
            });
            const lowStockCount = await client.product.count({
                where: {
                    stock: { lte: client.product.fields.reorderLevel },
                    isActive: true
                }
            });
            const activeCampaigns = await client.campaign.count({
                where: { status: 'ACTIVE' }
            });
            const recentOrders = await client.sale.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    customer: true,
                    items: {
                        include: { product: true }
                    }
                }
            });
            const weeklyData = [];
            for (let i = 6; i >= 0; i--) {
                const day = new Date();
                day.setDate(day.getDate() - i);
                day.setHours(0, 0, 0, 0);
                const nextDay = new Date(day);
                nextDay.setDate(nextDay.getDate() + 1);
                const daySales = await client.sale.aggregate({
                    _sum: { total: true },
                    where: {
                        status: 'COMPLETED',
                        createdAt: {
                            gte: day,
                            lt: nextDay
                        }
                    }
                });
                weeklyData.push(Number(daySales._sum.total || 0));
            }
            return {
                revenue: Number(salesAgg._sum.total || 0),
                orders: pendingOrders,
                lowStock: lowStockCount,
                activeCampaigns: activeCampaigns,
                recentOrders: recentOrders.map(order => ({
                    'order-id': order.id,
                    'saleNumber': order.saleNumber,
                    'customer-phone': order.customer?.phone || 'Guest',
                    'customer-name': order.customer?.name || 'Guest',
                    'order-date-time': order.createdAt,
                    'status': order.status.toLowerCase(),
                    'final-amount': Number(order.total)
                })),
                weeklyChartData: weeklyData
            };
        }
        catch (error) {
            console.error('[DashboardService] Error fetching overview:', error);
            throw error;
        }
    }
    async getSalesChart(subdomain, period) {
        return [];
    }
    async getProductAnalytics(subdomain) {
        return {};
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_service_1.TenantService,
        tenant_prisma_service_1.TenantPrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map