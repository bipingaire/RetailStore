import { TenantPrismaService } from '../prisma/tenant-prisma.service';
export declare class AuditService {
    private readonly prisma;
    constructor(prisma: TenantPrismaService);
    startAuditSession(userId: string, notes?: string): Promise<any>;
    addAuditCount(sessionId: string, productId: string, countedQuantity: number, reason?: string): Promise<any>;
    completeAuditSession(sessionId: string): Promise<any>;
    getAuditSession(id: string): Promise<any>;
    getAllAuditSessions(): Promise<any>;
    getVarianceReport(): Promise<any>;
}
