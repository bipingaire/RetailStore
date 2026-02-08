import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Controller('tenants')
export class TenantController {
  constructor(private tenantService: TenantService) { }

  @Post()
  async createTenant(@Body() dto: CreateTenantDto) {
    // Explicitly cast or map to match expected interface
    return this.tenantService.createTenant({
      name: dto.name,
      subdomain: dto.subdomain,
      email: dto.adminEmail || "admin@example.com",
      password: dto.adminPassword || "123456"
    });
  }

  @Get()
  async getAllTenants() {
    return this.tenantService.findAll();
  }

  @Get(':subdomain')
  async getTenant(@Param('subdomain') subdomain: string) {
    return this.tenantService.getTenantBySubdomain(subdomain);
  }
}
