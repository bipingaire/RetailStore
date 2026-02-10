import { PurchaseOrderService } from './purchase-order.service';
export declare class PurchaseOrderController {
    private readonly purchaseOrderService;
    constructor(purchaseOrderService: PurchaseOrderService);
    create(body: {
        vendorId: string;
        items: Array<{
            productId: string;
            quantity: number;
            unitCost: number;
        }>;
        notes?: string;
    }): Promise<any>;
    getAll(status?: string): Promise<any>;
    getOne(id: string): Promise<any>;
    updateStatus(id: string, body: {
        status: string;
    }): Promise<any>;
    send(id: string): Promise<any>;
    receive(id: string): Promise<any>;
}
