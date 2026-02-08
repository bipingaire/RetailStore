import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';

@Injectable()
export class CustomerService {
  constructor(
    private tenantService: TenantService,
    private tenantPrisma: TenantPrismaService,
  ) { }

  async create(subdomain: string, data: any) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

    return client.customer.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      }
    });
  }

  async findAll(subdomain: string, search?: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    return client.customer.findMany({ where });
  }

  async findOne(subdomain: string, id: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
    const customer = await client.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async update(subdomain: string, id: string, data: any) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
    return client.customer.update({ where: { id }, data });
  }

  async delete(subdomain: string, id: string) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
    return client.customer.delete({ where: { id } });
  }

  async updateLoyaltyPoints(subdomain: string, id: string, points: number) {
    const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
    return client.customer.update({ where: { id }, data: { loyaltyPoints: points } });
  }
}
