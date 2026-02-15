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
        createdAt: Date;
    }>;
    getReports(subdomain: string, period?: string): Promise<{
        id: string;
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
        createdAt: Date;
    }[]>;
    getTrends(subdomain: string, days?: string): Promise<{
        id: string;
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
        createdAt: Date;
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
        amount: import("dist/generated/tenant-client/runtime/library").Decimal;
        description: string | null;
        expenseDate: Date;
    }>;
    getExpenses(subdomain: string, query: {
        startDate?: string;
        endDate?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        category: string;
        amount: import("dist/generated/tenant-client/runtime/library").Decimal;
        description: string | null;
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
