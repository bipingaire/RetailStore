import { ExpenseService } from './expense.service';
export declare class ExpenseController {
    private readonly expenseService;
    constructor(expenseService: ExpenseService);
    create(subdomain: string, body: {
        expenseDate: string;
        category: string;
        amount: number;
        description?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        category: string;
        description: string | null;
        amount: import("src/generated/tenant-client/runtime/library").Decimal;
        expenseDate: Date;
    }>;
    findAll(subdomain: string): Promise<{
        id: string;
        createdAt: Date;
        category: string;
        description: string | null;
        amount: import("src/generated/tenant-client/runtime/library").Decimal;
        expenseDate: Date;
    }[]>;
}
