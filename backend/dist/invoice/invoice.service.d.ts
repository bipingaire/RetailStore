import { TenantPrismaService } from '../prisma/tenant-prisma.service';
export declare class InvoiceService {
    private readonly prisma;
    constructor(prisma: TenantPrismaService);
    uploadInvoice(vendorId: string, invoiceNumber: string, invoiceDate: Date, totalAmount: number, fileUrl?: string): Promise<any>;
    getInvoice(id: string): Promise<any>;
    getAllInvoices(status?: string): Promise<any>;
    addInvoiceItems(invoiceId: string, items: Array<{
        productId: string;
        quantity: number;
        unitCost: number;
    }>): Promise<any>;
    commitInvoice(invoiceId: string): Promise<any>;
    parseInvoiceOCR(fileUrl: string): Promise<{
        vendorName: string;
        invoiceNumber: string;
        invoiceDate: Date;
        items: {
            description: string;
            quantity: number;
            unitPrice: number;
            totalPrice: number;
        }[];
        totalAmount: number;
    }>;
}
