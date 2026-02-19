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
let ZReportService = class ZReportService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async processZReport(subdomain, file) {
        const parsedData = this.mockParseZReport(file);
        const reportNumber = `Z-${Date.now()}`;
        const tenantClient = await this.prisma.getTenantClient(subdomain);
        const savedReport = await tenantClient.zReport.create({
            data: {
                reportDate: new Date(parsedData.reportDate),
                reportNumber: reportNumber,
                totalSales: parsedData.totalSales,
                totalTax: parsedData.totalTax,
                fileUrl: 'http://mock-storage-url.com/' + (file.originalname || 'report.pdf'),
                status: 'processed',
                processedAt: new Date(),
            }
        });
        return {
            message: 'Z-Report processed successfully',
            data: {
                ...savedReport,
                lineItems: parsedData.lineItems
            }
        };
    }
    async getZReports(subdomain) {
        const tenantClient = await this.prisma.getTenantClient(subdomain);
        return tenantClient.zReport.findMany({
            orderBy: { reportDate: 'desc' }
        });
    }
    mockParseZReport(file) {
        return {
            reportDate: new Date().toISOString(),
            totalSales: 1250.50,
            totalTax: 100.04,
            transactionCount: 45,
            lineItems: [
                { skuCode: 'SKU001', productName: 'Mock Product A', quantitySold: 10, totalAmount: 100.00 },
                { skuCode: 'SKU002', productName: 'Mock Product B', quantitySold: 5, totalAmount: 50.00 },
                { skuCode: 'SKU003', productName: 'Mock Product C', quantitySold: 20, totalAmount: 1100.50 }
            ]
        };
    }
};
exports.ZReportService = ZReportService;
exports.ZReportService = ZReportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_prisma_service_1.TenantPrismaService])
], ZReportService);
//# sourceMappingURL=z-report.service.js.map