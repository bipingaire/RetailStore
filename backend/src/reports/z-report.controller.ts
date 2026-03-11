import {
    Controller, Post, Body, Get, Headers, UseGuards,
    UploadedFile, UseInterceptors, HttpException, HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ZReportService } from './z-report.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reports/z-report')
@UseGuards(JwtAuthGuard)
export class ZReportController {
    constructor(private zReportService: ZReportService) { }

    // ── 1. OCR Parse ─────────────────────────────────────────────
    @Post('parse')
    @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 50 * 1024 * 1024 } }))
    async parseZReport(
        @Headers('x-tenant') subdomain: string,
        @UploadedFile() file: any,
    ) {
        try {
            if (!file) throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);

            // Pass the in-memory buffer directly — no temp file needed
            const buffer: Buffer = file.buffer;
            const result = await this.zReportService.parseZReport(buffer, file.originalname);
            return result;
        } catch (err: any) {
            throw new HttpException(
                { message: err.message || 'Z-Report parsing failed' },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // ── 2. Commit (inventory OUT) ─────────────────────────────────
    @Post('commit')
    async commitZReport(
        @Headers('x-tenant') subdomain: string,
        @Body() body: {
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
        }
    ) {
        try {
            return await this.zReportService.commitZReport(subdomain, body);
        } catch (err: any) {
            throw new HttpException(
                { message: err.message || 'Z-Report commit failed' },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // ── 3. Legacy upload (kept for backward-compat) ───────────────
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadZReport(
        @Headers('x-tenant') subdomain: string,
        @UploadedFile() file: any,
        @Body() body: { date?: string }
    ) {
        return this.zReportService.processZReport(subdomain, file, body.date);
    }

    // ── 4. List ────────────────────────────────────────────────────
    @Get()
    async getZReports(@Headers('x-tenant') subdomain: string) {
        return this.zReportService.getZReports(subdomain);
    }
}
