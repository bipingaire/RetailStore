import { Injectable, BadRequestException } from '@nestjs/common';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { TenantService } from '../tenant/tenant.service';

@Injectable()
export class ZReportService {
    constructor(
        private prisma: TenantPrismaService,
        private tenantService: TenantService,
    ) { }

    async processZReport(subdomain: string, file: any, dateString?: string) {
        // 1. Resolve subdomain → databaseUrl
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const tenantClient = await this.prisma.getTenantClient(tenant.databaseUrl);

        // 2. Determine Date Range
        const reportDate = dateString ? new Date(dateString) : new Date();
        const startOfDay = new Date(reportDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(reportDate);
        endOfDay.setHours(23, 59, 59, 999);

        // 3. Aggregate Real Sales from DB
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

        // 4. Save Z-Report
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

    async getZReports(subdomain: string) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const tenantClient = await this.prisma.getTenantClient(tenant.databaseUrl);
        return tenantClient.zReport.findMany({
            orderBy: { reportDate: 'desc' }
        });
    }
}
