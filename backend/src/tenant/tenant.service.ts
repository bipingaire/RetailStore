import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { MasterPrismaService } from '../prisma/master-prisma.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';

@Injectable()
export class TenantService {
  constructor(
    private masterPrisma: MasterPrismaService,
    private tenantPrisma: TenantPrismaService,
  ) { }

  async createTenant(dto: { name: string; subdomain: string; email: string; password: string }) {
    // 1. Check if exists
    const existing = await this.masterPrisma.tenant.findUnique({ where: { subdomain: dto.subdomain } });
    if (existing) throw new BadRequestException('Subdomain taken');

    // 2. Derive DB Name
    const dbName = `retail_store_${dto.subdomain}`;
    const dbUrl = process.env.DATABASE_URL.replace(/\/([^/?]+)(\?|$)/, `/${dbName}$2`);

    // 3. Create Tenant Record in Master
    const tenant = await this.masterPrisma.tenant.create({
      data: {
        storeName: dto.name,
        subdomain: dto.subdomain,
        adminEmail: dto.email,
        databaseUrl: dbUrl,
      },
    });

    // 4. Provision Database (Simulated)
    try {
      if (!/^[a-z0-9]+$/.test(dto.subdomain)) throw new BadRequestException('Invalid subdomain');
      // await this.masterPrisma.$executeRawUnsafe(`CREATE DATABASE "${dbName}"`);
      // Simulating success for now as we can't reliably run raw SQL without superuser
    } catch (e) {
      console.error('Failed to provision DB', e);
    }

    return tenant;
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
