import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductController {
    private productService;
    constructor(productService: ProductService);
    create(subdomain: string, dto: CreateProductDto): Promise<{
        id: string;
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
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(subdomain: string): Promise<{
        id: string;
        name: string;
        sku: string;
        image: string;
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
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(subdomain: string, id: string, dto: UpdateProductDto): Promise<{
        id: string;
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
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(subdomain: string, id: string): Promise<{
        id: string;
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
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateStock(subdomain: string, id: string, dto: {
        quantity: number;
        type: 'IN' | 'OUT' | 'ADJUSTMENT';
    }): Promise<{
        success: boolean;
    }>;
}
