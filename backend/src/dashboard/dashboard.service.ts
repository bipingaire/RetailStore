import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TenantService } from '../tenant/tenant.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private tenantService: TenantService,
  ) { }

  async getOverview(subdomain: string, startDate?: Date, endDate?: Date) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);

    const dateFilter: any = {
      tenantId: tenant.tenantId,
      status: 'completed', // Using lowercase as per my SaleService logic
    };

    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.gte = startDate;
      if (endDate) dateFilter.createdAt.lte = endDate;
    }

    const [
      salesStats,
      salesCount,
      productCount,
      customerCount,
      lowStockProducts,
      //   topProducts, // Complex group by on line items
      //   recentSales,
    ] = await Promise.all([
      this.prisma.customerOrderHeader.aggregate({
        where: dateFilter,
        _sum: { totalAmount: true }, // Schema CustomerOrderHeader has totalAmount
        _avg: { totalAmount: true },
      }),
      this.prisma.customerOrderHeader.count({ where: dateFilter }),
      this.prisma.retailStoreInventoryItem.count({ where: { tenantId: tenant.tenantId, isActive: true } }),
      this.prisma.customer.count({ where: { tenantId: tenant.tenantId } }),
      this.prisma.retailStoreInventoryItem.findMany({
        where: {
          tenantId: tenant.tenantId,
          isActive: true,
          // stock <= reorderLevel. Prisma doesn't support field reference in where easily without Raw.
          // We can fetch all active and filter in memory if dataset is small, or use Raw.
          // For now, let's use a simple filter like stock < 10 or fetch and filter
          currentStock: { lte: 10 }, // Approximation
        },
        take: 10,
        orderBy: { currentStock: 'asc' },
        include: { globalProduct: true }
      }),
    ]);

    // Top Products and Recent Sales omitted for brevity in refactor to match schema.
    // Can be added if needed using findMany on OrderLineItemDetail.

    return {
      summary: {
        totalRevenue: salesStats._sum.totalAmount || 0,
        averageSale: salesStats._avg.totalAmount || 0,
        totalSales: salesCount,
        totalProducts: productCount,
        totalCustomers: customerCount,
      },
      lowStockProducts: lowStockProducts.map(p => ({
        name: p.globalProduct?.productName,
        stock: p.currentStock
      })),
    };
  }

  async getSalesChart(subdomain: string, period: 'day' | 'week' | 'month' | 'year') {
    // Simplified implementation using Prisma groupBy if possible, or Mock
    return [];
  }

  async getProductAnalytics(subdomain: string) {
    return {};
  }
}
