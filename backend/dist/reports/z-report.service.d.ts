import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { TenantService } from '../tenant/tenant.service';
export declare class ZReportService {
    private prisma;
    private tenantService;
    constructor(prisma: TenantPrismaService, tenantService: TenantService);
    processZReport(subdomain: string, file: any, dateString?: string): Promise<{
        message: string;
        data: {
            transactionCount: number;
            id: string;
            fileUrl: string | null;
            status: string;
            createdAt: Date;
            reportDate: Date;
            reportNumber: string;
            totalSales: import("src/generated/tenant-client/runtime/library").Decimal;
            totalTax: import("src/generated/tenant-client/runtime/library").Decimal;
            processedAt: Date | null;
        };
        stats: {
            salesCount: number;
            totalSales: number;
        };
    }>;
    getZReports(subdomain: string): Promise<{
        id: string;
        fileUrl: string | null;
        status: string;
        createdAt: Date;
        reportDate: Date;
        reportNumber: string;
        totalSales: import("src/generated/tenant-client/runtime/library").Decimal;
        totalTax: import("src/generated/tenant-client/runtime/library").Decimal;
        processedAt: Date | null;
    }[]>;
}
