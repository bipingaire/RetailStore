import { ReconciliationService } from './reconciliation.service';
export declare class ReconciliationController {
    private readonly reconciliationService;
    constructor(reconciliationService: ReconciliationService);
    create(req: any, body: {
        createdBy?: string;
    }): Promise<any>;
    findAll(req: any): Promise<any>;
    findOne(req: any, id: string): Promise<any>;
    updateItem(req: any, id: string, body: {
        productId: string;
        physicalCount: number;
        reason?: string;
        notes?: string;
    }): Promise<any>;
    complete(req: any, id: string): Promise<any>;
}
