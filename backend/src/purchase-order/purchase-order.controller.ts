import { Controller, Get, Post, Put, Body, Param, Query, Headers } from '@nestjs/common';
import { PurchaseOrderService } from './purchase-order.service';

@Controller('purchase-orders')
export class PurchaseOrderController {
    constructor(private readonly purchaseOrderService: PurchaseOrderService) { }

    @Post()
    async create(
        @Headers('x-tenant') subdomain: string,
        @Body() body: {
            vendorId: string;
            items: Array<{ productId: string; quantity: number; unitCost: number }>;
            notes?: string;
        }
    ) {
        return this.purchaseOrderService.createPurchaseOrder(subdomain, body.vendorId, body.items, body.notes);
    }

    @Get()
    async getAll(
        @Headers('x-tenant') subdomain: string,
        @Query('status') status?: string
    ) {
        return this.purchaseOrderService.getAllPurchaseOrders(subdomain, status);
    }

    @Get(':id')
    async getOne(
        @Headers('x-tenant') subdomain: string,
        @Param('id') id: string
    ) {
        return this.purchaseOrderService.getPurchaseOrder(subdomain, id);
    }

    @Put(':id/status')
    async updateStatus(
        @Headers('x-tenant') subdomain: string,
        @Param('id') id: string,
        @Body() body: { status: string }
    ) {
        return this.purchaseOrderService.updateStatus(subdomain, id, body.status);
    }

    @Post(':id/send')
    async send(
        @Headers('x-tenant') subdomain: string,
        @Param('id') id: string
    ) {
        return this.purchaseOrderService.sendPurchaseOrder(subdomain, id);
    }

    @Post(':id/receive')
    async receive(
        @Headers('x-tenant') subdomain: string,
        @Param('id') id: string
    ) {
        return this.purchaseOrderService.receivePurchaseOrder(subdomain, id);
    }
}
