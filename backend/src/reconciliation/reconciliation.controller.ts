import { Controller, Get, Post, Put, Body, Param, Req } from '@nestjs/common';
import { ReconciliationService } from './reconciliation.service';

@Controller('reconciliations')
export class ReconciliationController {
    constructor(private readonly reconciliationService: ReconciliationService) { }

    @Post()
    async create(@Req() req: any, @Body() body: { createdBy?: string }) {
        const tenantId = req.headers['x-tenant-id'] || 'retail_store_anuj';
        return this.reconciliationService.create(tenantId, body.createdBy);
    }

    @Get()
    async findAll(@Req() req: any) {
        const tenantId = req.headers['x-tenant-id'] || 'retail_store_anuj';
        return this.reconciliationService.findAll(tenantId);
    }

    @Get(':id')
    async findOne(@Req() req: any, @Param('id') id: string) {
        const tenantId = req.headers['x-tenant-id'] || 'retail_store_anuj';
        return this.reconciliationService.findOne(tenantId, id);
    }

    @Put(':id/items')
    async updateItem(
        @Req() req: any,
        @Param('id') id: string,
        @Body() body: {
            productId: string;
            physicalCount: number;
            reason?: string;
            notes?: string;
        },
    ) {
        const tenantId = req.headers['x-tenant-id'] || 'retail_store_anuj';
        return this.reconciliationService.updateItem(
            tenantId,
            id,
            body.productId,
            body.physicalCount,
            body.reason,
            body.notes,
        );
    }

    @Post(':id/complete')
    async complete(@Req() req: any, @Param('id') id: string) {
        const tenantId = req.headers['x-tenant-id'] || 'retail_store_anuj';
        return this.reconciliationService.complete(tenantId, id);
    }
}
