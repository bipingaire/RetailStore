import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import OpenAI from 'openai';
import { SettingsService } from '../settings/settings.service';
import Stripe from 'stripe';
import { parsePagination, buildPaginatedResponse } from '../common/pagination.dto';

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
      let customerId = data.customerId || null;

      if (!customerId && data.customerName) {
        if (data.customerEmail) {
          const existing = await tx.customer.findFirst({
            where: { email: data.customerEmail }
          });
          if (existing) {
            customerId = existing.id;
          }
        }
        if (!customerId) {
          // If phone is unique but might exist? Let's just create a new customer
          // Note: email and phone are unique in schema. We should handle potential duplicates
          // We will findFirst by email OR phone just to be safe
          const existingContact = await tx.customer.findFirst({
            where: {
              OR: [
                data.customerEmail ? { email: data.customerEmail } : undefined,
                data.customerPhone ? { phone: data.customerPhone } : undefined,
              ].filter(Boolean) as any
            }
          });
          
          if (existingContact) {
            customerId = existingContact.id;
          } else {
            const newCustomer = await tx.customer.create({
              data: {
                name: data.customerName,
                email: data.customerEmail || null,
                phone: data.customerPhone || null,
              }
            });
            customerId = newCustomer.id;
          }
        }
      }

      const sale = await tx.sale.create({
        data: {
          saleNumber: `SALE-${Date.now()}`,
          userId: data.userId,
          customerId: customerId,
          subtotal: data.subtotal,
          tax: data.tax ?? 0,
          discount: data.discount ?? 0,   // required in schema, default 0
          total: data.total,
          status: 'PENDING',
          paymentMethod: data.paymentMethod || 'CASH',
          paymentStatus: data.paymentMethod === 'CARD' ? 'PAID' : 'PENDING',
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

  async findAll(subdomain: string, options: {
    status?: string;
    startDate?: string;
    endDate?: string;
    userId?: string;
    customerId?: string;
    page?: number;
    limit?: number;
    search?: string;
  } = {}) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
    const { skip, take, page, limit } = parsePagination(options.page, options.limit, 20);

    const where: any = {};
    if (options.status) where.status = options.status.toUpperCase();
    if (options.userId) where.userId = options.userId;
    if (options.customerId) where.customerId = options.customerId;
    if (options.startDate || options.endDate) {
      where.createdAt = {};
      if (options.startDate) where.createdAt.gte = new Date(options.startDate);
      if (options.endDate) where.createdAt.lte = new Date(options.endDate);
    }
    if (options.search) {
      where.saleNumber = { contains: options.search, mode: 'insensitive' };
    }

    const [sales, total] = await Promise.all([
      client.sale.findMany({
        where,
        include: {
          items: { include: { product: true } },
          customer: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      client.sale.count({ where }),
    ]);

    if (!options.page && !options.limit) return sales;
    return buildPaginatedResponse(sales, total, page, limit);
  }

  async findOne(subdomain: string, id: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
    const sale = await client.sale.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true }
        }
      }
    });
    if (!sale) throw new NotFoundException('Sale not found');
    return sale;
  }

  async getSalesStats(subdomain: string) {
    return { totalSales: 0, totalRevenue: 0 };
  }

  async getSalesAnalytics(subdomain: string, days: number = 30) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

    const since = new Date();
    since.setDate(since.getDate() - days);
    since.setHours(0, 0, 0, 0);

    // ── 1. All sale items in range ─────────────────────────────────────────
    const saleItems = await client.saleItem.findMany({
      where: { sale: { createdAt: { gte: since } } },
      include: { product: { select: { id: true, name: true, sku: true, category: true } }, sale: { select: { createdAt: true, paymentMethod: true, status: true } } },
    });

    // ── 2. All sales in range ──────────────────────────────────────────────
    const sales = await client.sale.findMany({
      where: { createdAt: { gte: since } },
      select: {
        id: true, total: true, subtotal: true, tax: true, discount: true,
        paymentMethod: true, paymentStatus: true, status: true,
        createdAt: true, customerId: true,
        customer: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // ── 3. Top products by quantity sold ──────────────────────────────────
    const productMap = new Map<string, { id: string; name: string; sku: string; category: string | null; unitsSold: number; revenue: number; salesCount: number }>();
    for (const item of saleItems) {
      const key = item.productId;
      const existing = productMap.get(key) || {
        id: item.product.id, name: item.product.name, sku: item.product.sku,
        category: item.product.category, unitsSold: 0, revenue: 0, salesCount: 0,
      };
      existing.unitsSold += item.quantity;
      existing.revenue += Number(item.subtotal);
      existing.salesCount += 1;
      productMap.set(key, existing);
    }
    const allProducts = Array.from(productMap.values());
    const topByUnits = [...allProducts].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 10);
    const topByRevenue = [...allProducts].sort((a, b) => b.revenue - a.revenue).slice(0, 10);

    // ── 4. Daily revenue trend ─────────────────────────────────────────────
    const dailyMap = new Map<string, { date: string; revenue: number; orders: number; avgOrder: number }>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      dailyMap.set(key, { date: key, revenue: 0, orders: 0, avgOrder: 0 });
    }
    for (const sale of sales) {
      const key = sale.createdAt.toISOString().split('T')[0];
      if (dailyMap.has(key)) {
        const day = dailyMap.get(key)!;
        day.revenue += Number(sale.total);
        day.orders += 1;
        dailyMap.set(key, day);
      }
    }
    const dailyTrend = Array.from(dailyMap.values()).map(d => ({
      ...d,
      avgOrder: d.orders > 0 ? d.revenue / d.orders : 0,
    }));

    // ── 5. Payment method breakdown ────────────────────────────────────────
    const paymentMap = new Map<string, { method: string; count: number; revenue: number }>();
    for (const sale of sales) {
      const method = sale.paymentMethod || 'UNKNOWN';
      const existing = paymentMap.get(method) || { method, count: 0, revenue: 0 };
      existing.count += 1;
      existing.revenue += Number(sale.total);
      paymentMap.set(method, existing);
    }
    const paymentBreakdown = Array.from(paymentMap.values()).sort((a, b) => b.revenue - a.revenue);

    // ── 6. Sale status distribution ────────────────────────────────────────
    const statusMap = new Map<string, number>();
    for (const sale of sales) {
      statusMap.set(sale.status, (statusMap.get(sale.status) || 0) + 1);
    }
    const statusBreakdown = Array.from(statusMap.entries()).map(([status, count]) => ({ status, count }));

    // ── 7. Category revenue breakdown ──────────────────────────────────────
    const categoryMap = new Map<string, { category: string; unitsSold: number; revenue: number }>();
    for (const item of saleItems) {
      const cat = item.product.category || 'Uncategorized';
      const existing = categoryMap.get(cat) || { category: cat, unitsSold: 0, revenue: 0 };
      existing.unitsSold += item.quantity;
      existing.revenue += Number(item.subtotal);
      categoryMap.set(cat, existing);
    }
    const categoryBreakdown = Array.from(categoryMap.values()).sort((a, b) => b.revenue - a.revenue);

    // ── 8. Hourly sales heatmap (0–23) ─────────────────────────────────────
    const hourly: number[] = new Array(24).fill(0);
    for (const sale of sales) {
      const h = new Date(sale.createdAt).getHours();
      hourly[h] += Number(sale.total);
    }

    // ── 9. Top customers ───────────────────────────────────────────────────
    const customerMap = new Map<string, { name: string; orders: number; spent: number }>();
    for (const sale of sales) {
      if (!sale.customerId) continue;
      const key = sale.customerId;
      const existing = customerMap.get(key) || { name: sale.customer?.name || 'Unknown', orders: 0, spent: 0 };
      existing.orders += 1;
      existing.spent += Number(sale.total);
      customerMap.set(key, existing);
    }
    const topCustomers = Array.from(customerMap.values()).sort((a, b) => b.spent - a.spent).slice(0, 10);

    // ── 10. Summary KPIs ───────────────────────────────────────────────────
    const totalRevenue = sales.reduce((s, sale) => s + Number(sale.total), 0);
    const totalOrders = sales.length;
    const totalUnits = saleItems.reduce((s, i) => s + i.quantity, 0);
    const totalDiscount = sales.reduce((s, sale) => s + Number(sale.discount), 0);
    const totalTax = sales.reduce((s, sale) => s + Number(sale.tax), 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const uniqueCustomers = new Set(sales.filter(s => s.customerId).map(s => s.customerId)).size;

    return {
      period: { days, since },
      summary: { totalRevenue, totalOrders, totalUnits, avgOrderValue, totalDiscount, totalTax, uniqueCustomers },
      topProductsByUnits: topByUnits,
      topProductsByRevenue: topByRevenue,
      dailyTrend,
      paymentBreakdown,
      statusBreakdown,
      categoryBreakdown,
      hourlySalesHeatmap: hourly,
      topCustomers,
    };
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

  async updateSaleStatus(subdomain: string, saleId: string, status: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'READY', 'DELIVERED', 'COMPLETED', 'CANCELLED'];
    const upperStatus = status.toUpperCase();

    if (!validStatuses.includes(upperStatus)) {
      throw new NotFoundException(`Invalid status: ${status}. Valid: ${validStatuses.join(', ')}`);
    }

    const updated = await client.sale.update({
      where: { id: saleId },
      data: { status: upperStatus as any },
    });

    return { success: true, id: updated.id, status: updated.status };
  }

  async updatePaymentStatus(subdomain: string, saleId: string, paymentStatus: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

    const validStatuses = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];
    const upperStatus = paymentStatus.toUpperCase();

    if (!validStatuses.includes(upperStatus)) {
      throw new NotFoundException(`Invalid payment status: ${paymentStatus}. Valid: ${validStatuses.join(', ')}`);
    }

    const updated = await client.sale.update({
      where: { id: saleId },
      data: { paymentStatus: upperStatus },
    });

    return { success: true, id: updated.id, paymentStatus: updated.paymentStatus };
  }
}
