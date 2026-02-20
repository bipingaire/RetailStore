import { Controller, Post, UseInterceptors, UploadedFile, Headers, Get, UseGuards, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ZReportService } from './z-report.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reports/z-report')
@UseGuards(JwtAuthGuard)
export class ZReportController {
    constructor(private zReportService: ZReportService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadZReport(
        @Headers('x-tenant') subdomain: string,
        @UploadedFile() file: any,
        @Body() body: { date?: string }
    ) {
        return this.zReportService.processZReport(subdomain, file, body.date);
    }

    @Get()
    async getZReports(@Headers('x-tenant') subdomain: string) {
        return this.zReportService.getZReports(subdomain);
    }
}
