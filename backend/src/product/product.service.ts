import { Injectable } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { MasterPrismaService } from '../prisma/master-prisma.service';

@Injectable()
export class ProductService {
  constructor(
    private tenantService: TenantService,
    private tenantPrisma: TenantPrismaService,
    private masterPrisma: MasterPrismaService,
  ) { }

  async createProduct(subdomain: string, data: any) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

    // 1. Create in Tenant DB
    const product = await client.product.create({
      data: {
        name: data.name,
        sku: data.sku,
        category: data.category,
        description: data.description,
        price: data.price,
        costPrice: data.costPrice,
        stock: data.stock,
        reorderLevel: data.reorderLevel,
      },
    });

    // 2. Sync to Master Shared Catalog
    // 'tenantId' in SharedCatalog refers to Master Tenant ID
    await this.masterPrisma.sharedCatalog.upsert({
      where: { sku: product.sku },
      update: {
        productName: product.name,
        category: product.category,
        description: product.description,
        basePrice: product.price,
        syncedAt: new Date(),
        tenantId: tenant.id,
      },
      create: {
        sku: product.sku,
        productName: product.name,
        category: product.category,
        description: product.description,
        basePrice: product.price,
        tenantId: tenant.id,
      },
    });

    return product;
  }

  async findAll(subdomain: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
    return client.product.findMany();
  }

  // --- Legacy / Compatibility Methods ---

  async commitInventory(tenantId: string, items: any[]) {
    // 1. Validate Tenant in Master
    // Note: tenantId here is the UUID from Master Table
    const tenant = await this.masterPrisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new Error('Tenant not found');

    const results = [];

    for (const item of items) {
      // 2. Check Global Product by SKU or Name
      let globalProduct = null;
      if (item.sku) {
        globalProduct = await this.masterPrisma.sharedCatalog.findUnique({ where: { sku: item.sku } });
      }
      if (!globalProduct && item.name) {
        // Fallback search by Name (Assuming name isn't unique, but taking first)
        globalProduct = await this.masterPrisma.sharedCatalog.findFirst({ where: { productName: item.name } });
      }

      if (globalProduct) {
        results.push({ status: 'linked', productId: globalProduct.sku, name: item.name });
      } else {
        // 3. Promote to Global
        // Use SKU or Generate one
        const sku = item.sku || `GEN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const newGlobal = await this.masterPrisma.sharedCatalog.create({
          data: {
            sku: sku,
            productName: item.name,
            category: item.category,
            basePrice: item.price || 0,
            tenantId: tenant.id
          }
        });
        results.push({ status: 'created', productId: newGlobal.sku, name: item.name });
      }
    }
    return { success: true, processed: results.length, details: results };
  }
}
