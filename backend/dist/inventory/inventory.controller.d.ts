import { InventoryService } from './inventory.service';
import { CreateStockMovementDto } from './dto/stock-movement.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    createMovement(req: any, dto: CreateStockMovementDto): Promise<any>;
    getMovements(req: any, productId?: string, movementType?: string): Promise<any>;
    getHealthMetrics(req: any): Promise<{
        totalProducts: any;
        lowStock: any;
        outOfStock: any;
        slowMoving: any;
        fastMoving: any;
        nearExpiry: any;
        lowStockProducts: any;
        nearExpiryProducts: any;
    }>;
    getLowStock(req: any): Promise<any>;
}
