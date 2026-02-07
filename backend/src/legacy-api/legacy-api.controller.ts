import { Controller, Post, Body, Req } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { SaleService } from '../sale/sale.service';
// import { Request } from 'express'; 

@Controller('api') // Base path matches Frontend '/api'
export class LegacyApiController {
    constructor(
        private productService: ProductService,
        private saleService: SaleService,
    ) { }

    @Post('inventory/commit')
    async commitInventory(@Body() body: { items: any[]; tenantId: string }) {
        // Delegates to Product Service to promote items to Global Catalog
        // Logic: Check Global, Create if missing.
        return this.productService.commitInventory(body.tenantId, body.items);
    }

    @Post('sales/sync')
    async syncSales(@Body() body: { imageUrl: string; tenantId: string }) {
        // Delegates to Sale Service to parse image and update stock
        return this.saleService.syncSalesFromImage(body.tenantId, body.imageUrl);
    }

    @Post('admin/products/add-new')
    async addProduct(@Body() body: any, @Req() req: any) {
        // Extract tenantId from header or body? 
        // Frontend Admin likely sends x-tenant header or it's in body?
        // Next.js API usually just gets it from session or body.
        // Let's assume body for now or header 'x-tenant'.
        const tenantId = req.headers['x-tenant'] || body.tenantId;
        return this.productService.createProduct(tenantId, body);
    }
}
