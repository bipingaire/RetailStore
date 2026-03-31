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
        const newCat = await client.category.create({
            data: { name, description },
        });

        // Sync to Global DB
        await this.prisma.globalCategory.upsert({
            where: { name },
            update: {},
            create: { name, description, isActive: true }
        });

        // Sync to all other tenants
        const allTenants = await this.tenantService.findAll();
        for (const t of allTenants) {
            if (t.subdomain === subdomain) continue;
            try {
                const tClient = await this.tenantPrisma.getTenantClient(t.databaseUrl);
                await tClient.category.upsert({
                    where: { name },
                    update: {},
                    create: { name, description, isActive: true }
                });
            } catch (err) {
                console.error(`Failed to sync category to tenant ${t.subdomain}`, err);
            }
        }

        return newCat;
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
        const newGlobalCat = await this.prisma.globalCategory.create({
            data: { name, description }
        });

        // Sync to all tenants
        const allTenants = await this.tenantService.findAll();
        for (const t of allTenants) {
            try {
                const tClient = await this.tenantPrisma.getTenantClient(t.databaseUrl);
                await tClient.category.upsert({
                    where: { name },
                    update: {},
                    create: { name, description, isActive: true }
                });
            } catch (err) {
                console.error(`Failed to sync global category to tenant ${t.subdomain}`, err);
            }
        }

        return newGlobalCat;
    }

    async deleteGlobalCategory(id: string) {
        const cat = await this.prisma.globalCategory.findUnique({ where: { id } });
        if (!cat) throw new NotFoundException('Global Category not found');

        const deletedCat = await this.prisma.globalCategory.delete({
            where: { id }
        });

        const allTenants = await this.tenantService.findAll();
        for (const t of allTenants) {
            try {
                const tClient = await this.tenantPrisma.getTenantClient(t.databaseUrl);
                await tClient.category.deleteMany({
                    where: { name: cat.name }
                });
            } catch (err) {
                console.error(`Failed to delete global category from tenant ${t.subdomain}`, err);
            }
        }

        return deletedCat;
    }
}
