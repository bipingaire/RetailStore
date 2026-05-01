import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { MasterPrismaService } from '../prisma/master-prisma.service';
import { MasterCatalogService } from '../master-catalog/master-catalog.service';
import OpenAI from 'openai';
import { parsePagination, buildPaginatedResponse } from '../common/pagination.dto';

function standardizeCategory(cat: string | null | undefined): string {
    if (!cat) return 'Uncategorized';
    return cat.trim().split(/\s+/).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
}

@Injectable()
export class ProductService implements OnModuleInit {
  constructor(
    private tenantService: TenantService,
    private tenantPrisma: TenantPrismaService,
    private masterPrisma: MasterPrismaService,
    private masterCatalogService: MasterCatalogService,
  ) { }

  onModuleInit() {
    // Run automatic sync every 10 minutes (600,000 ms)
    setInterval(async () => {
      try {
        const tenants = await this.tenantService.findAll();
        for (const t of tenants) {
          console.log(`[Auto-Sync] Starting periodic sync for tenant: ${t.subdomain}`);
          await this.syncAll(t.subdomain).catch(err => 
            console.error(`[Auto-Sync] Failed for tenant ${t.subdomain}:`, err)
          );
        }
      } catch (err) {
        console.error('[Auto-Sync] Global sync iteration failed:', err);
      }
    }, 10 * 60 * 1000);
  }

