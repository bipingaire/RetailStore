import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { SettingsService } from '../settings/settings.service';
export declare class SaleService {
    private tenantService;
    private tenantPrisma;
    private settingsService;
    constructor(tenantService: TenantService, tenantPrisma: TenantPrismaService, settingsService: SettingsService);
    createSale(subdomain: string, data: any): Promise<{
        items: {
            id: string;
            productId: string;
            quantity: number;
            unitPrice: import("src/generated/tenant-client/runtime/library").Decimal;
            subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
            saleId: string;
        }[];
    } & {
        id: string;
        status: string;
        createdAt: Date;
        total: import("src/generated/tenant-client/runtime/library").Decimal;
        subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
        tax: import("src/generated/tenant-client/runtime/library").Decimal;
        discount: import("src/generated/tenant-client/runtime/library").Decimal;
        saleNumber: string;
        userId: string;
        customerId: string | null;
    }>;
    findMyOrders(subdomain: string, userId: string): Promise<({
        items: ({
            product: {
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
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            unitPrice: import("src/generated/tenant-client/runtime/library").Decimal;
            subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
            saleId: string;
        })[];
    } & {
        id: string;
        status: string;
        createdAt: Date;
        total: import("src/generated/tenant-client/runtime/library").Decimal;
        subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
        tax: import("src/generated/tenant-client/runtime/library").Decimal;
        discount: import("src/generated/tenant-client/runtime/library").Decimal;
        saleNumber: string;
        userId: string;
        customerId: string | null;
    })[]>;
    findAll(subdomain: string, options: any): Promise<({
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            email: string | null;
            phone: string | null;
            isActive: boolean;
            loyaltyPoints: number;
        };
        items: ({
            product: {
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
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            unitPrice: import("src/generated/tenant-client/runtime/library").Decimal;
            subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
            saleId: string;
        })[];
    } & {
        id: string;
        status: string;
        createdAt: Date;
        total: import("src/generated/tenant-client/runtime/library").Decimal;
        subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
        tax: import("src/generated/tenant-client/runtime/library").Decimal;
        discount: import("src/generated/tenant-client/runtime/library").Decimal;
        saleNumber: string;
        userId: string;
        customerId: string | null;
    })[]>;
    findOne(subdomain: string, id: string): Promise<{
        items: ({
            product: {
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
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            unitPrice: import("src/generated/tenant-client/runtime/library").Decimal;
            subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
            saleId: string;
        })[];
    } & {
        id: string;
        status: string;
        createdAt: Date;
        total: import("src/generated/tenant-client/runtime/library").Decimal;
        subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
        tax: import("src/generated/tenant-client/runtime/library").Decimal;
        discount: import("src/generated/tenant-client/runtime/library").Decimal;
        saleNumber: string;
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
        total: import("src/generated/tenant-client/runtime/library").Decimal;
        subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
        tax: import("src/generated/tenant-client/runtime/library").Decimal;
        discount: import("src/generated/tenant-client/runtime/library").Decimal;
        saleNumber: string;
        userId: string;
        customerId: string | null;
    }>;
    syncSalesFromImage(subdomain: string, imageUrl: string): Promise<{
        success: boolean;
        processed: any[];
    }>;
    updateSaleStatus(subdomain: string, id: string, status: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        total: import("src/generated/tenant-client/runtime/library").Decimal;
        subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
        tax: import("src/generated/tenant-client/runtime/library").Decimal;
        discount: import("src/generated/tenant-client/runtime/library").Decimal;
        saleNumber: string;
        userId: string;
        customerId: string | null;
    }>;
    createPaymentIntent(subdomain: string, amount: number, currency?: string): Promise<{
        clientSecret: string;
    }>;
}
