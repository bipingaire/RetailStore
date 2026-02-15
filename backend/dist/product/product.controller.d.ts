import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductController {
    private productService;
    constructor(productService: ProductService);
    syncAll(subdomain: string): Promise<{
        success: boolean;
        synced: number;
    }>;
    create(subdomain: string, dto: CreateProductDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        category: string | null;
        description: string | null;
        sku: string;
        price: import("dist/generated/tenant-client/runtime/library").Decimal;
        costPrice: import("dist/generated/tenant-client/runtime/library").Decimal;
        stock: number;
        reorderLevel: number;
        imageUrl: string | null;
        barcode: string | null;
        isActive: boolean;
    }>;
    findAll(subdomain: string): Promise<{
        id: string;
        name: string;
        sku: string;
        image: string;
        category: string;
        description: string;
        price: import("dist/generated/tenant-client/runtime/library").Decimal;
        total_qty: number;
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
            id: string;
            sku: string;
            productId: string;
            quantity: number;
            expiryDate: Date;
            receivedDate: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        category: string | null;
        description: string | null;
        sku: string;
        price: import("dist/generated/tenant-client/runtime/library").Decimal;
        costPrice: import("dist/generated/tenant-client/runtime/library").Decimal;
        stock: number;
        reorderLevel: number;
        imageUrl: string | null;
        barcode: string | null;
        isActive: boolean;
    }>;
    update(subdomain: string, id: string, dto: UpdateProductDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        category: string | null;
        description: string | null;
        sku: string;
        price: import("dist/generated/tenant-client/runtime/library").Decimal;
        costPrice: import("dist/generated/tenant-client/runtime/library").Decimal;
        stock: number;
        reorderLevel: number;
        imageUrl: string | null;
        barcode: string | null;
        isActive: boolean;
    }>;
    delete(subdomain: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        category: string | null;
        description: string | null;
        sku: string;
        price: import("dist/generated/tenant-client/runtime/library").Decimal;
        costPrice: import("dist/generated/tenant-client/runtime/library").Decimal;
        stock: number;
        reorderLevel: number;
        imageUrl: string | null;
        barcode: string | null;
        isActive: boolean;
    }>;
    updateStock(subdomain: string, id: string, dto: {
        quantity: number;
        type: 'IN' | 'OUT' | 'ADJUSTMENT';
    }): Promise<{
        success: boolean;
    }>;
}
