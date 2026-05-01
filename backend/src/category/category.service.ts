import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { PrismaService } from '../prisma/prisma.service';
import { TenantService } from '../tenant/tenant.service';

function standardizeCategory(cat: string | null | undefined): string {
    if (!cat) return '';
    return cat.trim().split(/\s+/).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
}

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
        const standardName = standardizeCategory(name) || name;
        const newGlobalCat = await this.prisma.globalCategory.create({
            data: { name: standardName, description }
        });

        // Sync to all tenants
        const allTenants = await this.tenantService.findAll();
        for (const t of allTenants) {
            try {
                const tClient = await this.tenantPrisma.getTenantClient(t.databaseUrl);
                await tClient.category.upsert({
                    where: { name: standardName },
                    update: {},
                    create: { name: standardName, description, isActive: true }
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

    async updateGlobalCategory(id: string, name: string, description?: string) {
        const cat = await this.prisma.globalCategory.findUnique({ where: { id } });
        if (!cat) throw new NotFoundException('Global Category not found');

        const oldName = cat.name;
        const standardName = standardizeCategory(name) || name;

        // Update the global category
        const updatedCat = await this.prisma.globalCategory.update({
            where: { id },
            data: { name: standardName, description }
        });

        // Sync rename to all tenants — both category table AND product category strings
        const allTenants = await this.tenantService.findAll();
        for (const t of allTenants) {
            try {
                const tClient = await this.tenantPrisma.getTenantClient(t.databaseUrl);
                // Update the category registry entry
                const existingTenantCat = await tClient.category.findUnique({ where: { name: oldName } });
                if (existingTenantCat) {
                    await tClient.category.update({
                        where: { id: existingTenantCat.id },
                        data: { name: standardName, description }
                    });
                }
                // Also update all products that have the old category string
                await tClient.product.updateMany({
                    where: { category: oldName },
                    data: { category: standardName }
                });
            } catch (err) {
                console.error(`Failed to update global category on tenant ${t.subdomain}`, err);
            }
        }

        return updatedCat;
    }

    async renameDynamicCategory(oldName: string, newName: string) {
        const standardNewName = standardizeCategory(newName) || newName;

        // 1. Update all products in Global SharedCatalog
        await this.prisma.sharedCatalog.updateMany({
            where: { category: oldName },
            data: { category: standardNewName }
        });

        // 2. Propagate to all tenant product tables (shop page reads from here)
        const allTenants = await this.tenantService.findAll();
        for (const t of allTenants) {
            try {
                const tClient = await this.tenantPrisma.getTenantClient(t.databaseUrl);
                // Update product category strings
                await tClient.product.updateMany({
                    where: { category: oldName },
                    data: { category: standardNewName }
                });
                // Also update/create the category registry entry
                const existingCat = await tClient.category.findUnique({ where: { name: oldName } });
                if (existingCat) {
                    await tClient.category.update({
                        where: { id: existingCat.id },
                        data: { name: standardNewName }
                    });
                }
            } catch (err) {
                console.error(`Failed to rename category on tenant ${t.subdomain}`, err);
            }
        }

        return { success: true, oldName, newName: standardNewName };
    }
}
