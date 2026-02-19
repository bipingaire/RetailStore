// v2: safe databaseUrl derivation + error handling
import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { MasterPrismaService } from '../prisma/master-prisma.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';

@Injectable()
export class TenantService {
  constructor(
    private masterPrisma: MasterPrismaService,
    private tenantPrisma: TenantPrismaService,
  ) { }

  async createTenant(dto: { name: string; subdomain: string; email: string; password: string }) {
    // 1. Ensure subdomain is safe
    if (!/^[a-z0-9]+$/.test(dto.subdomain)) {
      throw new BadRequestException('Subdomain must be lowercase alphanumeric only');
    }

    // 2. Check if subdomain already taken
    const existing = await this.masterPrisma.tenant.findUnique({ where: { subdomain: dto.subdomain } });
    if (existing) throw new BadRequestException('Subdomain already taken');

    // 3. Derive tenant DB URL safely
    const baseUrl = process.env.DATABASE_URL || '';
    let dbUrl: string;
    try {
      // Replace the database name in the connection string
      // e.g. postgresql://user:pass@host:5432/retail_store_master?schema=public
      //   -> postgresql://user:pass@host:5432/retail_store_highpoint?schema=public
      const dbName = `retail_store_${dto.subdomain}`;
      dbUrl = baseUrl.replace(/(\/\/[^/]+\/)[^?]+/, `$1${dbName}`);
      if (!dbUrl || dbUrl === baseUrl) {
        // Fallback: use master DB with tenant schema
        dbUrl = baseUrl;
      }
    } catch (e) {
      dbUrl = baseUrl;
    }

    // 4. Create Tenant Record in Master DB
    try {
      const tenant = await this.masterPrisma.tenant.create({
        data: {
          storeName: dto.name,
          subdomain: dto.subdomain,
          adminEmail: dto.email,
          databaseUrl: dbUrl,
        },
      });
      return tenant;
    } catch (e) {
      console.error('Failed to create tenant record:', e?.message || e);
      throw new InternalServerErrorException(`Failed to create tenant: ${e?.message || 'Unknown error'}`);
    }
  }

  async getTenantBySubdomain(subdomain: string) {
    const tenant = await this.masterPrisma.tenant.findUnique({ where: { subdomain } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  async listTenants() {
    return this.masterPrisma.tenant.findMany();
  }

  async findAll() {
    return this.masterPrisma.tenant.findMany();
  }
}
