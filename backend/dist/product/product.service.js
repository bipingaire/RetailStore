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
const master_catalog_service_1 = require("../master-catalog/master-catalog.service");
const openai_1 = require("openai");
const pagination_dto_1 = require("../common/pagination.dto");
let ProductService = class ProductService {
    constructor(tenantService, tenantPrisma, masterPrisma, masterCatalogService) {
        this.tenantService = tenantService;
        this.tenantPrisma = tenantPrisma;
        this.masterPrisma = masterPrisma;
        this.masterCatalogService = masterCatalogService;
    }
    async enrichProduct(subdomain, id) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const product = await client.product.findUnique({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
        const prompt = `Write a short, professional, and appealing product description for a local retail store item called "${product.name}". The category is "${product.category || 'general'}". Do not use bullet points, just 2-3 engaging sentences.`;
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
            });
            const description = response.choices[0].message?.content?.trim();
            if (!description)
                throw new Error("Failed to generate description from OpenAI");
            const updated = await client.product.update({
                where: { id },
                data: { description }
            });
            if (updated.sku) {
                await this.masterCatalogService.upsertProduct({
                    sku: updated.sku,
                    productName: updated.name,
                    category: updated.category,
                    description: updated.description,
                    basePrice: Number(updated.price),
                    imageUrl: updated.imageUrl,
                    tenantId: tenant.id
                });
            }
            return { success: true, description };
        }
        catch (error) {
            console.error("OpenAI Enrichment Error:", error);
            throw new Error(`Enrichment failed: ${error.message}`);
        }
    }
    async createProduct(subdomain, data) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const sku = data.sku || `SKU-${data.name?.replace(/\s+/g, '-').toUpperCase().slice(0, 20)}-${Date.now()}`;
        const product = await client.product.create({
            data: {
                name: data.name,
                sku: sku,
                category: data.category || 'Uncategorized',
                description: data.description || '',
                price: Number(data.price) || Number(data.sellingPrice) || 0,
                costPrice: Number(data.costPrice) || 0,
                stock: Number(data.stock) || 0,
                reorderLevel: Number(data.reorderLevel) || 10,
                isSellable: data.isSellable !== undefined ? data.isSellable : true,
                parentId: data.parentId || null,
                unitsPerParent: data.unitsPerParent || 1,
            },
        });
        try {
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
        }
        catch (err) {
            console.error(`[Catalog Sync] Failed for product "${product.name}":`, err);
        }
        return product;
    }
    async create(subdomain, data) {
        return this.createProduct(subdomain, data);
    }
    async findOne(subdomain, id) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const product = await client.product.findUnique({ where: { id }, include: { Batches: true } });
        if (product && !product.imageUrl && product.sku) {
            const globalRef = await this.masterPrisma.sharedCatalog.findUnique({ where: { sku: product.sku } });
            if (globalRef?.imageUrl) {
                product.imageUrl = globalRef.imageUrl;
            }
        }
        return product;
    }
    async update(subdomain, id, data) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const updated = await client.product.update({ where: { id }, data });
        if (updated.sku) {
            await this.masterCatalogService.upsertProduct({
                sku: updated.sku,
                productName: updated.name,
                category: updated.category,
                description: updated.description,
                basePrice: Number(updated.price),
                imageUrl: updated.imageUrl,
                tenantId: tenant.id
            });
        }
        return updated;
    }
    async delete(subdomain, id) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.product.delete({ where: { id } });
    }
    async updateStock(subdomain, id, quantity, type) {
        return { success: true };
    }
    async findAll(subdomain, options = {}) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const isPaginated = options.page || options.limit;
        const { skip, take, page, limit } = isPaginated
            ? (0, pagination_dto_1.parsePagination)(options.page, options.limit, 20)
            : { skip: undefined, take: undefined, page: 1, limit: 0 };
        const where = {};
        if (options.sellableOnly)
            where.isSellable = true;
        if (options.category)
            where.category = { equals: options.category, mode: 'insensitive' };
        if (options.search) {
            where.OR = [
                { name: { contains: options.search, mode: 'insensitive' } },
                { sku: { contains: options.search, mode: 'insensitive' } },
                { category: { contains: options.search, mode: 'insensitive' } },
            ];
        }
        const [products, total] = await Promise.all([
            client.product.findMany({
                where,
                include: { Batches: true },
                orderBy: { name: 'asc' },
                ...(isPaginated ? { skip, take } : {}),
            }),
            client.product.count({ where }),
        ]);
        const skus = products.map(p => p.sku).filter(Boolean);
        const globals = await this.masterPrisma.sharedCatalog.findMany({
            where: { sku: { in: skus } },
            select: { sku: true, imageUrl: true },
        });
        const globalMap = new Map(globals.map(g => [g.sku, g.imageUrl]));
        const productIds = products.map(p => p.id);
        const salesData = await client.saleItem.groupBy({
            by: ['productId'],
            where: { productId: { in: productIds } },
            _sum: { quantity: true }
        });
        const salesMap = new Map();
        salesData.forEach(s => salesMap.set(s.productId, s._sum.quantity || 0));
        const data = products.map(p => ({
            id: p.id,
            name: p.name,
            sku: p.sku || 'N/A',
            image: p.imageUrl || globalMap.get(p.sku) || null,
            imageUrl: p.imageUrl || globalMap.get(p.sku) || null,
            category: p.category,
            description: p.description,
            price: p.price,
            total_qty: p.stock,
            is_sellable: p.isSellable,
            parent_id: p.parentId,
            units_per_parent: p.unitsPerParent,
            salesCount: salesMap.get(p.id) || 0,
            batches: (p.Batches || []).map(b => ({
                id: b.id,
                qty: b.quantity,
                expiry: b.expiryDate.toISOString(),
                days_left: 0,
                status: 'GOOD',
            })),
        }));
        if (!isPaginated)
            return data;
        return (0, pagination_dto_1.buildPaginatedResponse)(data, total, page, limit);
    }
    async getCategories(subdomain) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const categories = await client.product.groupBy({
            by: ['category'],
            _count: {
                id: true,
            },
            where: {
                category: { not: null },
            }
        });
        const categoryMap = new Map();
        for (const c of categories) {
            if (!c.category)
                continue;
            const normalizedName = c.category.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
            categoryMap.set(normalizedName, (categoryMap.get(normalizedName) || 0) + c._count.id);
        }
        const imageMap = new Map();
        const imageProducts = await client.product.findMany({
            where: { imageUrl: { not: null } },
            select: { category: true, imageUrl: true }
        });
        for (const p of imageProducts) {
            if (!p.category || !p.imageUrl)
                continue;
            const normalizedName = p.category.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
            if (!imageMap.has(normalizedName)) {
                imageMap.set(normalizedName, p.imageUrl);
            }
        }
        return Array.from(categoryMap.entries()).map(([name, count]) => ({
            name,
            count,
            imageUrl: imageMap.get(name) || null
        })).sort((a, b) => a.name.localeCompare(b.name));
    }
    async getHomepageData(subdomain) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const products = await client.product.findMany({
            where: { isSellable: true },
            select: {
                id: true,
                name: true,
                sku: true,
                imageUrl: true,
                category: true,
                price: true,
            }
        });
        const salesData = await client.saleItem.groupBy({
            by: ['productId'],
            _sum: {
                quantity: true
            }
        });
        const salesMap = new Map();
        salesData.forEach(s => salesMap.set(s.productId, s._sum.quantity || 0));
        const normalizeCategory = (cat) => {
            if (!cat)
                return 'Uncategorized';
            return cat.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        };
        const categoryMap = new Map();
        for (const p of products) {
            const catName = normalizeCategory(p.category);
            const salesCount = salesMap.get(p.id) || 0;
            if (!categoryMap.has(catName)) {
                categoryMap.set(catName, {
                    name: catName,
                    totalCategorySales: 0,
                    products: []
                });
            }
            const catEntry = categoryMap.get(catName);
            catEntry.totalCategorySales += salesCount;
            catEntry.products.push({
                id: p.id,
                name: p.name,
                sku: p.sku || 'N/A',
                imageUrl: p.imageUrl,
                category: catName,
                price: p.price,
                salesCount
            });
        }
        const sortedCategories = Array.from(categoryMap.values()).sort((a, b) => {
            if (b.totalCategorySales === a.totalCategorySales) {
                return a.name.localeCompare(b.name);
            }
            return b.totalCategorySales - a.totalCategorySales;
        });
        for (const cat of sortedCategories) {
            cat.products.sort((a, b) => {
                if (b.salesCount === a.salesCount)
                    return a.name.localeCompare(b.name);
                return b.salesCount - a.salesCount;
            });
            cat.products = cat.products.slice(0, 6);
        }
        return sortedCategories;
    }
    async syncAll(subdomain) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const allProducts = await client.product.findMany();
        let synced = 0;
        let skipped = 0;
        const errors = [];
        for (const p of allProducts) {
            try {
                let sku = p.sku;
                if (!sku) {
                    sku = `SKU-${p.name.replace(/\s+/g, '-').toUpperCase().slice(0, 20)}-${p.id.slice(0, 6)}`;
                    await client.product.update({ where: { id: p.id }, data: { sku } });
                }
                await this.masterPrisma.sharedCatalog.upsert({
                    where: { sku },
                    update: {
                        productName: p.name,
                        category: p.category,
                        description: p.description,
                        basePrice: p.price,
                        imageUrl: p.imageUrl,
                        syncedAt: new Date(),
                        tenantId: tenant.id,
                    },
                    create: {
                        sku,
                        productName: p.name,
                        category: p.category,
                        description: p.description,
                        basePrice: p.price,
                        imageUrl: p.imageUrl,
                        tenantId: tenant.id,
                    },
                });
                synced++;
            }
            catch (err) {
                console.error(`[SyncAll] Failed for "${p.name}":`, err.message);
                errors.push(p.name);
                skipped++;
            }
        }
        return { success: true, synced, skipped, errors };
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
        master_prisma_service_1.MasterPrismaService,
        master_catalog_service_1.MasterCatalogService])
], ProductService);
//# sourceMappingURL=product.service.js.map