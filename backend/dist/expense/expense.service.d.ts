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
        id: string;
        createdAt: Date;
        description: string | null;
        amount: import("src/generated/tenant-client/runtime/library").Decimal;
        expenseDate: Date;
    }>;
    getExpenses(subdomain: string, options?: {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<{
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
