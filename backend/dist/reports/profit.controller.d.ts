import { ProfitService } from './profit.service';
export declare class ProfitController {
    private readonly profitService;
    constructor(profitService: ProfitService);
    calculate(body: {
        startDate: string;
        endDate: string;
        period: 'daily' | 'weekly' | 'monthly';
    }): Promise<any>;
    getReports(period?: string): Promise<any>;
    getTrends(days?: string): Promise<any>;
    getCategoryBreakdown(query: {
        startDate: string;
        endDate: string;
    }): Promise<{
        revenue: number;
        count: number;
        category: string;
    }[]>;
    addExpense(body: {
        category: string;
        amount: number;
        description?: string;
        expenseDate?: string;
    }): Promise<any>;
    getExpenses(query: {
        startDate?: string;
        endDate?: string;
    }): Promise<any>;
}
