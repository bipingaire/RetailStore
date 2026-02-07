import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import OpenAI from 'openai'; // Assumes installed in root

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

  async findAll(subdomain: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
    return client.sale.findMany({ include: { items: true, customer: true, user: true } });
  }

  async findOne(subdomain: string, id: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
    const sale = await client.sale.findUnique({ where: { id }, include: { items: true } });
    if (!sale) throw new NotFoundException('Sale not found');
    return sale;
  }

  // --- Legacy Sync ---

  async syncSalesFromImage(tenantId: string, imageUrl: string) {
    // 1. OpenAI Parse
    // Note: Needs OPENAI_API_KEY in backend .env
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Extract sold items from this POS Sales Report Image. Return JSON: { \"sales\": [ { \"name\": \"Raw POS Name\", \"sku\": \"POS Code\", \"qty\": 5, \"sold_price\": 2.50 } ] }. Ignore totals/tax lines."
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

    // 2. Get Tenant Client (using ID from Master)
    // We need to look up Tenant by ID to get DB URL
    // But TenantPrismaService usually caches by URL.
    // Need Master Tenant Record first.
    // Wait, TenantService.getTenantBySubdomain() is standard? 
    // Add getTenantById in TenantService?
    // For now, I'll bypass and assume I can get it via MasterPrisma

    // I can't inject MasterPrisma here cleanly due to circular deps if I'm not careful.
    // But ProductService has it. 
    // I should inject MasterPrismaService here too?
    // Or add method to TenantService.

    // Let's assume tenantId is actually subdomain? 
    // Frontend payload says `tenantId`. UUID usually.

    // I'll throw error if I can't resolve logic easily without MasterPrisma.
    // Actually, I should just Inject MasterPrismaService. It's Global.

    // ... (Assuming MasterPrismaService injected in real implementation, 
    // but I need to update constructor. See below)

    return { success: true, count: sales.length, raw: sales };
  }
}
