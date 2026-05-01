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
        saleNumber: string;
        subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
        tax: import("src/generated/tenant-client/runtime/library").Decimal;
        discount: import("src/generated/tenant-client/runtime/library").Decimal;
        paymentMethod: string;
        paymentStatus: string;
        userId: string;
        customerId: string | null;
        zReportId: string | null;
    }>;
    findMyOrders(subdomain: string, userId: string): Promise<({
        items: ({
            product: {
                category: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                sku: string;
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
        saleNumber: string;
        subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
        tax: import("src/generated/tenant-client/runtime/library").Decimal;
        discount: import("src/generated/tenant-client/runtime/library").Decimal;
        paymentMethod: string;
        paymentStatus: string;
        userId: string;
        customerId: string | null;
        zReportId: string | null;
    })[]>;
    findAll(subdomain: string, options?: {
        status?: string;
        startDate?: string;
        endDate?: string;
        userId?: string;
        customerId?: string;
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<({
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
                category: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                sku: string;
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
        saleNumber: string;
        subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
        tax: import("src/generated/tenant-client/runtime/library").Decimal;
        discount: import("src/generated/tenant-client/runtime/library").Decimal;
        paymentMethod: string;
        paymentStatus: string;
        userId: string;
        customerId: string | null;
        zReportId: string | null;
    })[] | import("../common/pagination.dto").PaginatedResponse<{
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
                category: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                sku: string;
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
        saleNumber: string;
        subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
        tax: import("src/generated/tenant-client/runtime/library").Decimal;
        discount: import("src/generated/tenant-client/runtime/library").Decimal;
        paymentMethod: string;
        paymentStatus: string;
        userId: string;
        customerId: string | null;
        zReportId: string | null;
    }>>;
    findOne(subdomain: string, id: string): Promise<{
        items: ({
            product: {
                category: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                sku: string;
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
        saleNumber: string;
        subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
        tax: import("src/generated/tenant-client/runtime/library").Decimal;
        discount: import("src/generated/tenant-client/runtime/library").Decimal;
        paymentMethod: string;
        paymentStatus: string;
        userId: string;
        customerId: string | null;
        zReportId: string | null;
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
        saleNumber: string;
        subtotal: import("src/generated/tenant-client/runtime/library").Decimal;
        tax: import("src/generated/tenant-client/runtime/library").Decimal;
        discount: import("src/generated/tenant-client/runtime/library").Decimal;
        paymentMethod: string;
        paymentStatus: string;
        userId: string;
        customerId: string | null;
        zReportId: string | null;
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
