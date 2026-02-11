import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { TenantService } from '../tenant/tenant.service';
export declare class ProfitService {
    private readonly tenantPrisma;
    private readonly tenantService;
    constructor(tenantPrisma: TenantPrismaService, tenantService: TenantService);
    calculateProfit(subdomain: string, startDate: Date, endDate: Date, period: 'daily' | 'weekly' | 'monthly'): Promise<{
        id: string;
        createdAt: Date;
        period: string;
        startDate: Date;
        endDate: Date;
        revenue: import("dist/generated/tenant-client/runtime/library").Decimal;
        cogs: import("dist/generated/tenant-client/runtime/library").Decimal;
        grossProfit: import("dist/generated/tenant-client/runtime/library").Decimal;
        grossMargin: import("dist/generated/tenant-client/runtime/library").Decimal;
        expenses: import("dist/generated/tenant-client/runtime/library").Decimal;
        netProfit: import("dist/generated/tenant-client/runtime/library").Decimal;
        metadata: import("dist/generated/tenant-client/runtime/library").JsonValue | null;
    }>;
    getProfitReports(subdomain: string, period?: string): Promise<{
        id: string;
        createdAt: Date;
        period: string;
        startDate: Date;
        endDate: Date;
        revenue: import("dist/generated/tenant-client/runtime/library").Decimal;
        cogs: import("dist/generated/tenant-client/runtime/library").Decimal;
        grossProfit: import("dist/generated/tenant-client/runtime/library").Decimal;
        grossMargin: import("dist/generated/tenant-client/runtime/library").Decimal;
        expenses: import("dist/generated/tenant-client/runtime/library").Decimal;
        netProfit: import("dist/generated/tenant-client/runtime/library").Decimal;
        metadata: import("dist/generated/tenant-client/runtime/library").JsonValue | null;
    }[]>;
    getProfitTrends(subdomain: string, days?: number): Promise<{
        id: string;
        createdAt: Date;
        period: string;
        startDate: Date;
        endDate: Date;
        revenue: import("dist/generated/tenant-client/runtime/library").Decimal;
        cogs: import("dist/generated/tenant-client/runtime/library").Decimal;
        grossProfit: import("dist/generated/tenant-client/runtime/library").Decimal;
        grossMargin: import("dist/generated/tenant-client/runtime/library").Decimal;
        expenses: import("dist/generated/tenant-client/runtime/library").Decimal;
        netProfit: import("dist/generated/tenant-client/runtime/library").Decimal;
        metadata: import("dist/generated/tenant-client/runtime/library").JsonValue | null;
    }[]>;
    getCategoryBreakdown(subdomain: string, startDate: Date, endDate: Date): Promise<{
        revenue: number;
        count: number;
        category: string;
    }[]>;
    addExpense(subdomain: string, category: string, amount: number, description?: string, expenseDate?: Date): Promise<{
        id: string;
        category: string;
        description: string | null;
        createdAt: Date;
        amount: import("dist/generated/tenant-client/runtime/library").Decimal;
        expenseDate: Date;
    }>;
    getExpenses(subdomain: string, startDate?: Date, endDate?: Date): Promise<{
        id: string;
        category: string;
        description: string | null;
        createdAt: Date;
        amount: import("dist/generated/tenant-client/runtime/library").Decimal;
        expenseDate: Date;
    }[]>;
}
