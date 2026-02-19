import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { MasterPrismaService } from '../prisma/master-prisma.service';
import { MasterCatalogService } from '../master-catalog/master-catalog.service';
import OpenAI from 'openai';

@Injectable()
export class ProductService {
  constructor(
    private tenantService: TenantService,
    private tenantPrisma: TenantPrismaService,
    private masterPrisma: MasterPrismaService,
    private masterCatalogService: MasterCatalogService,
  ) { }

  async enrichProduct(subdomain: string, id: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

    // 1. Get Product
    const product = await client.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    // 2. Generate Image via OpenAI
    // Note: Ensure OPENAI_API_KEY is in backend .env
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = `Professional product photography of ${product.name}, isolated on white background, high quality, commercial lighting, photorealistic, 4k`;

    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      });

      const imageUrl = response.data[0].url;
      if (!imageUrl) throw new Error("Failed to generate image from OpenAI");

      // 3. Update Local Product
      const updated = await client.product.update({
        where: { id },
        data: { imageUrl }
      });

      // 4. Update Master Catalog if SKU exists
      if (updated.sku) {
        await this.masterCatalogService.upsertProduct({
          sku: updated.sku,
          productName: updated.name,
          category: updated.category,
          description: updated.description,
          basePrice: Number(updated.price),
          imageUrl: updated.imageUrl,
          tenantId: tenant.id
        });
      }

      return { success: true, imageUrl };
    } catch (error) {
      console.error("OpenAI Enrichment Error:", error);
      throw new Error(`Enrichment failed: ${error.message}`);
    }
  }

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

  async create(subdomain: string, data: any) {
    return this.createProduct(subdomain, data);
  }

  async findOne(subdomain: string, id: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
    return client.product.findUnique({ where: { id }, include: { Batches: true } });
  }

  async update(subdomain: string, id: string, data: any) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

    // 1. Update Local
    const updated = await client.product.update({ where: { id }, data });

    // 2. Sync to Master (Global Catalog)
    // We only sync if there is an SKU.
    if (updated.sku) {
      await this.masterCatalogService.upsertProduct({
        sku: updated.sku,
        productName: updated.name, // Mapping 'name' to 'productName'
        category: updated.category,
        description: updated.description,
        basePrice: Number(updated.price),
        imageUrl: updated.imageUrl,
        tenantId: tenant.id // We need tenant ID for the sync
      });
    }

    return updated;
  }

  async delete(subdomain: string, id: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
    return client.product.delete({ where: { id } });
  }

  async updateStock(subdomain: string, id: string, quantity: number, type: string) {
    // Stub
    return { success: true };
  }

  async findAll(subdomain: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

    // Now fetching real data with relations!
    const products = await client.product.findMany({
      include: {
        Batches: true
      }
    });

    // Map to Frontend 'ProductRow' shape
    return products.map(p => ({
      id: p.id,
      name: p.name,
      sku: p.sku || 'N/A',
      image: p.imageUrl || null,
      category: p.category,
      description: p.description,
      price: p.price,
      total_qty: p.stock,
      batches: (p.Batches || []).map(b => ({
        id: b.id,
        qty: b.quantity,
        expiry: b.expiryDate.toISOString(),
        days_left: 0, // Frontend handles calculation
        status: 'GOOD'
      }))
    }));
  }

  async syncAll(subdomain: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

    const allProducts = await client.product.findMany();
    let count = 0;

    for (const p of allProducts) {
      if (p.sku) {
        await this.masterCatalogService.upsertProduct({
          sku: p.sku,
          productName: p.name,
          category: p.category,
          description: p.description,
          basePrice: Number(p.price),
          imageUrl: p.imageUrl,
          tenantId: tenant.id
        });
        count++;
      }
    }
    return { success: true, synced: count };
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
