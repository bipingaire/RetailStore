import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
export declare class DashboardService {
    private tenantService;
    private tenantPrisma;
    constructor(tenantService: TenantService, tenantPrisma: TenantPrismaService);
    getOverview(subdomain: string, startDate?: Date, endDate?: Date): Promise<{
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
    getSalesChart(subdomain: string, period: 'day' | 'week' | 'month' | 'year'): Promise<any[]>;
    getProductAnalytics(subdomain: string): Promise<{}>;
}
