import { VendorService } from './vendor.service';
export declare class VendorController {
    private vendorService;
    constructor(vendorService: VendorService);
    findAll(subdomain: string): Promise<{
        id: string;
        name: string;
        'contact-phone': string;
        email: string;
        address: string;
        'poc-name': string;
        'reliability-score': number;
    }[]>;
    findInvoices(subdomain: string): Promise<{
        'invoice-id': string;
        'invoice-number': any;
        'invoice-date': Date;
        'total-amount-value': import("src/generated/tenant-client/runtime/library").Decimal;
        'processing-status': string;
        'supplier-name': string;
    }[]>;
}
