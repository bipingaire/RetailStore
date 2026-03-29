import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
export declare class SaleController {
    private saleService;
    constructor(saleService: SaleService);
    create(subdomain: string, req: any, dto: CreateSaleDto): Promise<{
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
    findMyOrders(subdomain: string, req: any): Promise<({
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
    findAll(subdomain: string, status?: string, startDate?: string, endDate?: string, userId?: string, customerId?: string, limit?: string, offset?: string): Promise<({
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
    getStats(subdomain: string, startDate?: string, endDate?: string): Promise<{
        totalSales: number;
        totalRevenue: number;
    }>;
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
    cancel(subdomain: string, id: string, req: any): Promise<{
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
    updateStatus(subdomain: string, id: string, body: {
        status: string;
    }): Promise<{
        success: boolean;
        id: string;
        status: string;
    }>;
    updatePaymentStatus(subdomain: string, id: string, body: {
        paymentStatus: string;
    }): Promise<{
        success: boolean;
        id: string;
        paymentStatus: string;
    }>;
    createPaymentIntent(subdomain: string, body: {
        amount: number;
        currency?: string;
    }): Promise<{
        clientSecret: string;
    }>;
    syncSalesFromImage(subdomain: string, body: {
        imageUrl: string;
    }): Promise<{
        success: boolean;
        processed: any[];
    }>;
}
