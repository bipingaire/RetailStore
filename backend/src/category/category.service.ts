import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { PrismaService } from '../prisma/prisma.service';
import { TenantService } from '../tenant/tenant.service';

@Injectable()
export class CategoryService {
    constructor(
        private readonly tenantPrisma: TenantPrismaService,
        private readonly prisma: PrismaService,
        private readonly tenantService: TenantService
    ) {}

    async getCategories(subdomain: string) {
        // Fetch Tenant specific categories
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        if (!tenant) throw new NotFoundException('Tenant not found');

        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        
        const localCategories = await client.category.findMany({
            orderBy: { name: 'asc' },
        });

        // Fetch Global categories
        const globalCategories = await this.prisma.globalCategory.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        });

        return {
            global: globalCategories,
            local: localCategories,
            combined: [
                ...globalCategories.map(c => c.name),
                ...localCategories.map(c => c.name)
            ]
        };
    }

    async addCategory(subdomain: string, name: string, description?: string) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        if (!tenant) throw new NotFoundException('Tenant not found');

        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.category.create({
            data: { name, description },
        });
    }

    async deleteCategory(subdomain: string, id: string) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        if (!tenant) throw new NotFoundException('Tenant not found');

        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        try {
            return await client.category.delete({
                where: { id },
            });
        } catch (error) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
    }

    // --- GLOBAL SUPER ADMIN CATEGORIES ---

    async getGlobalCategories() {
        return this.prisma.globalCategory.findMany({
            orderBy: { name: 'asc' },
        });
    }

    async addGlobalCategory(name: string, description?: string) {
        return this.prisma.globalCategory.create({
            data: { name, description }
        });
    }

    async deleteGlobalCategory(id: string) {
        return this.prisma.globalCategory.delete({
            where: { id }
        });
    }
}
