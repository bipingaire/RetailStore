import { InvoiceService } from './invoice.service';
export declare class InvoiceController {
    private readonly invoiceService;
    constructor(invoiceService: InvoiceService);
    uploadInvoice(file: Express.Multer.File, body: {
        vendorId: string;
        invoiceNumber: string;
        invoiceDate: string;
        totalAmount: string;
    }): Promise<any>;
    parseInvoice(file: Express.Multer.File): Promise<{
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
    getAllInvoices(status?: string): Promise<any>;
    getInvoice(id: string): Promise<any>;
    addItems(id: string, body: {
        items: Array<{
            productId: string;
            quantity: number;
            unitCost: number;
        }>;
    }): Promise<any>;
    commitInvoice(id: string): Promise<any>;
}