  async enrichProduct(subdomain: string, id: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

    // 1. Get Product
    const product = await client.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    // 2. Generate Description via OpenAI
    // Note: Ensure OPENAI_API_KEY is in backend .env
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = `Write a short, professional, and appealing product description for a local retail store item called "${product.name}". The category is "${product.category || 'general'}". Do not use bullet points, just 2-3 engaging sentences.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });

      const description = response.choices[0].message?.content?.trim();
      if (!description) throw new Error("Failed to generate description from OpenAI");

      // 3. Update Local Product
      const updated = await client.product.update({
        where: { id },
        data: { description }
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

      return { success: true, description };
    } catch (error) {
      console.error("OpenAI Enrichment Error:", error);
      throw new Error(`Enrichment failed: ${error.message}`);
    }
  }

  async createProduct(subdomain: string, data: any) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

    // Auto-generate SKU if not provided
    const sku = data.sku || `SKU-${data.name?.replace(/\s+/g, '-').toUpperCase().slice(0, 20)}-${Date.now()}`;

    // 1. Create in Tenant DB
    const product = await client.product.create({
      data: {
        name: data.name,
        sku: sku,
        category: standardizeCategory(data.category),
        description: data.description || '',
        price: Number(data.price) || Number(data.sellingPrice) || 0,
        costPrice: Number(data.costPrice) || 0,
        stock: Number(data.stock) || 0,
        reorderLevel: Number(data.reorderLevel) || 10,
        isSellable: data.isSellable !== undefined ? data.isSellable : true,
        parentId: data.parentId || null,
        unitsPerParent: data.unitsPerParent || 1,
      },
    });

    // 2. Sync to Master Shared Catalog — always, SKU is guaranteed above
    try {
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
    } catch (err) {
      console.error(`[Catalog Sync] Failed for product "${product.name}":`, err);
    }

    return product;
  }

  async create(subdomain: string, data: any) {
    return this.createProduct(subdomain, data);
  }

  async findOne(subdomain: string, id: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
    const product = await client.product.findUnique({ where: { id }, include: { Batches: true } });
    
    if (product && !product.imageUrl && product.sku) {
        const globalRef = await this.masterPrisma.sharedCatalog.findUnique({ where: { sku: product.sku } });
        if (globalRef?.imageUrl) {
            product.imageUrl = globalRef.imageUrl;
        }
    }

    return product;
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
    
    // Get the product's SKU before deleting so we can update the global catalog
    const product = await client.product.findUnique({ where: { id }, select: { sku: true, name: true } });
    
    // Delete from tenant
    const deleted = await client.product.delete({ where: { id } });

    // Remove from sharedCatalog (global) — one-way sync: tenant delete removes from global
    if (product?.sku) {
      try {
        await this.masterPrisma.sharedCatalog.deleteMany({ where: { sku: product.sku } });
      } catch (err) {
        console.error(`[Catalog Sync] Failed to remove "${product.name}" from global catalog:`, err);
      }
    }

    return deleted;
  }

  async updateStock(subdomain: string, id: string, quantity: number, type: string) {
    // Stub
    return { success: true };
  }

  async findAll(subdomain: string, options: {
    sellableOnly?: boolean;
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  } = {}) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
    
    // Use parsePagination if page/limit provided, else no skip/take
    const isPaginated = options.page || options.limit;
    const { skip, take, page, limit } = isPaginated 
      ? parsePagination(options.page, options.limit, 20)
      : { skip: undefined, take: undefined, page: 1, limit: 0 };

    const where: any = {};
    if (options.sellableOnly) where.isSellable = true;
    if (options.category) where.category = { equals: options.category, mode: 'insensitive' };
    if (options.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { sku: { contains: options.search, mode: 'insensitive' } },
        { category: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      client.product.findMany({
        where,
        include: { Batches: true },
        orderBy: { name: 'asc' },
        ...(isPaginated ? { skip, take } : {}),
      }),
      client.product.count({ where }),
    ]);

    // Fetch master catalog images for fallback
    const skus = products.map(p => p.sku).filter(Boolean);
    const globals = await this.masterPrisma.sharedCatalog.findMany({
      where: { sku: { in: skus } },
      select: { sku: true, imageUrl: true },
    });
    const globalMap = new Map(globals.map(g => [g.sku, g.imageUrl]));

    // Fetch sales count for sorting by popularity
    const productIds = products.map(p => p.id);
    const salesData = await client.saleItem.groupBy({
      by: ['productId'],
      where: { productId: { in: productIds } },
      _sum: { quantity: true }
    });
    const salesMap = new Map<string, number>();
    salesData.forEach(s => salesMap.set(s.productId, s._sum.quantity || 0));

    const data = products.map(p => ({
      id: p.id,
      name: p.name,
      sku: p.sku || 'N/A',
      image: p.imageUrl || globalMap.get(p.sku) || null,
      imageUrl: p.imageUrl || globalMap.get(p.sku) || null,
      category: p.category,
      description: p.description,
      price: p.price,
      total_qty: p.stock,
      is_sellable: p.isSellable,
      parent_id: p.parentId,
      units_per_parent: p.unitsPerParent,
      salesCount: salesMap.get(p.id) || 0,
      batches: (p.Batches || []).map(b => ({
        id: b.id,
        qty: b.quantity,
        expiry: b.expiryDate.toISOString(),
        days_left: 0,
        status: 'GOOD',
      })),
    }));

    // If no pagination requested, return plain array for backwards compat
    if (!isPaginated) return data;
    return buildPaginatedResponse(data, total, page, limit);
  }

  async getCategories(subdomain: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
    
    // Group by category to get unique categories and counts
    const categories = await client.product.groupBy({
      by: ['category'],
      _count: {
        id: true,
      },
      where: {
        category: { not: null },
      }
    });

    // Deduplicate case variations (e.g. "grocery" and "Grocery")
    const categoryMap = new Map<string, number>();
    for (const c of categories) {
      if (!c.category) continue;
      // Normalize to Title Case
      const normalizedName = c.category.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      categoryMap.set(normalizedName, (categoryMap.get(normalizedName) || 0) + c._count.id);
    }

    // Get an image for each category
    const imageMap = new Map<string, string>();
    const imageProducts = await client.product.findMany({
      where: { imageUrl: { not: null } },
      select: { category: true, imageUrl: true }
    });
    for (const p of imageProducts) {
      if (!p.category || !p.imageUrl) continue;
      const normalizedName = p.category.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      if (!imageMap.has(normalizedName)) {
        imageMap.set(normalizedName, p.imageUrl);
      }
    }

    return Array.from(categoryMap.entries()).map(([name, count]) => ({
      name,
      count,
      imageUrl: imageMap.get(name) || null
    })).sort((a, b) => a.name.localeCompare(b.name));
  }

  async getHomepageData(subdomain: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

    // 1. Fetch all sellable products
    const products = await client.product.findMany({
      where: { isSellable: true },
      select: {
        id: true,
        name: true,
        sku: true,
        imageUrl: true,
        category: true,
        price: true,
      }
    });

    // 2. Fetch all-time sales per product
    const salesData = await client.saleItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true
      }
    });
    const salesMap = new Map<string, number>();
    salesData.forEach(s => salesMap.set(s.productId, s._sum.quantity || 0));

    // 3. Normalize categories & group products
    const normalizeCategory = (cat: string | null) => {
      if (!cat) return 'Uncategorized';
      return cat.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    };

    const categoryMap = new Map<string, {
      name: string;
      totalCategorySales: number;
      products: any[];
    }>();

    for (const p of products) {
      const catName = normalizeCategory(p.category);
      const salesCount = salesMap.get(p.id) || 0;
      
      if (!categoryMap.has(catName)) {
        categoryMap.set(catName, {
          name: catName,
          totalCategorySales: 0,
          products: []
        });
      }

      const catEntry = categoryMap.get(catName)!;
      catEntry.totalCategorySales += salesCount;
      catEntry.products.push({
        id: p.id,
        name: p.name,
        sku: p.sku || 'N/A',
        imageUrl: p.imageUrl,
        category: catName,
        price: p.price,
        salesCount
      });
    }

    // 4. Sort categories by sales DESC
    const sortedCategories = Array.from(categoryMap.values()).sort((a, b) => {
      // If sales are equal, sort alphabetically
      if (b.totalCategorySales === a.totalCategorySales) {
         return a.name.localeCompare(b.name);
      }
      return b.totalCategorySales - a.totalCategorySales;
    });

    // 5. Sort products within each category by sales DESC, and slice to top 6
    for (const cat of sortedCategories) {
      cat.products.sort((a, b) => {
        if (b.salesCount === a.salesCount) return a.name.localeCompare(b.name);
        return b.salesCount - a.salesCount;
      });
      cat.products = cat.products.slice(0, 6);
    }

    return sortedCategories;
  }

  async syncAll(subdomain: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

    const allProducts = await client.product.findMany();
    let synced = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const p of allProducts) {
      try {
        let sku = p.sku;

        // Auto-generate and save SKU if missing
        if (!sku) {
          sku = `SKU-${p.name.replace(/\s+/g, '-').toUpperCase().slice(0, 20)}-${p.id.slice(0, 6)}`;
          await client.product.update({ where: { id: p.id }, data: { sku } });
        }

        await this.masterPrisma.sharedCatalog.upsert({
          where: { sku },
          update: {
            productName: p.name,
            category: p.category,
            description: p.description,
            basePrice: p.price,
            imageUrl: p.imageUrl,
            syncedAt: new Date(),
            tenantId: tenant.id,
          },
          create: {
            sku,
            productName: p.name,
            category: p.category,
            description: p.description,
            basePrice: p.price,
            imageUrl: p.imageUrl,
            tenantId: tenant.id,
          },
        });
        synced++;
      } catch (err: any) {
        console.error(`[SyncAll] Failed for "${p.name}":`, err.message);
        errors.push(p.name);
        skipped++;
      }
    }

    return { success: true, synced, skipped, errors };
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
