import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MasterCatalogService {
  constructor(private prisma: PrismaService) { }

  async syncProduct(tenantId: string, product: any) {
    // Deprecated: ProductService handles Global Product linkage.
    // This method is kept for compatibility but does nothing or logs.
    console.log('Sync to master deprecated, handled in ProductService');
  }

  async upsertProduct(data: {
    sku: string;
    productName: string;
    category?: string;
    description?: string;
    basePrice: number;
    imageUrl?: string;
    tenantId: string;
  }) {
    // Basic validation
    if (!data.sku) {
      console.warn("Skipping sync: No SKU provided");
      return;
    }

    try {
      return await this.prisma.sharedCatalog.upsert({
        where: { sku: data.sku },
        update: {
          productName: data.productName,
          category: data.category,
          description: data.description,
          basePrice: data.basePrice,
          imageUrl: data.imageUrl,
          syncedAt: new Date(),
        },
        create: {
          sku: data.sku,
          productName: data.productName,
          category: data.category,
          description: data.description,
          basePrice: data.basePrice,
          imageUrl: data.imageUrl,
          tenantId: data.tenantId,
          syncedAt: new Date(),
        },
      });
    } catch (error) {
      console.error("Failed to sync to Master Catalog:", error);
      // Don't throw, just log. We don't want to break local update if sync fails.
    }
  }

  async getSharedCatalog(filters?: { category?: string; search?: string }) {
    const where: any = {};

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.search) {
      where.OR = [
        { productName: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search } },
      ];
    }

    return this.prisma.sharedCatalog.findMany({
      where,
      orderBy: { productName: 'asc' },
    });
  }
}
