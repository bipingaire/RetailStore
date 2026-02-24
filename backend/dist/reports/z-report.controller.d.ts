import { ZReportService } from './z-report.service';
export declare class ZReportController {
    private zReportService;
    constructor(zReportService: ZReportService);
    uploadZReport(subdomain: string, file: any, body: {
        date?: string;
    }): Promise<{
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
