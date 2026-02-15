import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
export declare class SaleController {
    private saleService;
    constructor(saleService: SaleService);
    create(subdomain: string, req: any, dto: CreateSaleDto): Promise<{
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
    findAll(subdomain: string, status?: string, startDate?: string, endDate?: string, userId?: string, customerId?: string, limit?: string, offset?: string): Promise<({
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
    getStats(subdomain: string, startDate?: string, endDate?: string): Promise<{
        totalSales: number;
        totalRevenue: number;
    }>;
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
    cancel(subdomain: string, id: string, req: any): Promise<{
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
    updateStatus(subdomain: string, id: string, body: {
        status: string;
    }): Promise<{
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
