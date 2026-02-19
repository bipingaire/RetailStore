import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import OpenAI from 'openai';

import { SettingsService } from '../settings/settings.service';
import Stripe from 'stripe';

@Injectable()
export class SaleService {
  constructor(
    private tenantService: TenantService,
    private tenantPrisma: TenantPrismaService,
    private settingsService: SettingsService,
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

  async findMyOrders(subdomain: string, userId: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

    return client.sale.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
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

  async syncSalesFromImage(subdomain: string, imageUrl: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

    // 1. AI Parsing with OpenAI
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Extract sold items from this POS Sales Report Image.
          Return JSON: { "sales": [ { "name": "Raw POS Name", "sku": "POS Code", "qty": 5, "sold_price": 2.50 } ] }.
          Ignore totals/tax lines.`
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Parse this sales report." },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
    });

    const cleanJson = completion.choices[0].message.content?.replace(/```json/g, '').replace(/```/g, '').trim();
    const { sales } = JSON.parse(cleanJson || '{ "sales": [] }');
    const results = [];

    // 2. Process Each Sale Transactionally
    // Note: We process each item individually to allow partial success/reporting
    for (const sale of sales) {
      try {
        await client.$transaction(async (tx) => {
          let productId = null;

          // A. CHECK MAPPING
          const existingMap = await tx.pOSItemMapping.findFirst({
            where: { posItemName: sale.name }
          });

          if (existingMap) {
            productId = existingMap.matchedInventoryId;
            // Update Price History if changed
            if (Number(existingMap.lastSoldPrice) !== sale.sold_price) {
              await tx.pOSItemMapping.update({
                where: { id: existingMap.id },
                data: { lastSoldPrice: sale.sold_price }
              });
            }
          } else {
            // B. NEW ITEM - FUZZY MATCH (Simple ILIKE equivalent via contains)
            // Prisma doesn't support ILIKE directly in all modes easily without raw, but we can try insensitive contains
            const itemDescription = sale.name.replace(/[^a-zA-Z0-9 ]/g, ''); // simplistic cleaning

            // Try to find a match - strict first
            let match = await tx.product.findFirst({
              where: { name: { contains: itemDescription, mode: 'insensitive' } }
            });

            if (match) {
              productId = match.id;
            } else {
              // C. CREATE STUB PRODUCT
              const newProduct = await tx.product.create({
                data: {
                  name: `${sale.name} (POS Import)`,
                  sku: `POS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                  price: sale.sold_price,
                  costPrice: 0, // Unknown
                  stock: 0,
                  isActive: true
                }
              });
              productId = newProduct.id;
            }

            // Create Mapping
            await tx.pOSItemMapping.create({
              data: {
                tenantId: tenant.id,
                posItemName: sale.name,
                product: { connect: { id: productId! } },
                lastSoldPrice: sale.sold_price,
                confidenceScore: match ? 0.8 : 1.0,
              }
            });
          }

          // D. DEDUCT STOCK & TRACK MOVEMENT
          if (productId) {
            await tx.product.update({
              where: { id: productId },
              data: { stock: { decrement: sale.qty } }
            });

            await tx.stockMovement.create({
              data: {
                productId: productId,
                type: 'OUT',
                quantity: sale.qty,
                description: `POS Sync: ${sale.name}`
              }
            });
          }

          results.push({ name: sale.name, status: 'processed', qty: sale.qty, qty_deducted: sale.qty });
        });
      } catch (error: any) {
        console.error(`Error processing item ${sale.name}:`, error);
        results.push({ name: sale.name, status: 'failed', error: error.message });
      }
    }

    return { success: true, processed: results };
  }
  async updateSaleStatus(subdomain: string, id: string, status: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
    return client.sale.update({
      where: { id },
      data: { status }
    });
  }

  async createPaymentIntent(subdomain: string, amount: number, currency: string = 'usd') {
    const secretKey = await this.settingsService.getSetting(subdomain, 'stripe_secret_key');
    if (!secretKey) {
      throw new NotFoundException('Stripe not configured for this tenant');
    }

    const stripe = new Stripe(secretKey, {
      apiVersion: '2024-11-20.acacia' as any,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  }
}
