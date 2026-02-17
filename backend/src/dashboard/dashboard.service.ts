import { Injectable } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';

@Injectable()
export class DashboardService {
  constructor(
    private tenantService: TenantService,
    private tenantPrisma: TenantPrismaService,
  ) { }

  async getOverview(subdomain: string, startDate?: Date, endDate?: Date) {
    try {
      const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
      const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

      // Calculate total revenue from sales
      const salesAgg = await client.sale.aggregate({
        _sum: { total: true },
        _count: true,
        where: {
          status: 'COMPLETED',
          ...(startDate || endDate ? {
            createdAt: {
              ...(startDate ? { gte: startDate } : {}),
              ...(endDate ? { lte: endDate } : {}),
            }
          } : {})
        }
      });

      // Count pending orders
      const pendingOrders = await client.sale.count({
        where: { status: { in: ['PENDING', 'PROCESSING'] } }
      });

      // Get low stock products (stock <= reorderLevel)
      const lowStockCount = await client.product.count({
        where: {
          stock: { lte: client.product.fields.reorderLevel },
          isActive: true
        }
      });

      // Count active campaigns
      const activeCampaigns = await client.campaign.count({
        where: { status: 'ACTIVE' }
      });

      // Get recent orders (last 10)
      const recentOrders = await client.sale.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: true,
          items: {
            include: { product: true }
          }
        }
      });

      // Get weekly sales data (last 7 days)
      const weeklyData: number[] = [];
      for (let i = 6; i >= 0; i--) {
        const day = new Date();
        day.setDate(day.getDate() - i);
        day.setHours(0, 0, 0, 0);

        const nextDay = new Date(day);
        nextDay.setDate(nextDay.getDate() + 1);

        const daySales = await client.sale.aggregate({
          _sum: { total: true },
          where: {
            status: 'COMPLETED',
            createdAt: {
              gte: day,
              lt: nextDay
            }
          }
        });

        weeklyData.push(Number(daySales._sum.total || 0));
      }

      return {
        revenue: Number(salesAgg._sum.total || 0),
        orders: pendingOrders,
        lowStock: lowStockCount,
        activeCampaigns: activeCampaigns,
        recentOrders: recentOrders.map(order => ({
          'order-id': order.id,
          'saleNumber': order.saleNumber,
          'customer-phone': order.customer?.phone || 'Guest',
          'customer-name': order.customer?.name || 'Guest',
          'order-date-time': order.createdAt,
          'status': order.status.toLowerCase(),
          'final-amount': Number(order.total)
        })),
        weeklyChartData: weeklyData
      };
    } catch (error) {
      console.error('[DashboardService] Error fetching overview:', error);
      throw error;
    }
  }

  async getSalesChart(subdomain: string, period: 'day' | 'week' | 'month' | 'year') {
    // Future implementation for more detailed charts
    return [];
  }

  async getProductAnalytics(subdomain: string) {
    // Future implementation for product analytics
    return {};
  }
}
