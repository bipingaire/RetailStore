export class CreateStockMovementDto {
    productId: string;
    movementType: 'IN' | 'OUT' | 'ADJUSTMENT' | 'LOSS';
    quantity: number;
    reason?: string;
    notes?: string;
    createdBy?: string;
    invoiceId?: string;
    saleId?: string;
}

export class UploadInvoiceDto {
    file: any; // Multer file
    vendorName?: string;
}
