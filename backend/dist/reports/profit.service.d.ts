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
        revenue: import("src/generated/tenant-client/runtime/library").Decimal;
        cogs: import("src/generated/tenant-client/runtime/library").Decimal;
        grossProfit: import("src/generated/tenant-client/runtime/library").Decimal;
        grossMargin: import("src/generated/tenant-client/runtime/library").Decimal;
        expenses: import("src/generated/tenant-client/runtime/library").Decimal;
        netProfit: import("src/generated/tenant-client/runtime/library").Decimal;
        metadata: import("src/generated/tenant-client/runtime/library").JsonValue | null;
    }>;
    getProfitReports(subdomain: string, period?: string): Promise<{
        id: string;
        createdAt: Date;
        period: string;
        startDate: Date;
        endDate: Date;
        revenue: import("src/generated/tenant-client/runtime/library").Decimal;
        cogs: import("src/generated/tenant-client/runtime/library").Decimal;
        grossProfit: import("src/generated/tenant-client/runtime/library").Decimal;
        grossMargin: import("src/generated/tenant-client/runtime/library").Decimal;
        expenses: import("src/generated/tenant-client/runtime/library").Decimal;
        netProfit: import("src/generated/tenant-client/runtime/library").Decimal;
        metadata: import("src/generated/tenant-client/runtime/library").JsonValue | null;
    }[]>;
    getProfitTrends(subdomain: string, days?: number): Promise<{
        id: string;
        createdAt: Date;
        period: string;
        startDate: Date;
        endDate: Date;
        revenue: import("src/generated/tenant-client/runtime/library").Decimal;
        cogs: import("src/generated/tenant-client/runtime/library").Decimal;
        grossProfit: import("src/generated/tenant-client/runtime/library").Decimal;
        grossMargin: import("src/generated/tenant-client/runtime/library").Decimal;
        expenses: import("src/generated/tenant-client/runtime/library").Decimal;
        netProfit: import("src/generated/tenant-client/runtime/library").Decimal;
        metadata: import("src/generated/tenant-client/runtime/library").JsonValue | null;
    }[]>;
    getCategoryBreakdown(subdomain: string, startDate: Date, endDate: Date): Promise<{
        revenue: number;
        count: number;
        category: string;
    }[]>;
    addExpense(subdomain: string, category: string, amount: number, description?: string, expenseDate?: Date): Promise<{
        id: string;
        createdAt: Date;
        category: string;
        description: string | null;
        amount: import("src/generated/tenant-client/runtime/library").Decimal;
        expenseDate: Date;
    }>;
    getExpenses(subdomain: string, startDate?: Date, endDate?: Date): Promise<{
        id: string;
        createdAt: Date;
        category: string;
        description: string | null;
        amount: import("src/generated/tenant-client/runtime/library").Decimal;
        expenseDate: Date;
    }[]>;
    getDashboardStats(subdomain: string): Promise<{
        revenue: number;
        pendingOrders: number;
        lowStock: number;
        activeCampaigns: number;
        recentOrders: {
            id: string;
            orderNumber: string;
            customer: string;
            amount: number;
            status: string;
            date: Date;
        }[];
    }>;
}
