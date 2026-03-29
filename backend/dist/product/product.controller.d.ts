import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductController {
    private productService;
    constructor(productService: ProductService);
    syncAll(subdomain: string): Promise<{
        success: boolean;
        synced: number;
        skipped: number;
        errors: string[];
    }>;
    create(subdomain: string, dto: CreateProductDto): Promise<{
        sku: string;
        category: string | null;
        description: string | null;
        imageUrl: string | null;
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        price: import("src/generated/tenant-client/runtime/library").Decimal;
        costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        stock: number;
        reorderLevel: number;
        barcode: string | null;
        isSellable: boolean;
        parentId: string | null;
        unitsPerParent: number;
    }>;
    findAll(subdomain: string, sellableOnly?: string): Promise<{
        id: string;
        name: string;
        sku: string;
        image: string;
        category: string;
        description: string;
        price: import("src/generated/tenant-client/runtime/library").Decimal;
        total_qty: number;
        is_sellable: boolean;
        parent_id: string;
        units_per_parent: number;
        batches: {
            id: string;
            qty: number;
            expiry: string;
            days_left: number;
            status: string;
        }[];
    }[]>;
    findOne(subdomain: string, id: string): Promise<{
        Batches: {
            sku: string;
            id: string;
            productId: string;
            quantity: number;
            expiryDate: Date;
            receivedDate: Date;
        }[];
    } & {
        sku: string;
        category: string | null;
        description: string | null;
        imageUrl: string | null;
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        price: import("src/generated/tenant-client/runtime/library").Decimal;
        costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        stock: number;
        reorderLevel: number;
        barcode: string | null;
        isSellable: boolean;
        parentId: string | null;
        unitsPerParent: number;
    }>;
    update(subdomain: string, id: string, dto: UpdateProductDto): Promise<{
        sku: string;
        category: string | null;
        description: string | null;
        imageUrl: string | null;
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        price: import("src/generated/tenant-client/runtime/library").Decimal;
        costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        stock: number;
        reorderLevel: number;
        barcode: string | null;
        isSellable: boolean;
        parentId: string | null;
        unitsPerParent: number;
    }>;
    delete(subdomain: string, id: string): Promise<{
        sku: string;
        category: string | null;
        description: string | null;
        imageUrl: string | null;
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        price: import("src/generated/tenant-client/runtime/library").Decimal;
        costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        stock: number;
        reorderLevel: number;
        barcode: string | null;
        isSellable: boolean;
        parentId: string | null;
        unitsPerParent: number;
    }>;
    updateStock(subdomain: string, id: string, dto: {
        quantity: number;
        type: 'IN' | 'OUT' | 'ADJUSTMENT';
    }): Promise<{
        success: boolean;
    }>;
    enrich(subdomain: string, id: string): Promise<{
        success: boolean;
        imageUrl: string;
    }>;
}
