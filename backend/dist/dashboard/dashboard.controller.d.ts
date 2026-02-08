import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private dashboardService;
    constructor(dashboardService: DashboardService);
    getOverview(subdomain: string, startDate?: string, endDate?: string): Promise<{
        totalSales: number;
        totalProducts: number;
        totalCustomers: number;
        lowStockProducts: {
            name: any;
            stock: any;
        }[];
    }>;
    getSalesChart(subdomain: string, period?: 'day' | 'week' | 'month' | 'year'): Promise<any[]>;
    getProductAnalytics(subdomain: string): Promise<{}>;
}
