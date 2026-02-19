import { TenantPrismaService } from '../prisma/tenant-prisma.service';
export declare class ZReportService {
    private prisma;
    constructor(prisma: TenantPrismaService);
    processZReport(subdomain: string, file: any): Promise<{
        message: string;
        data: {
            lineItems: {
                skuCode: string;
                productName: string;
                quantitySold: number;
                totalAmount: number;
            }[];
            id: string;
            createdAt: Date;
            status: string;
            fileUrl: string | null;
            reportDate: Date;
            reportNumber: string;
            totalSales: import("src/generated/tenant-client/runtime/library").Decimal;
            totalTax: import("src/generated/tenant-client/runtime/library").Decimal;
            processedAt: Date | null;
        };
    }>;
    getZReports(subdomain: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        fileUrl: string | null;
        reportDate: Date;
        reportNumber: string;
        totalSales: import("src/generated/tenant-client/runtime/library").Decimal;
        totalTax: import("src/generated/tenant-client/runtime/library").Decimal;
        processedAt: Date | null;
    }[]>;
    private mockParseZReport;
}
