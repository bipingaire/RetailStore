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
            subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
            unitPrice: import("src/generated/tenant-client/runtime/library").Decimal;
            saleId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        status: string;
        saleNumber: string;
        subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
        tax: import("src/generated/tenant-client/runtime/library").Decimal;
        discount: import("src/generated/tenant-client/runtime/library").Decimal;
        total: import("src/generated/tenant-client/runtime/library").Decimal;
        userId: string;
        customerId: string | null;
    }>;
    findMyOrders(subdomain: string, userId: string): Promise<({
        items: ({
            product: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                sku: string;
                category: string | null;
                description: string | null;
                imageUrl: string | null;
                price: import("src/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                barcode: string | null;
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
            unitPrice: import("src/generated/tenant-client/runtime/library").Decimal;
            saleId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        status: string;
        saleNumber: string;
        subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
        tax: import("src/generated/tenant-client/runtime/library").Decimal;
        discount: import("src/generated/tenant-client/runtime/library").Decimal;
        total: import("src/generated/tenant-client/runtime/library").Decimal;
        userId: string;
        customerId: string | null;
    })[]>;
    findAll(subdomain: string, options: any): Promise<({
        customer: {
            email: string | null;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            phone: string | null;
            loyaltyPoints: number;
        };
        items: ({
            product: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                sku: string;
                category: string | null;
                description: string | null;
                imageUrl: string | null;
                price: import("src/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                barcode: string | null;
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
            unitPrice: import("src/generated/tenant-client/runtime/library").Decimal;
            saleId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        status: string;
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
            productId: string;
            quantity: number;
            subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
            unitPrice: import("src/generated/tenant-client/runtime/library").Decimal;
            saleId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        status: string;
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
        createdAt: Date;
        status: string;
        saleNumber: string;
        subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
        tax: import("src/generated/tenant-client/runtime/library").Decimal;
        discount: import("src/generated/tenant-client/runtime/library").Decimal;
        total: import("src/generated/tenant-client/runtime/library").Decimal;
        userId: string;
        customerId: string | null;
    }>;
    syncSalesFromImage(subdomain: string, imageUrl: string): Promise<{
        success: boolean;
        processed: any[];
    }>;
    updateSaleStatus(subdomain: string, id: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        saleNumber: string;
        subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
        tax: import("src/generated/tenant-client/runtime/library").Decimal;
        discount: import("src/generated/tenant-client/runtime/library").Decimal;
        total: import("src/generated/tenant-client/runtime/library").Decimal;
        userId: string;
        customerId: string | null;
    }>;
    createPaymentIntent(subdomain: string, amount: number, currency?: string): Promise<{
        clientSecret: string;
    }>;
}
