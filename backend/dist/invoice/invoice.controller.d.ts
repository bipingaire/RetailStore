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
        message: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        vendorId: string;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        invoiceNumber: string;
        invoiceDate: Date;
        fileUrl: string | null;
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
            isActive: boolean;
            name: string;
            email: string | null;
            phone: string | null;
            address: string | null;
            contactPerson: string | null;
        };
        items: {
            id: string;
            productId: string;
            quantity: number;
            invoiceId: string;
            unitCost: import("src/generated/tenant-client/runtime/library").Decimal;
            totalCost: import("src/generated/tenant-client/runtime/library").Decimal;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        vendorId: string;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        invoiceNumber: string;
        invoiceDate: Date;
        fileUrl: string | null;
    })[]>;
    getInvoice(subdomain: string, id: string): Promise<{
        vendor: {
            id: string;
            isActive: boolean;
            name: string;
            email: string | null;
            phone: string | null;
            address: string | null;
            contactPerson: string | null;
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
            invoiceId: string;
            unitCost: import("src/generated/tenant-client/runtime/library").Decimal;
            totalCost: import("src/generated/tenant-client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        vendorId: string;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        invoiceNumber: string;
        invoiceDate: Date;
        fileUrl: string | null;
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
            isActive: boolean;
            name: string;
            email: string | null;
            phone: string | null;
            address: string | null;
            contactPerson: string | null;
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
            invoiceId: string;
            unitCost: import("src/generated/tenant-client/runtime/library").Decimal;
            totalCost: import("src/generated/tenant-client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        vendorId: string;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        invoiceNumber: string;
        invoiceDate: Date;
        fileUrl: string | null;
    }>;
}
