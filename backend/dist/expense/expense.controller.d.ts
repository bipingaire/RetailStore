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
        category: string;
        id: string;
        createdAt: Date;
        description: string | null;
        amount: import("src/generated/tenant-client/runtime/library").Decimal;
        expenseDate: Date;
    }>;
    findAll(subdomain: string, page?: string, limit?: string, search?: string, category?: string, startDate?: string, endDate?: string): Promise<{
        category: string;
        id: string;
        createdAt: Date;
        description: string | null;
        amount: import("src/generated/tenant-client/runtime/library").Decimal;
        expenseDate: Date;
    }[] | import("../common/pagination.dto").PaginatedResponse<{
        category: string;
        id: string;
        createdAt: Date;
        description: string | null;
        amount: import("src/generated/tenant-client/runtime/library").Decimal;
        expenseDate: Date;
    }>>;
}
