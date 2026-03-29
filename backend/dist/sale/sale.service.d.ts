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
            saleId: string;
            unitPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        }[];
    } & {
        id: string;
        createdAt: Date;
        status: string;
        paymentMethod: string;
        total: import("src/generated/tenant-client/runtime/library").Decimal;
        subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
        tax: import("src/generated/tenant-client/runtime/library").Decimal;
        discount: import("src/generated/tenant-client/runtime/library").Decimal;
        saleNumber: string;
        paymentStatus: string;
        userId: string;
        customerId: string | null;
    }>;
    findMyOrders(subdomain: string, userId: string): Promise<({
        items: ({
            product: {
                sku: string;
                category: string | null;
                description: string | null;
                imageUrl: string | null;
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                price: import("src/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                barcode: string | null;
                isSellable: boolean;
                parentId: string | null;
                unitsPerParent: number;
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
            saleId: string;
            unitPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        status: string;
        paymentMethod: string;
        total: import("src/generated/tenant-client/runtime/library").Decimal;
        subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
        tax: import("src/generated/tenant-client/runtime/library").Decimal;
        discount: import("src/generated/tenant-client/runtime/library").Decimal;
        saleNumber: string;
        paymentStatus: string;
        userId: string;
        customerId: string | null;
    })[]>;
    findAll(subdomain: string, options: any): Promise<({
        customer: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            phone: string | null;
            loyaltyPoints: number;
        };
        items: ({
            product: {
                sku: string;
                category: string | null;
                description: string | null;
                imageUrl: string | null;
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                price: import("src/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                barcode: string | null;
                isSellable: boolean;
                parentId: string | null;
                unitsPerParent: number;
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
            saleId: string;
            unitPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        status: string;
        paymentMethod: string;
        total: import("src/generated/tenant-client/runtime/library").Decimal;
        subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
        tax: import("src/generated/tenant-client/runtime/library").Decimal;
        discount: import("src/generated/tenant-client/runtime/library").Decimal;
        saleNumber: string;
        paymentStatus: string;
        userId: string;
        customerId: string | null;
    })[]>;
    findOne(subdomain: string, id: string): Promise<{
        items: ({
            product: {
                sku: string;
                category: string | null;
                description: string | null;
                imageUrl: string | null;
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                price: import("src/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                barcode: string | null;
                isSellable: boolean;
                parentId: string | null;
                unitsPerParent: number;
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
            saleId: string;
            unitPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        status: string;
        paymentMethod: string;
        total: import("src/generated/tenant-client/runtime/library").Decimal;
        subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
        tax: import("src/generated/tenant-client/runtime/library").Decimal;
        discount: import("src/generated/tenant-client/runtime/library").Decimal;
        saleNumber: string;
        paymentStatus: string;
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
        paymentMethod: string;
        total: import("src/generated/tenant-client/runtime/library").Decimal;
        subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
        tax: import("src/generated/tenant-client/runtime/library").Decimal;
        discount: import("src/generated/tenant-client/runtime/library").Decimal;
        saleNumber: string;
        paymentStatus: string;
        userId: string;
        customerId: string | null;
    }>;
    syncSalesFromImage(subdomain: string, imageUrl: string): Promise<{
        success: boolean;
        processed: any[];
    }>;
    createPaymentIntent(subdomain: string, amount: number, currency?: string): Promise<{
        clientSecret: string;
    }>;
    updateSaleStatus(subdomain: string, saleId: string, status: string): Promise<{
        success: boolean;
        id: string;
        status: string;
    }>;
    updatePaymentStatus(subdomain: string, saleId: string, paymentStatus: string): Promise<{
        success: boolean;
        id: string;
        paymentStatus: string;
    }>;
}
