import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { TenantService } from '../tenant/tenant.service';
export declare class ZReportService {
    private prisma;
    private tenantService;
    private openai;
    constructor(prisma: TenantPrismaService, tenantService: TenantService);
    parseZReport(buffer: Buffer, originalname: string): Promise<any>;
    commitZReport(subdomain: string, reportData: {
        reportDate: string;
        reportNumber?: string;
        totalSales: number;
        totalTax: number;
        transactionCount: number;
        items: Array<{
            description: string;
            category: string;
            quantitySold: number;
            unitPrice: number;
            totalAmount: number;
        }>;
    }): Promise<{
        message: string;
        reportId: string;
        reportNumber: string;
        adjustments: {
            productName: string;
            qty: number;
            matched: boolean;
        }[];
        unmatchedCount: number;
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
}
