import { Injectable, BadRequestException } from '@nestjs/common';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';

@Injectable()
export class ZReportService {
    constructor(private prisma: TenantPrismaService) { }

    async processZReport(subdomain: string, file: any) {
        // 1. Simulate Parsing (Replace with actual OCR/Text parsing logic later)
        // For now, we generate random data or static mock data
        const parsedData = this.mockParseZReport(file);

        // 2. Save to Database
        // We use a transaction if we want to save line items, but ZReport model 
        // in schema currently only has summary fields. 
        // If we want to save line items, we might need a separate model or JSON field.
        // For now, schema has: totalSales, totalTax, etc.

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
                lineItems: parsedData.lineItems // Return line items for UI display even if not saved individually yet
            }
        };
    }

    async getZReports(subdomain: string) {
        const tenantClient = await this.prisma.getTenantClient(subdomain);
        return tenantClient.zReport.findMany({
            orderBy: { reportDate: 'desc' }
        });
    }

    private mockParseZReport(file: any) {
        // Logic to parse file buffer would go here
        // const text = file.buffer.toString('utf-8');

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
}
