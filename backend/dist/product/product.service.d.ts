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
    create(subdomain: string, data: any): Promise<{
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
    update(subdomain: string, id: string, data: any): Promise<{
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
