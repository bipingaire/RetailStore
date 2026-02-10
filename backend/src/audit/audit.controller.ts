import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
    constructor(private readonly auditService: AuditService) { }

    @Post('session/start')
    async startSession(@Body() body: { userId: string; notes?: string }) {
        return this.auditService.startAuditSession(body.userId, body.notes);
    }

    @Post('session/:id/count')
    async addCount(
        @Param('id') id: string,
        @Body() body: { productId: string; countedQuantity: number; reason?: string },
    ) {
        return this.auditService.addAuditCount(id, body.productId, body.countedQuantity, body.reason);
    }

    @Post('session/:id/complete')
    async completeSession(@Param('id') id: string) {
        return this.auditService.completeAuditSession(id);
    }

    @Get('session/:id')
    async getSession(@Param('id') id: string) {
        return this.auditService.getAuditSession(id);
    }

    @Get('sessions')
    async getAllSessions() {
        return this.auditService.getAllAuditSessions();
    }

    @Get('variances')
    async getVariances() {
        return this.auditService.getVarianceReport();
    }
}
