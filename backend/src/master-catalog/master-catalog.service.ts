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

    return this.prisma.globalProductMasterCatalog.findMany({
      where,
      orderBy: { productName: 'asc' },
    });
  }
}
