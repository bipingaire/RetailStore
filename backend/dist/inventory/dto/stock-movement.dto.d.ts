export declare class CreateStockMovementDto {
    productId: string;
    movementType: 'IN' | 'OUT' | 'ADJUSTMENT' | 'LOSS';
    quantity: number;
    reason?: string;
    notes?: string;
    createdBy?: string;
    invoiceId?: string;
    saleId?: string;
}
export declare class UploadInvoiceDto {
    file: any;
    vendorName?: string;
}
