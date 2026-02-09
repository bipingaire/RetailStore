import { TenantPrismaService } from '../prisma/tenant-prisma.service';
export declare class ReconciliationService {
    private prisma;
    constructor(prisma: TenantPrismaService);
    create(tenantId: string, createdBy?: string): Promise<any>;
    findAll(tenantId: string): Promise<any>;
    findOne(tenantId: string, id: string): Promise<any>;
    updateItem(tenantId: string, reconciliationId: string, productId: string, physicalCount: number, reason?: string, notes?: string): Promise<any>;
    complete(tenantId: string, id: string): Promise<any>;
}
