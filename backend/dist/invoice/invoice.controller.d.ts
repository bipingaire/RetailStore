import { InvoiceService } from './invoice.service';
export declare class InvoiceController {
    private readonly invoiceService;
    constructor(invoiceService: InvoiceService);
    uploadInvoice(subdomain: string, file: any, body: {
        vendorId: string;
        invoiceNumber: string;
        invoiceDate: string;
        totalAmount: string;
        items?: string;
    }): Promise<{
        id: string;
        vendorId: string;
        invoiceNumber: string;
        invoiceDate: string;
        totalAmount: number;
        fileUrl: string;
        items: any[];
        status: string;
        message: string;
    }>;
    testEndpoint(): {
        success: boolean;
        message: string;
    };
    parseInvoice(file: any): Promise<{
        vendorName: any;
        invoiceNumber: any;
        invoiceDate: Date;
        totalAmount: number;
        items: any;
    }>;
    getAllInvoices(subdomain: string, status?: string): Promise<({
        vendor: {
            id: string;
            name: string;
            contactPerson: string | null;
            email: string | null;
            phone: string | null;
            address: string | null;
            isActive: boolean;
        };
        items: {
            id: string;
            invoiceId: string;
            productId: string;
            quantity: number;
            unitCost: import("src/generated/tenant-client/runtime/library").Decimal;
            totalCost: import("src/generated/tenant-client/runtime/library").Decimal;
        }[];
    } & {
        id: string;
        vendorId: string;
        invoiceNumber: string;
        invoiceDate: Date;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        fileUrl: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getInvoice(subdomain: string, id: string): Promise<{
        vendor: {
            id: string;
            name: string;
            contactPerson: string | null;
            email: string | null;
            phone: string | null;
            address: string | null;
            isActive: boolean;
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
            };
        } & {
            id: string;
            invoiceId: string;
            productId: string;
            quantity: number;
            unitCost: import("src/generated/tenant-client/runtime/library").Decimal;
            totalCost: import("src/generated/tenant-client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        vendorId: string;
        invoiceNumber: string;
        invoiceDate: Date;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        fileUrl: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addItems(subdomain: string, id: string, body: {
        items: Array<{
            productId: string;
            quantity: number;
            unitCost: number;
        }>;
    }): Promise<import("src/generated/tenant-client").Prisma.BatchPayload>;
    commitInvoice(subdomain: string, id: string): Promise<{
        vendor: {
            id: string;
            name: string;
            contactPerson: string | null;
            email: string | null;
            phone: string | null;
            address: string | null;
            isActive: boolean;
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
            };
        } & {
            id: string;
            invoiceId: string;
            productId: string;
            quantity: number;
            unitCost: import("src/generated/tenant-client/runtime/library").Decimal;
            totalCost: import("src/generated/tenant-client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        vendorId: string;
        invoiceNumber: string;
        invoiceDate: Date;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        fileUrl: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
