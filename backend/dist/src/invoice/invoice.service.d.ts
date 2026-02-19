import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { TenantService } from '../tenant/tenant.service';
import { Prisma } from '../generated/tenant-client';
export declare class InvoiceService {
    private readonly tenantPrisma;
    private readonly tenantService;
    constructor(tenantPrisma: TenantPrismaService, tenantService: TenantService);
    uploadInvoice(subdomain: string, vendorId: string, invoiceNumber: string, invoiceDate: Date, totalAmount: number, items: Array<{
        description: string;
        category: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
        expiryDate?: string;
    }>, fileUrl?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        vendorId: string;
        totalAmount: Prisma.Decimal;
        invoiceNumber: string;
        invoiceDate: Date;
        fileUrl: string | null;
    }>;
    getInvoice(subdomain: string, id: string): Promise<{
        vendor: {
            email: string | null;
            name: string;
            id: string;
            isActive: boolean;
            phone: string | null;
            address: string | null;
            contactPerson: string | null;
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
                price: Prisma.Decimal;
                costPrice: Prisma.Decimal;
                stock: number;
                reorderLevel: number;
                barcode: string | null;
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            invoiceId: string;
            unitCost: Prisma.Decimal;
            totalCost: Prisma.Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        vendorId: string;
        totalAmount: Prisma.Decimal;
        invoiceNumber: string;
        invoiceDate: Date;
        fileUrl: string | null;
    }>;
    getAllInvoices(subdomain: string, status?: string): Promise<({
        vendor: {
            email: string | null;
            name: string;
            id: string;
            isActive: boolean;
            phone: string | null;
            address: string | null;
            contactPerson: string | null;
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
                price: Prisma.Decimal;
                costPrice: Prisma.Decimal;
                stock: number;
                reorderLevel: number;
                barcode: string | null;
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            invoiceId: string;
            unitCost: Prisma.Decimal;
            totalCost: Prisma.Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        vendorId: string;
        totalAmount: Prisma.Decimal;
        invoiceNumber: string;
        invoiceDate: Date;
        fileUrl: string | null;
    })[]>;
    addInvoiceItems(subdomain: string, invoiceId: string, items: Array<{
        productId: string;
        quantity: number;
        unitCost: number;
    }>): Promise<Prisma.BatchPayload>;
    commitInvoice(subdomain: string, invoiceId: string): Promise<{
        vendor: {
            email: string | null;
            name: string;
            id: string;
            isActive: boolean;
            phone: string | null;
            address: string | null;
            contactPerson: string | null;
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
                price: Prisma.Decimal;
                costPrice: Prisma.Decimal;
                stock: number;
                reorderLevel: number;
                barcode: string | null;
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            invoiceId: string;
            unitCost: Prisma.Decimal;
            totalCost: Prisma.Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        vendorId: string;
        totalAmount: Prisma.Decimal;
        invoiceNumber: string;
        invoiceDate: Date;
        fileUrl: string | null;
    }>;
    parseInvoiceOCR(fileUrl: string): Promise<{
        vendorName: any;
        invoiceNumber: any;
        invoiceDate: Date;
        totalAmount: number;
        items: any;
    }>;
    private getMockInvoiceData;
}
