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
    findAll(subdomain: string, status?: string, startDate?: string, endDate?: string, userId?: string, customerId?: string, limit?: string, offset?: string): Promise<({
        customer: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            email: string | null;
            phone: string | null;
            loyaltyPoints: number;
        };
        items: ({
            product: {
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
    getStats(subdomain: string, startDate?: string, endDate?: string): Promise<{
        totalSales: number;
        totalRevenue: number;
    }>;
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
    cancel(subdomain: string, id: string, req: any): Promise<{
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
    updateStatus(subdomain: string, id: string, body: {
        status: string;
    }): Promise<{
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
