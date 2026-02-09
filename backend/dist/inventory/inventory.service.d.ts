import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { CreateStockMovementDto } from './dto/stock-movement.dto';
export declare class InventoryService {
    private prisma;
    constructor(prisma: TenantPrismaService);
    createMovement(tenantId: string, dto: CreateStockMovementDto): Promise<any>;
    getMovements(tenantId: string, productId?: string, movementType?: string): Promise<any>;
    getHealthMetrics(tenantId: string): Promise<{
        totalProducts: any;
        lowStock: any;
        outOfStock: any;
        slowMoving: any;
        fastMoving: any;
        nearExpiry: any;
        lowStockProducts: any;
        nearExpiryProducts: any;
    }>;
    getLowStock(tenantId: string): Promise<any>;
    calculateHealthScore(tenantId: string, productId: string): Promise<number>;
}
