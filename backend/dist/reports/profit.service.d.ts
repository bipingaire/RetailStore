import { TenantPrismaService } from '../prisma/tenant-prisma.service';
export declare class ProfitService {
    private readonly prisma;
    constructor(prisma: TenantPrismaService);
    calculateProfit(startDate: Date, endDate: Date, period: 'daily' | 'weekly' | 'monthly'): Promise<any>;
    getProfitReports(period?: string): Promise<any>;
    getProfitTrends(days?: number): Promise<any>;
    getCategoryBreakdown(startDate: Date, endDate: Date): Promise<{
        revenue: number;
        count: number;
        category: string;
    }[]>;
    addExpense(category: string, amount: number, description?: string, expenseDate?: Date): Promise<any>;
    getExpenses(startDate?: Date, endDate?: Date): Promise<any>;
}
