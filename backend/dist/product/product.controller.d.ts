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
        name: string;
        id: string;
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
        isSellable: boolean;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        unitsPerParent: number;
    }>;
    findAll(subdomain: string, sellableOnly?: string, page?: string, limit?: string, search?: string, category?: string): Promise<{
        id: string;
        name: string;
        sku: string;
        image: string;
        imageUrl: string;
        category: string;
        description: string;
        price: import("src/generated/tenant-client/runtime/library").Decimal;
        total_qty: number;
        is_sellable: boolean;
        parent_id: string;
        units_per_parent: number;
        salesCount: number;
        batches: {
            id: string;
            qty: number;
            expiry: string;
            days_left: number;
            status: string;
        }[];
    }[] | import("../common/pagination.dto").PaginatedResponse<{
        id: string;
        name: string;
        sku: string;
        image: string;
        imageUrl: string;
        category: string;
        description: string;
        price: import("src/generated/tenant-client/runtime/library").Decimal;
        total_qty: number;
        is_sellable: boolean;
        parent_id: string;
        units_per_parent: number;
        salesCount: number;
        batches: {
            id: string;
            qty: number;
            expiry: string;
            days_left: number;
            status: string;
        }[];
    }>>;
    getHomepageData(subdomain: string): Promise<{
        name: string;
        totalCategorySales: number;
        products: any[];
    }[]>;
    getCategories(subdomain: string): Promise<{
        name: string;
        count: number;
        imageUrl: string;
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
        name: string;
        id: string;
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
        isSellable: boolean;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        unitsPerParent: number;
    }>;
    update(subdomain: string, id: string, dto: UpdateProductDto): Promise<{
        name: string;
        id: string;
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
        isSellable: boolean;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        unitsPerParent: number;
    }>;
    delete(subdomain: string, id: string): Promise<{
        name: string;
        id: string;
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
        isSellable: boolean;
        createdAt: Date;
        updatedAt: Date;
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
        description: string;
    }>;
}
