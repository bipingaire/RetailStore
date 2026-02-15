import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
export declare class SaleService {
    private tenantService;
    private tenantPrisma;
    constructor(tenantService: TenantService, tenantPrisma: TenantPrismaService);
    createSale(subdomain: string, data: any): Promise<{
        items: {
            id: string;
            subtotal: import("dist/generated/tenant-client/runtime/library").Decimal;
            quantity: number;
            unitPrice: import("dist/generated/tenant-client/runtime/library").Decimal;
            productId: string;
            saleId: string;
        }[];
    } & {
        id: string;
        saleNumber: string;
        subtotal: import("dist/generated/tenant-client/runtime/library").Decimal;
        tax: import("dist/generated/tenant-client/runtime/library").Decimal;
        discount: import("dist/generated/tenant-client/runtime/library").Decimal;
        total: import("dist/generated/tenant-client/runtime/library").Decimal;
        status: string;
        createdAt: Date;
        userId: string;
        customerId: string | null;
    }>;
    findAll(subdomain: string, options: any): Promise<({
        customer: {
            id: string;
            createdAt: Date;
            name: string;
            email: string | null;
            phone: string | null;
            loyaltyPoints: number;
            isActive: boolean;
            updatedAt: Date;
        };
        items: ({
            product: {
                id: string;
                createdAt: Date;
                name: string;
                isActive: boolean;
                updatedAt: Date;
                sku: string;
                category: string | null;
                description: string | null;
                price: import("dist/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("dist/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                imageUrl: string | null;
                barcode: string | null;
            };
        } & {
            id: string;
            subtotal: import("dist/generated/tenant-client/runtime/library").Decimal;
            quantity: number;
            unitPrice: import("dist/generated/tenant-client/runtime/library").Decimal;
            productId: string;
            saleId: string;
        })[];
    } & {
        id: string;
        saleNumber: string;
        subtotal: import("dist/generated/tenant-client/runtime/library").Decimal;
        tax: import("dist/generated/tenant-client/runtime/library").Decimal;
        discount: import("dist/generated/tenant-client/runtime/library").Decimal;
        total: import("dist/generated/tenant-client/runtime/library").Decimal;
        status: string;
        createdAt: Date;
        userId: string;
        customerId: string | null;
    })[]>;
    findOne(subdomain: string, id: string): Promise<{
        items: {
            id: string;
            subtotal: import("dist/generated/tenant-client/runtime/library").Decimal;
            quantity: number;
            unitPrice: import("dist/generated/tenant-client/runtime/library").Decimal;
            productId: string;
            saleId: string;
        }[];
    } & {
        id: string;
        saleNumber: string;
        subtotal: import("dist/generated/tenant-client/runtime/library").Decimal;
        tax: import("dist/generated/tenant-client/runtime/library").Decimal;
        discount: import("dist/generated/tenant-client/runtime/library").Decimal;
        total: import("dist/generated/tenant-client/runtime/library").Decimal;
        status: string;
        createdAt: Date;
        userId: string;
        customerId: string | null;
    }>;
    getSalesStats(subdomain: string): Promise<{
        totalSales: number;
        totalRevenue: number;
    }>;
    cancelSale(subdomain: string, id: string, userId: string): Promise<{
        id: string;
        saleNumber: string;
        subtotal: import("dist/generated/tenant-client/runtime/library").Decimal;
        tax: import("dist/generated/tenant-client/runtime/library").Decimal;
        discount: import("dist/generated/tenant-client/runtime/library").Decimal;
        total: import("dist/generated/tenant-client/runtime/library").Decimal;
        status: string;
        createdAt: Date;
        userId: string;
        customerId: string | null;
    }>;
    syncSalesFromImage(tenantId: string, imageUrl: string): Promise<{
        success: boolean;
        count: number;
        raw: any[];
    }>;
    updateSaleStatus(subdomain: string, id: string, status: string): Promise<{
        id: string;
        saleNumber: string;
        subtotal: import("dist/generated/tenant-client/runtime/library").Decimal;
        tax: import("dist/generated/tenant-client/runtime/library").Decimal;
        discount: import("dist/generated/tenant-client/runtime/library").Decimal;
        total: import("dist/generated/tenant-client/runtime/library").Decimal;
        status: string;
        createdAt: Date;
        userId: string;
        customerId: string | null;
    }>;
}
