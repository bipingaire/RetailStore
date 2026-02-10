import { Injectable } from '@nestjs/common';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';

@Injectable()
export class PurchaseOrderService {
  constructor(private readonly prisma: TenantPrismaService) {}

  async createPurchaseOrder(
    vendorId: string,
    items: Array<{ productId: string; quantity: number; unitCost: number }>,
    notes?: string,
  ) {
    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
    const orderNumber = `PO-${Date.now()}`;

    return this.prisma.purchaseOrder.create({
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
      },
      include: {
        vendor: true,
        items: { include: { product: true } },
      },
    });
  }

  async getPurchaseOrder(id: string) {
    return this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        vendor: true,
        items: { include: { product: true } },
      },
    });
  }

  async getAllPurchaseOrders(status?: string) {
    const where = status ? { status } : {};
    
    return this.prisma.purchaseOrder.findMany({
      where,
      include: { vendor: true, items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.purchaseOrder.update({
      where: { id },
      data: { status },
    });
  }

  async sendPurchaseOrder(id: string) {
    // TODO: Send email/WhatsApp to vendor
    return this.prisma.purchaseOrder.update({
      where: { id },
      data: {
        status: 'sent',
        sentAt: new Date(),
      },
    });
  }

  async receivePurchaseOrder(id: string) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!po) throw new Error('Purchase order not found');

    await this.prisma.$transaction(async (tx) => {
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
            reason: `PO ${po.orderNumber}`,
            date: new Date(),
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

    return this.getPurchaseOrder(id);
  }
}
