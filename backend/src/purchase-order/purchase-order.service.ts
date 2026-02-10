import { Injectable } from '@nestjs/common';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { TenantService } from '../tenant/tenant.service';

@Injectable()
export class PurchaseOrderService {
  constructor(
    private readonly tenantPrisma: TenantPrismaService,
    private readonly tenantService: TenantService,
  ) { }

  async createPurchaseOrder(
    subdomain: string,
    vendorId: string,
    items: Array<{ productId: string; quantity: number; unitCost: number }>,
    notes?: string,
  ) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
    const orderNumber = `PO-${Date.now()}`;

    return client.purchaseOrder.create({
      data: {
        vendorId,
        orderNumber,
        totalAmount,
        notes,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitCost: item.unitCost,
            totalCost: item.quantity * item.unitCost,
          })),
        },
        status: 'draft', // Ensure default status is set if not handled by DB default
      },
      include: {
        vendor: true,
        items: { include: { product: true } },
      },
    });
  }

  async getPurchaseOrder(subdomain: string, id: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

    return client.purchaseOrder.findUnique({
      where: { id },
      include: {
        vendor: true,
        items: { include: { product: true } },
      },
    });
  }

  async getAllPurchaseOrders(subdomain: string, status?: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

    const where = status ? { status } : {};

    return client.purchaseOrder.findMany({
      where,
      include: { vendor: true, items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(subdomain: string, id: string, status: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

    return client.purchaseOrder.update({
      where: { id },
      data: { status },
    });
  }

  async sendPurchaseOrder(subdomain: string, id: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

    // TODO: Send email/WhatsApp to vendor
    return client.purchaseOrder.update({
      where: { id },
      data: {
        status: 'sent',
        sentAt: new Date(),
      },
    });
  }

  async receivePurchaseOrder(subdomain: string, id: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

    const po = await client.purchaseOrder.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!po) throw new Error('Purchase order not found');

    await client.$transaction(async (tx) => {
      // Update inventory
      for (const item of po.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });

        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            type: 'IN',
            quantity: item.quantity,
            description: `PO ${po.orderNumber}`,
            // Removed 'reason' and 'date' to match earlier fixes
          },
        });
      }

      await tx.purchaseOrder.update({
        where: { id },
        data: {
          status: 'received',
          receivedAt: new Date(),
        },
      });
    });

    return this.getPurchaseOrder(subdomain, id);
  }
}
