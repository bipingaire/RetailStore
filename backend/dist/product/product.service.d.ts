import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { MasterPrismaService } from '../prisma/master-prisma.service';
import { MasterCatalogService } from '../master-catalog/master-catalog.service';
export declare class ProductService {
    private tenantService;
    private tenantPrisma;
    private masterPrisma;
    private masterCatalogService;
    constructor(tenantService: TenantService, tenantPrisma: TenantPrismaService, masterPrisma: MasterPrismaService, masterCatalogService: MasterCatalogService);
    enrichProduct(subdomain: string, id: string): Promise<{
        success: boolean;
        imageUrl: string;
    }>;
    createProduct(subdomain: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        sku: string;
        category: string | null;
        description: string | null;
        price: import("src/generated/tenant-client/runtime/library").Decimal;
        costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        stock: number;
        reorderLevel: number;
        imageUrl: string | null;
        barcode: string | null;
        isSellable: boolean;
        parentId: string | null;
        unitsPerParent: number;
    }>;
    create(subdomain: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        sku: string;
        category: string | null;
        description: string | null;
        price: import("src/generated/tenant-client/runtime/library").Decimal;
        costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        stock: number;
        reorderLevel: number;
        imageUrl: string | null;
        barcode: string | null;
        isSellable: boolean;
        parentId: string | null;
        unitsPerParent: number;
    }>;
    findOne(subdomain: string, id: string): Promise<{
        Batches: {
            id: string;
            productId: string;
            quantity: number;
            sku: string;
            expiryDate: Date;
            receivedDate: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        sku: string;
        category: string | null;
        description: string | null;
        price: import("src/generated/tenant-client/runtime/library").Decimal;
        costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        stock: number;
        reorderLevel: number;
        imageUrl: string | null;
        barcode: string | null;
        isSellable: boolean;
        parentId: string | null;
        unitsPerParent: number;
    }>;
    update(subdomain: string, id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        sku: string;
        category: string | null;
        description: string | null;
        price: import("src/generated/tenant-client/runtime/library").Decimal;
        costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        stock: number;
        reorderLevel: number;
        imageUrl: string | null;
        barcode: string | null;
        isSellable: boolean;
        parentId: string | null;
        unitsPerParent: number;
    }>;
    delete(subdomain: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        sku: string;
        category: string | null;
        description: string | null;
        price: import("src/generated/tenant-client/runtime/library").Decimal;
        costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        stock: number;
        reorderLevel: number;
        imageUrl: string | null;
        barcode: string | null;
        isSellable: boolean;
        parentId: string | null;
        unitsPerParent: number;
    }>;
    updateStock(subdomain: string, id: string, quantity: number, type: string): Promise<{
        success: boolean;
    }>;
    findAll(subdomain: string, sellableOnly?: boolean): Promise<{
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
