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
exports.ZReportService = void 0;
const common_1 = require("@nestjs/common");
const tenant_prisma_service_1 = require("../prisma/tenant-prisma.service");
const tenant_service_1 = require("../tenant/tenant.service");
let ZReportService = class ZReportService {
    constructor(prisma, tenantService) {
        this.prisma = prisma;
        this.tenantService = tenantService;
    }
    async processZReport(subdomain, file, dateString) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const tenantClient = await this.prisma.getTenantClient(tenant.databaseUrl);
        const reportDate = dateString ? new Date(dateString) : new Date();
        const startOfDay = new Date(reportDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(reportDate);
        endOfDay.setHours(23, 59, 59, 999);
        const salesAgg = await tenantClient.sale.aggregate({
            where: {
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                },
                status: 'COMPLETED'
            },
            _sum: {
                total: true,
                tax: true
            },
            _count: {
                id: true
            }
        });
        const totalSales = salesAgg._sum.total || 0;
        const totalTax = salesAgg._sum.tax || 0;
        const transactionCount = salesAgg._count.id;
        const reportNumber = `Z-${startOfDay.toISOString().split('T')[0]}-${Date.now().toString().slice(-6)}`;
        const savedReport = await tenantClient.zReport.create({
            data: {
                reportDate: startOfDay,
                reportNumber: reportNumber,
                totalSales: totalSales,
                totalTax: totalTax,
                fileUrl: file ? ('http://mock-storage-url.com/' + (file.originalname || 'report.pdf')) : null,
                status: 'processed',
                processedAt: new Date(),
            }
        });
        return {
            message: 'Z-Report generated successfully from sales data',
            data: {
                ...savedReport,
                transactionCount
            },
            stats: {
                salesCount: transactionCount,
                totalSales: Number(totalSales),
            }
        };
    }
    async getZReports(subdomain) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const tenantClient = await this.prisma.getTenantClient(tenant.databaseUrl);
        return tenantClient.zReport.findMany({
            orderBy: { reportDate: 'desc' }
        });
    }
};
exports.ZReportService = ZReportService;
exports.ZReportService = ZReportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_prisma_service_1.TenantPrismaService,
        tenant_service_1.TenantService])
], ZReportService);
//# sourceMappingURL=z-report.service.js.map