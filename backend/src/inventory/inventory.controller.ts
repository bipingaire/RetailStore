import { Controller, Get, Post, Body, Query, Req } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateStockMovementDto } from './dto/stock-movement.dto';

@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Post('movements')
    async createMovement(@Req() req: any, @Body() dto: CreateStockMovementDto) {
        const tenantId = req.headers['x-tenant-id'] || 'retail_store_anuj';
        return this.inventoryService.createMovement(tenantId, dto);
    }

    @Get('movements')
    async getMovements(
        @Req() req: any,
        @Query('productId') productId?: string,
        @Query('movementType') movementType?: string,
    ) {
        const tenantId = req.headers['x-tenant-id'] || 'retail_store_anuj';
        return this.inventoryService.getMovements(tenantId, productId, movementType);
    }

    @Get('health')
    async getHealthMetrics(@Req() req: any) {
        const tenantId = req.headers['x-tenant-id'] || 'retail_store_anuj';
        return this.inventoryService.getHealthMetrics(tenantId);
    }

    @Get('low-stock')
    async getLowStock(@Req() req: any) {
        const tenantId = req.headers['x-tenant-id'] || 'retail_store_anuj';
        return this.inventoryService.getLowStock(tenantId);
    }
}
