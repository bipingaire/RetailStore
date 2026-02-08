import { PrismaService } from '../prisma/prisma.service';
import { TenantService } from '../tenant/tenant.service';
export declare class DashboardService {
    private prisma;
    private tenantService;
    constructor(prisma: PrismaService, tenantService: TenantService);
    getOverview(subdomain: string, startDate?: Date, endDate?: Date): Promise<{
        totalSales: number;
        totalProducts: number;
        totalCustomers: number;
        lowStockProducts: {
            name: any;
            stock: any;
        }[];
    }>;
    getSalesChart(subdomain: string, period: 'day' | 'week' | 'month' | 'year'): Promise<any[]>;
    getProductAnalytics(subdomain: string): Promise<{}>;
}
