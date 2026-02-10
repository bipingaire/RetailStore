import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { PurchaseOrderService } from './purchase-order.service';

@Controller('purchase-orders')
export class PurchaseOrderController {
    constructor(private readonly purchaseOrderService: PurchaseOrderService) { }

    @Post()
    async create(@Body() body: {
        vendorId: string;
        items: Array<{ productId: string; quantity: number; unitCost: number }>;
        notes?: string;
    }) {
        return this.purchaseOrderService.createPurchaseOrder(body.vendorId, body.items, body.notes);
    }

    @Get()
    async getAll(@Query('status') status?: string) {
        return this.purchaseOrderService.getAllPurchaseOrders(status);
    }

    @Get(':id')
    async getOne(@Param('id') id: string) {
        return this.purchaseOrderService.getPurchaseOrder(id);
    }

    @Put(':id/status')
    async updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
        return this.purchaseOrderService.updateStatus(id, body.status);
    }

    @Post(':id/send')
    async send(@Param('id') id: string) {
        return this.purchaseOrderService.sendPurchaseOrder(id);
    }

    @Post(':id/receive')
    async receive(@Param('id') id: string) {
        return this.purchaseOrderService.receivePurchaseOrder(id);
    }
}
