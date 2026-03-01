import {
    Controller, Post, Body, Get, Headers, UseGuards,
    UploadedFile, UseInterceptors, HttpException, HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ZReportService } from './z-report.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import * as path from 'path';
import * as fs from 'fs';

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

            // Save file to temp dir
            const uploadDir = path.join(process.cwd(), '..', 'public', 'uploads', 'temp');
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

            const filename = `${Date.now()}-${file.originalname}`;
            const filepath = path.join(uploadDir, filename);
            if (file.buffer) {
                fs.writeFileSync(filepath, file.buffer);
            } else if (file.path) {
                fs.copyFileSync(file.path, filepath);
            }

            const fileUrl = `/uploads/temp/${filename}`;
            const result = await this.zReportService.parseZReport(fileUrl);
            return { ...result, fileUrl };
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
