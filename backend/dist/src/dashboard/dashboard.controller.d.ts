import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private dashboardService;
    constructor(dashboardService: DashboardService);
    getOverview(subdomain: string, startDate?: string, endDate?: string): Promise<{
        revenue: number;
        orders: number;
        lowStock: number;
        activeCampaigns: number;
        recentOrders: {
            'order-id': string;
            saleNumber: string;
            'customer-phone': string;
            'customer-name': string;
            'order-date-time': Date;
            status: string;
            'final-amount': number;
        }[];
        weeklyChartData: number[];
    }>;
    getSalesChart(subdomain: string, period?: 'day' | 'week' | 'month' | 'year'): Promise<any[]>;
    getProductAnalytics(subdomain: string): Promise<{}>;
}
