import { OnModuleInit } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { MasterPrismaService } from '../prisma/master-prisma.service';
import { MasterCatalogService } from '../master-catalog/master-catalog.service';
export declare class ProductService implements OnModuleInit {
    private tenantService;
    private tenantPrisma;
    private masterPrisma;
    private masterCatalogService;
    constructor(tenantService: TenantService, tenantPrisma: TenantPrismaService, masterPrisma: MasterPrismaService, masterCatalogService: MasterCatalogService);
    onModuleInit(): void;
    enrichProduct(subdomain: string, id: string): Promise<{
        success: boolean;
        description: string;
    }>;
    createProduct(subdomain: string, data: any): Promise<{
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
    create(subdomain: string, data: any): Promise<{
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
    update(subdomain: string, id: string, data: any): Promise<{
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
    updateStock(subdomain: string, id: string, quantity: number, type: string): Promise<{
        success: boolean;
    }>;
    findAll(subdomain: string, options?: {
        sellableOnly?: boolean;
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
    }): Promise<{
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
    getCategories(subdomain: string): Promise<{
        name: string;
        count: number;
        imageUrl: string;
    }[]>;
    getHomepageData(subdomain: string): Promise<{
        name: string;
        totalCategorySales: number;
        products: any[];
    }[]>;
    syncAll(subdomain: string): Promise<{
        success: boolean;
        synced: number;
        skipped: number;
        errors: string[];
    }>;
    commitInventory(tenantId: string, items: any[]): Promise<{
        success: boolean;
        processed: number;
        details: any[];
    }>;
}
