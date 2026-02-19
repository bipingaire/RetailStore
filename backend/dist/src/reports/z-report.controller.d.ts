import { ZReportService } from './z-report.service';
export declare class ZReportController {
    private zReportService;
    constructor(zReportService: ZReportService);
    uploadZReport(subdomain: string, file: any): Promise<{
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
}
