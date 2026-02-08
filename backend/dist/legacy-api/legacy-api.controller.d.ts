import { ProductService } from '../product/product.service';
import { SaleService } from '../sale/sale.service';
export declare class LegacyApiController {
    private productService;
    private saleService;
    constructor(productService: ProductService, saleService: SaleService);
    commitInventory(body: {
        items: any[];
        tenantId: string;
    }): Promise<{
        success: boolean;
        processed: number;
        details: any[];
    }>;
    syncSales(body: {
        imageUrl: string;
        tenantId: string;
    }): Promise<{
        success: boolean;
        count: number;
        raw: any[];
    }>;
    addProduct(body: any, req: any): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sku: string;
        category: string | null;
        description: string | null;
        price: import("src/generated/tenant-client/runtime/library").Decimal;
        costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        stock: number;
        reorderLevel: number;
        imageUrl: string | null;
        barcode: string | null;
    }>;
}
