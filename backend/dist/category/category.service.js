"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const tenant_prisma_service_1 = require("../prisma/tenant-prisma.service");
const prisma_service_1 = require("../prisma/prisma.service");
const tenant_service_1 = require("../tenant/tenant.service");
function standardizeCategory(cat) {
    if (!cat)
        return '';
    return cat.trim().split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}
let CategoryService = class CategoryService {
    constructor(tenantPrisma, prisma, tenantService) {
        this.tenantPrisma = tenantPrisma;
        this.prisma = prisma;
        this.tenantService = tenantService;
    }
    async getCategories(subdomain) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const localCategories = await client.category.findMany({
            orderBy: { name: 'asc' },
        });
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
    async addCategory(subdomain, name, description) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const newCat = await client.category.create({
            data: { name, description },
        });
        await this.prisma.globalCategory.upsert({
            where: { name },
            update: {},
            create: { name, description, isActive: true }
        });
        const allTenants = await this.tenantService.findAll();
        for (const t of allTenants) {
            if (t.subdomain === subdomain)
                continue;
            try {
                const tClient = await this.tenantPrisma.getTenantClient(t.databaseUrl);
                await tClient.category.upsert({
                    where: { name },
                    update: {},
                    create: { name, description, isActive: true }
                });
            }
            catch (err) {
                console.error(`Failed to sync category to tenant ${t.subdomain}`, err);
            }
        }
        return newCat;
    }
    async deleteCategory(subdomain, id) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        try {
            return await client.category.delete({
                where: { id },
            });
        }
        catch (error) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
    }
    async getGlobalCategories() {
        return this.prisma.globalCategory.findMany({
            orderBy: { name: 'asc' },
        });
    }
    async addGlobalCategory(name, description) {
        const standardName = standardizeCategory(name) || name;
        const newGlobalCat = await this.prisma.globalCategory.create({
            data: { name: standardName, description }
        });
        const allTenants = await this.tenantService.findAll();
        for (const t of allTenants) {
            try {
                const tClient = await this.tenantPrisma.getTenantClient(t.databaseUrl);
                await tClient.category.upsert({
                    where: { name: standardName },
                    update: {},
                    create: { name: standardName, description, isActive: true }
                });
            }
            catch (err) {
                console.error(`Failed to sync global category to tenant ${t.subdomain}`, err);
            }
        }
        return newGlobalCat;
    }
    async deleteGlobalCategory(id) {
        const cat = await this.prisma.globalCategory.findUnique({ where: { id } });
        if (!cat)
            throw new common_1.NotFoundException('Global Category not found');
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
            }
            catch (err) {
                console.error(`Failed to delete global category from tenant ${t.subdomain}`, err);
            }
        }
        return deletedCat;
    }
    async updateGlobalCategory(id, name, description) {
        const cat = await this.prisma.globalCategory.findUnique({ where: { id } });
        if (!cat)
            throw new common_1.NotFoundException('Global Category not found');
        const oldName = cat.name;
        const standardName = standardizeCategory(name) || name;
        const updatedCat = await this.prisma.globalCategory.update({
            where: { id },
            data: { name: standardName, description }
        });
        const allTenants = await this.tenantService.findAll();
        for (const t of allTenants) {
            try {
                const tClient = await this.tenantPrisma.getTenantClient(t.databaseUrl);
                const existingTenantCat = await tClient.category.findUnique({ where: { name: oldName } });
                if (existingTenantCat) {
                    await tClient.category.update({
                        where: { id: existingTenantCat.id },
                        data: { name: standardName, description }
                    });
                }
                await tClient.product.updateMany({
                    where: { category: oldName },
                    data: { category: standardName }
                });
            }
            catch (err) {
                console.error(`Failed to update global category on tenant ${t.subdomain}`, err);
            }
        }
        return updatedCat;
    }
    async renameDynamicCategory(oldName, newName) {
        const standardNewName = standardizeCategory(newName) || newName;
        await this.prisma.sharedCatalog.updateMany({
            where: { category: { equals: oldName, mode: 'insensitive' } },
            data: { category: standardNewName }
        });
        const allTenants = await this.tenantService.findAll();
        for (const t of allTenants) {
            try {
                const tClient = await this.tenantPrisma.getTenantClient(t.databaseUrl);
                await tClient.product.updateMany({
                    where: { category: { equals: oldName, mode: 'insensitive' } },
                    data: { category: standardNewName }
                });
                const existingCat = await tClient.category.findFirst({ where: { name: { equals: oldName, mode: 'insensitive' } } });
                if (existingCat) {
                    await tClient.category.update({
                        where: { id: existingCat.id },
                        data: { name: standardNewName }
                    });
                }
            }
            catch (err) {
                console.error(`Failed to rename category on tenant ${t.subdomain}`, err);
            }
        }
        return { success: true, oldName, newName: standardNewName };
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_prisma_service_1.TenantPrismaService,
        prisma_service_1.PrismaService,
        tenant_service_1.TenantService])
], CategoryService);
//# sourceMappingURL=category.service.js.map