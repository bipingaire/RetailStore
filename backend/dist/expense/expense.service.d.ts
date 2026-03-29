import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { TenantService } from '../tenant/tenant.service';
export declare class ExpenseService {
    private readonly tenantPrisma;
    private readonly tenantService;
    constructor(tenantPrisma: TenantPrismaService, tenantService: TenantService);
    createExpense(subdomain: string, data: {
        expenseDate: string;
        category: string;
        amount: number;
        description?: string;
    }): Promise<{
        category: string;
        description: string | null;
        id: string;
        createdAt: Date;
        amount: import("src/generated/tenant-client/runtime/library").Decimal;
        expenseDate: Date;
    }>;
    getExpenses(subdomain: string): Promise<{
        category: string;
        description: string | null;
        id: string;
        createdAt: Date;
        amount: import("src/generated/tenant-client/runtime/library").Decimal;
        expenseDate: Date;
    }[]>;
}
