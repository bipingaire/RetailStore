import { ZReportService } from './z-report.service';
export declare class ZReportController {
    private zReportService;
    constructor(zReportService: ZReportService);
    parseZReport(subdomain: string, file: any): Promise<any>;
    commitZReport(subdomain: string, body: {
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
