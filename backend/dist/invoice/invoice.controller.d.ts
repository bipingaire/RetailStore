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
        status: string;
        vendorId: string;
        invoiceNumber: string;
        invoiceDate: Date;
        totalAmount: import("dist/generated/tenant-client/runtime/library").Decimal;
        fileUrl: string | null;
        updatedAt: Date;
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
        items: {
            id: string;
            productId: string;
            quantity: number;
            invoiceId: string;
            unitCost: import("dist/generated/tenant-client/runtime/library").Decimal;
            totalCost: import("dist/generated/tenant-client/runtime/library").Decimal;
        }[];
        vendor: {
            id: string;
            name: string;
            isActive: boolean;
            email: string | null;
            phone: string | null;
            contactPerson: string | null;
            address: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        status: string;
        vendorId: string;
        invoiceNumber: string;
        invoiceDate: Date;
        totalAmount: import("dist/generated/tenant-client/runtime/library").Decimal;
        fileUrl: string | null;
        updatedAt: Date;
    })[]>;
    getInvoice(subdomain: string, id: string): Promise<{
        items: ({
            product: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                category: string | null;
                description: string | null;
                sku: string;
                price: import("dist/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("dist/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                imageUrl: string | null;
                barcode: string | null;
                isActive: boolean;
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            invoiceId: string;
            unitCost: import("dist/generated/tenant-client/runtime/library").Decimal;
            totalCost: import("dist/generated/tenant-client/runtime/library").Decimal;
        })[];
        vendor: {
            id: string;
            name: string;
            isActive: boolean;
            email: string | null;
            phone: string | null;
            contactPerson: string | null;
            address: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        status: string;
        vendorId: string;
        invoiceNumber: string;
        invoiceDate: Date;
        totalAmount: import("dist/generated/tenant-client/runtime/library").Decimal;
        fileUrl: string | null;
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
        items: ({
            product: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                category: string | null;
                description: string | null;
                sku: string;
                price: import("dist/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("dist/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                imageUrl: string | null;
                barcode: string | null;
                isActive: boolean;
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            invoiceId: string;
            unitCost: import("dist/generated/tenant-client/runtime/library").Decimal;
            totalCost: import("dist/generated/tenant-client/runtime/library").Decimal;
        })[];
        vendor: {
            id: string;
            name: string;
            isActive: boolean;
            email: string | null;
            phone: string | null;
            contactPerson: string | null;
            address: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        status: string;
        vendorId: string;
        invoiceNumber: string;
        invoiceDate: Date;
        totalAmount: import("dist/generated/tenant-client/runtime/library").Decimal;
        fileUrl: string | null;
        updatedAt: Date;
    }>;
}
