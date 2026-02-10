import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    startSession(body: {
        userId: string;
        notes?: string;
    }): Promise<any>;
    addCount(id: string, body: {
        productId: string;
        countedQuantity: number;
        reason?: string;
    }): Promise<any>;
    completeSession(id: string): Promise<any>;
    getSession(id: string): Promise<any>;
    getAllSessions(): Promise<any>;
    getVariances(): Promise<any>;
}
