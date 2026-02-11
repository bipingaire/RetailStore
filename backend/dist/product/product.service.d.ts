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
    createProduct(subdomain: string, data: any): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sku: string;
        category: string | null;
        description: string | null;
        imageUrl: string | null;
        price: import("src/generated/tenant-client/runtime/library").Decimal;
        costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        stock: number;
        reorderLevel: number;
        barcode: string | null;
    }>;
    create(subdomain: string, data: any): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sku: string;
        category: string | null;
        description: string | null;
        imageUrl: string | null;
        price: import("src/generated/tenant-client/runtime/library").Decimal;
        costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        stock: number;
        reorderLevel: number;
        barcode: string | null;
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
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sku: string;
        category: string | null;
        description: string | null;
        imageUrl: string | null;
        price: import("src/generated/tenant-client/runtime/library").Decimal;
        costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        stock: number;
        reorderLevel: number;
        barcode: string | null;
    }>;
    update(subdomain: string, id: string, data: any): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sku: string;
        category: string | null;
        description: string | null;
        imageUrl: string | null;
        price: import("src/generated/tenant-client/runtime/library").Decimal;
        costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        stock: number;
        reorderLevel: number;
        barcode: string | null;
    }>;
    delete(subdomain: string, id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sku: string;
        category: string | null;
        description: string | null;
        imageUrl: string | null;
        price: import("src/generated/tenant-client/runtime/library").Decimal;
        costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        stock: number;
        reorderLevel: number;
        barcode: string | null;
    }>;
    updateStock(subdomain: string, id: string, quantity: number, type: string): Promise<{
        success: boolean;
    }>;
    findAll(subdomain: string): Promise<{
        id: string;
        name: string;
        sku: string;
        image: string;
        category: string;
        description: string;
        price: import("src/generated/tenant-client/runtime/library").Decimal;
        total_qty: number;
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
    }>;
    commitInventory(tenantId: string, items: any[]): Promise<{
        success: boolean;
        processed: number;
        details: any[];
    }>;
}
