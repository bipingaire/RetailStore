declare class SaleItemDto {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    tax?: number;
    subtotal: number;
}
export declare class CreateSaleDto {
    items: SaleItemDto[];
    subtotal: number;
    discount?: number;
    discountType?: 'AMOUNT' | 'PERCENTAGE';
    tax?: number;
    taxRate?: number;
    total: number;
    amountPaid: number;
    change?: number;
    paymentMethod: 'CASH' | 'CARD' | 'MOBILE_MONEY' | 'BANK_TRANSFER';
    notes?: string;
    customerId?: string;
}
export {};
