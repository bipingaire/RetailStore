import { TenantPrismaService } from '../prisma/tenant-prisma.service';
export declare class PurchaseOrderService {
    private readonly prisma;
    constructor(prisma: TenantPrismaService);
    createPurchaseOrder(vendorId: string, items: Array<{
        productId: string;
        quantity: number;
        unitCost: number;
    }>, notes?: string): Promise<any>;
    getPurchaseOrder(id: string): Promise<any>;
    getAllPurchaseOrders(status?: string): Promise<any>;
    updateStatus(id: string, status: string): Promise<any>;
    sendPurchaseOrder(id: string): Promise<any>;
    receivePurchaseOrder(id: string): Promise<any>;
}
