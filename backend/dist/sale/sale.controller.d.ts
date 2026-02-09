import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
export declare class SaleController {
    private saleService;
    constructor(saleService: SaleService);
    create(subdomain: string, req: any, dto: CreateSaleDto): Promise<{
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
    findAll(subdomain: string, status?: string, startDate?: string, endDate?: string, userId?: string, customerId?: string, limit?: string, offset?: string): Promise<({
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
    getStats(subdomain: string, startDate?: string, endDate?: string): Promise<{
        totalSales: number;
        totalRevenue: number;
    }>;
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
    cancel(subdomain: string, id: string, req: any): Promise<{
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
}
