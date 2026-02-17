export declare class CreateProductDto {
    name: string;
    barcode?: string;
    sku: string;
    category: string;
    description?: string;
    costPrice: number;
    sellingPrice: number;
    stock: number;
    reorderLevel: number;
}
export declare class UpdateProductDto {
    name?: string;
    barcode?: string;
    category?: string;
    description?: string;
    costPrice?: number;
    sellingPrice?: number;
    reorderLevel?: number;
}
