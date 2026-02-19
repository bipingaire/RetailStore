import { Controller, Get, Post, Body, Param, Headers } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
    constructor(private readonly auditService: AuditService) { }

    @Post('session/start')
    async startSession(
        @Headers('x-tenant') subdomain: string,
        @Body() body: { userId: string; notes?: string }
    ) {
        return this.auditService.startAuditSession(subdomain, body.userId, body.notes);
    }

    @Post('session/:id/count')
    async addCount(
        @Headers('x-tenant') subdomain: string,
        @Param('id') id: string,
        @Body() body: { productId: string; countedQuantity: number; reason?: string },
    ) {
        return this.auditService.addAuditCount(subdomain, id, body.productId, body.countedQuantity, body.reason);
    }

    @Post('session/:id/complete')
    async completeSession(
        @Headers('x-tenant') subdomain: string,
        @Param('id') id: string
    ) {
        return this.auditService.completeAuditSession(subdomain, id);
    }

    @Post('session/:id/reject')
    async rejectSession(
        @Headers('x-tenant') subdomain: string,
        @Param('id') id: string
    ) {
        return this.auditService.rejectAuditSession(subdomain, id);
    }

    @Get('session/:id')
    async getSession(
        @Headers('x-tenant') subdomain: string,
        @Param('id') id: string
    ) {
        return this.auditService.getAuditSession(subdomain, id);
    }

    @Get('sessions')
    async getAllSessions(@Headers('x-tenant') subdomain: string) {
        return this.auditService.getAllAuditSessions(subdomain);
    }

    @Get('variances')
    async getVariances(@Headers('x-tenant') subdomain: string) {
        return this.auditService.getVarianceReport(subdomain);
    }

    @Post('submit-bulk')
    async submitBulk(
        @Headers('x-tenant') subdomain: string,
        @Body() body: { userId: string; items: { productId: string; quantity: number }[]; notes?: string }
    ) {
        return this.auditService.submitBulkAudit(subdomain, body.userId, body.items, body.notes);
    }
}
