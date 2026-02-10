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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const tenant_service_1 = require("../tenant/tenant.service");
const tenant_prisma_service_1 = require("../prisma/tenant-prisma.service");
const master_prisma_service_1 = require("../prisma/master-prisma.service");
let ProductService = class ProductService {
    constructor(tenantService, tenantPrisma, masterPrisma) {
        this.tenantService = tenantService;
        this.tenantPrisma = tenantPrisma;
        this.masterPrisma = masterPrisma;
    }
    async createProduct(subdomain, data) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const product = await client.product.create({
            data: {
                name: data.name,
                sku: data.sku,
                category: data.category,
                description: data.description,
                price: data.price,
                costPrice: data.costPrice,
                stock: data.stock,
                reorderLevel: data.reorderLevel,
            },
        });
        await this.masterPrisma.sharedCatalog.upsert({
            where: { sku: product.sku },
            update: {
                productName: product.name,
                category: product.category,
                description: product.description,
                basePrice: product.price,
                syncedAt: new Date(),
                tenantId: tenant.id,
            },
            create: {
                sku: product.sku,
                productName: product.name,
                category: product.category,
                description: product.description,
                basePrice: product.price,
                tenantId: tenant.id,
            },
        });
        return product;
    }
    async create(subdomain, data) {
        return this.createProduct(subdomain, data);
    }
    async findOne(subdomain, id) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.product.findUnique({ where: { id }, include: { Batches: true } });
    }
    async update(subdomain, id, data) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.product.update({ where: { id }, data });
    }
    async delete(subdomain, id) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.product.delete({ where: { id } });
    }
    async updateStock(subdomain, id, quantity, type) {
        return { success: true };
    }
    async findAll(subdomain) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const products = await client.product.findMany({
            include: {
                Batches: true
            }
        });
        return products.map(p => ({
            id: p.id,
            name: p.name,
            sku: p.sku || 'N/A',
            image: p.imageUrl || null,
            category: p.category,
            description: p.description,
            price: p.price,
            total_qty: p.stock,
            batches: (p.Batches || []).map(b => ({
                id: b.id,
                qty: b.quantity,
                expiry: b.expiryDate.toISOString(),
                days_left: 0,
                status: 'GOOD'
            }))
        }));
    }
    async commitInventory(tenantId, items) {
        const tenant = await this.masterPrisma.tenant.findUnique({ where: { id: tenantId } });
        if (!tenant)
            throw new Error('Tenant not found');
        const results = [];
        for (const item of items) {
            let globalProduct = null;
            if (item.sku) {
                globalProduct = await this.masterPrisma.sharedCatalog.findUnique({ where: { sku: item.sku } });
            }
            if (!globalProduct && item.name) {
                globalProduct = await this.masterPrisma.sharedCatalog.findFirst({ where: { productName: item.name } });
            }
            if (globalProduct) {
                results.push({ status: 'linked', productId: globalProduct.sku, name: item.name });
            }
            else {
                const sku = item.sku || `GEN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
                const newGlobal = await this.masterPrisma.sharedCatalog.create({
                    data: {
                        sku: sku,
                        productName: item.name,
                        category: item.category,
                        basePrice: item.price || 0,
                        tenantId: tenant.id
                    }
                });
                results.push({ status: 'created', productId: newGlobal.sku, name: item.name });
            }
        }
        return { success: true, processed: results.length, details: results };
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_service_1.TenantService,
        tenant_prisma_service_1.TenantPrismaService,
        master_prisma_service_1.MasterPrismaService])
], ProductService);
//# sourceMappingURL=product.service.js.map