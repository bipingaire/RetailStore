import { ProfitService } from './profit.service';
export declare class ProfitController {
    private readonly profitService;
    constructor(profitService: ProfitService);
    calculate(subdomain: string, body: {
        startDate: string;
        endDate: string;
        period: 'daily' | 'weekly' | 'monthly';
    }): Promise<{
        id: string;
        createdAt: Date;
        startDate: Date;
        endDate: Date;
        period: string;
        revenue: import("src/generated/tenant-client/runtime/library").Decimal;
        cogs: import("src/generated/tenant-client/runtime/library").Decimal;
        grossProfit: import("src/generated/tenant-client/runtime/library").Decimal;
        grossMargin: import("src/generated/tenant-client/runtime/library").Decimal;
        expenses: import("src/generated/tenant-client/runtime/library").Decimal;
        netProfit: import("src/generated/tenant-client/runtime/library").Decimal;
        metadata: import("src/generated/tenant-client/runtime/library").JsonValue | null;
    }>;
    getReports(subdomain: string, period?: string): Promise<{
        id: string;
        createdAt: Date;
        startDate: Date;
        endDate: Date;
        period: string;
        revenue: import("src/generated/tenant-client/runtime/library").Decimal;
        cogs: import("src/generated/tenant-client/runtime/library").Decimal;
        grossProfit: import("src/generated/tenant-client/runtime/library").Decimal;
        grossMargin: import("src/generated/tenant-client/runtime/library").Decimal;
        expenses: import("src/generated/tenant-client/runtime/library").Decimal;
        netProfit: import("src/generated/tenant-client/runtime/library").Decimal;
        metadata: import("src/generated/tenant-client/runtime/library").JsonValue | null;
    }[]>;
    getTrends(subdomain: string, days?: string): Promise<{
        id: string;
        createdAt: Date;
        startDate: Date;
        endDate: Date;
        period: string;
        revenue: import("src/generated/tenant-client/runtime/library").Decimal;
        cogs: import("src/generated/tenant-client/runtime/library").Decimal;
        grossProfit: import("src/generated/tenant-client/runtime/library").Decimal;
        grossMargin: import("src/generated/tenant-client/runtime/library").Decimal;
        expenses: import("src/generated/tenant-client/runtime/library").Decimal;
        netProfit: import("src/generated/tenant-client/runtime/library").Decimal;
        metadata: import("src/generated/tenant-client/runtime/library").JsonValue | null;
    }[]>;
    getCategoryBreakdown(subdomain: string, query: {
        startDate: string;
        endDate: string;
    }): Promise<{
        revenue: number;
        count: number;
        category: string;
    }[]>;
    addExpense(subdomain: string, body: {
        category: string;
        amount: number;
        description?: string;
        expenseDate?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        category: string;
        description: string | null;
        amount: import("src/generated/tenant-client/runtime/library").Decimal;
        expenseDate: Date;
    }>;
    getExpenses(subdomain: string, query: {
        startDate?: string;
        endDate?: string;
    }): Promise<{
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
