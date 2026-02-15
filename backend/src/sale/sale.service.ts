import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import OpenAI from 'openai';

@Injectable()
export class SaleService {
  constructor(
    private tenantService: TenantService,
    private tenantPrisma: TenantPrismaService,
  ) { }

  async createSale(subdomain: string, data: any) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

    return client.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          saleNumber: `SALE-${Date.now()}`,
          userId: data.userId,
          customerId: data.customerId,
          subtotal: data.subtotal,
          tax: data.tax,
          discount: data.discount,
          total: data.total,
          status: 'COMPLETED',
          items: {
            create: data.items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.subtotal,
            }))
          }
        },
        include: { items: true }
      });

      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            type: 'SALE',
            quantity: -item.quantity,
            description: `Sale ${sale.saleNumber}`
          }
        });
      }

      return sale;
    });
  }

  async findAll(subdomain: string, options: any) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
    // basic mock of options implementation
    return client.sale.findMany({
      include: {
        items: {
          include: { product: true }
        },
        customer: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(subdomain: string, id: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
    const sale = await client.sale.findUnique({ where: { id }, include: { items: true } });
    if (!sale) throw new NotFoundException('Sale not found');
    return sale;
  }

  async getSalesStats(subdomain: string) {
    return { totalSales: 0, totalRevenue: 0 };
  }

  async cancelSale(subdomain: string, id: string, userId: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
    return client.sale.update({ where: { id }, data: { status: 'CANCELLED' } });
  }

  async syncSalesFromImage(tenantId: string, imageUrl: string) {
    // Stub implementation
    return { success: true, count: 0, raw: [] };
  }
  async updateSaleStatus(subdomain: string, id: string, status: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
    return client.sale.update({
      where: { id },
      data: { status }
    });
  }
}
