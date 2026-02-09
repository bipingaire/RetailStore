import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
export declare class SaleService {
    private tenantService;
    private tenantPrisma;
    constructor(tenantService: TenantService, tenantPrisma: TenantPrismaService);
    createSale(subdomain: string, data: any): Promise<{
        items: {
            id: string;
            subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
            quantity: number;
            unitPrice: import("src/generated/tenant-client/runtime/library").Decimal;
            productId: string;
            saleId: string;
        }[];
    } & {
        id: string;
        status: string;
        createdAt: Date;
        saleNumber: string;
        subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
        tax: import("src/generated/tenant-client/runtime/library").Decimal;
        discount: import("src/generated/tenant-client/runtime/library").Decimal;
        total: import("src/generated/tenant-client/runtime/library").Decimal;
        userId: string;
        customerId: string | null;
    }>;
    findAll(subdomain: string, options: any): Promise<({
        items: {
            id: string;
            subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
            quantity: number;
            unitPrice: import("src/generated/tenant-client/runtime/library").Decimal;
            productId: string;
            saleId: string;
        }[];
    } & {
        id: string;
        status: string;
        createdAt: Date;
        saleNumber: string;
        subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
        tax: import("src/generated/tenant-client/runtime/library").Decimal;
        discount: import("src/generated/tenant-client/runtime/library").Decimal;
        total: import("src/generated/tenant-client/runtime/library").Decimal;
        userId: string;
        customerId: string | null;
    })[]>;
    findOne(subdomain: string, id: string): Promise<{
        items: {
            id: string;
            subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
            quantity: number;
            unitPrice: import("src/generated/tenant-client/runtime/library").Decimal;
            productId: string;
            saleId: string;
        }[];
    } & {
        id: string;
        status: string;
        createdAt: Date;
        saleNumber: string;
        subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
        tax: import("src/generated/tenant-client/runtime/library").Decimal;
        discount: import("src/generated/tenant-client/runtime/library").Decimal;
        total: import("src/generated/tenant-client/runtime/library").Decimal;
        userId: string;
        customerId: string | null;
    }>;
    getSalesStats(subdomain: string): Promise<{
        totalSales: number;
        totalRevenue: number;
    }>;
    cancelSale(subdomain: string, id: string, userId: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        saleNumber: string;
        subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
        tax: import("src/generated/tenant-client/runtime/library").Decimal;
        discount: import("src/generated/tenant-client/runtime/library").Decimal;
        total: import("src/generated/tenant-client/runtime/library").Decimal;
        userId: string;
        customerId: string | null;
    }>;
    syncSalesFromImage(tenantId: string, imageUrl: string): Promise<{
        success: boolean;
        count: number;
        raw: any[];
    }>;
}
