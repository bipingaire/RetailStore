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
exports.SaleService = void 0;
const common_1 = require("@nestjs/common");
const tenant_service_1 = require("../tenant/tenant.service");
const tenant_prisma_service_1 = require("../prisma/tenant-prisma.service");
const openai_1 = require("openai");
const settings_service_1 = require("../settings/settings.service");
const stripe_1 = require("stripe");
const pagination_dto_1 = require("../common/pagination.dto");
let SaleService = class SaleService {
    constructor(tenantService, tenantPrisma, settingsService) {
        this.tenantService = tenantService;
        this.tenantPrisma = tenantPrisma;
        this.settingsService = settingsService;
    }
    async createSale(subdomain, data) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.$transaction(async (tx) => {
            let customerId = data.customerId || null;
            if (!customerId && data.customerName) {
                if (data.customerEmail) {
                    const existing = await tx.customer.findFirst({
                        where: { email: data.customerEmail }
                    });
                    if (existing) {
                        customerId = existing.id;
                    }
                }
                if (!customerId) {
                    const existingContact = await tx.customer.findFirst({
                        where: {
                            OR: [
                                data.customerEmail ? { email: data.customerEmail } : undefined,
                                data.customerPhone ? { phone: data.customerPhone } : undefined,
                            ].filter(Boolean)
                        }
                    });
                    if (existingContact) {
                        customerId = existingContact.id;
                    }
                    else {
                        const newCustomer = await tx.customer.create({
                            data: {
                                name: data.customerName,
                                email: data.customerEmail || null,
                                phone: data.customerPhone || null,
                            }
                        });
                        customerId = newCustomer.id;
                    }
                }
            }
            const sale = await tx.sale.create({
                data: {
                    saleNumber: `SALE-${Date.now()}`,
                    userId: data.userId,
                    customerId: customerId,
                    subtotal: data.subtotal,
                    tax: data.tax ?? 0,
                    discount: data.discount ?? 0,
                    total: data.total,
                    status: 'PENDING',
                    paymentMethod: data.paymentMethod || 'CASH',
                    paymentStatus: data.paymentMethod === 'CARD' ? 'PAID' : 'PENDING',
                    items: {
                        create: data.items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            subtotal: item.subtotal,
                        }))
                    }
                },
                include: { items: true }
            });
            for (const item of data.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
                await tx.stockMovement.create({
                    data: {
                        productId: item.productId,
                        type: 'SALE',
                        quantity: -item.quantity,
                        description: `Sale ${sale.saleNumber}`
                    }
                });
            }
            return sale;
        });
    }
    async findMyOrders(subdomain, userId) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.sale.findMany({
            where: { userId },
            include: {
                items: {
                    include: { product: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findAll(subdomain, options = {}) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const { skip, take, page, limit } = (0, pagination_dto_1.parsePagination)(options.page, options.limit, 20);
        const where = {};
        if (options.status)
            where.status = options.status.toUpperCase();
        if (options.userId)
            where.userId = options.userId;
        if (options.customerId)
            where.customerId = options.customerId;
        if (options.startDate || options.endDate) {
            where.createdAt = {};
            if (options.startDate)
                where.createdAt.gte = new Date(options.startDate);
            if (options.endDate)
                where.createdAt.lte = new Date(options.endDate);
        }
        if (options.search) {
            where.saleNumber = { contains: options.search, mode: 'insensitive' };
        }
        const [sales, total] = await Promise.all([
            client.sale.findMany({
                where,
                include: {
                    items: { include: { product: true } },
                    customer: true,
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            client.sale.count({ where }),
        ]);
        if (!options.page && !options.limit)
            return sales;
        return (0, pagination_dto_1.buildPaginatedResponse)(sales, total, page, limit);
    }
    async findOne(subdomain, id) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const sale = await client.sale.findUnique({
            where: { id },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });
        if (!sale)
            throw new common_1.NotFoundException('Sale not found');
        return sale;
    }
    async getSalesStats(subdomain) {
        return { totalSales: 0, totalRevenue: 0 };
    }
    async cancelSale(subdomain, id, userId) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.sale.update({ where: { id }, data: { status: 'CANCELLED' } });
    }
    async syncSalesFromImage(subdomain, imageUrl) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `Extract sold items from this POS Sales Report Image.
          Return JSON: { "sales": [ { "name": "Raw POS Name", "sku": "POS Code", "qty": 5, "sold_price": 2.50 } ] }.
          Ignore totals/tax lines.`
                },
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Parse this sales report." },
                        { type: "image_url", image_url: { url: imageUrl } },
                    ],
                },
            ],
        });
        const cleanJson = completion.choices[0].message.content?.replace(/```json/g, '').replace(/```/g, '').trim();
        const { sales } = JSON.parse(cleanJson || '{ "sales": [] }');
        const results = [];
        for (const sale of sales) {
            try {
                await client.$transaction(async (tx) => {
                    let productId = null;
                    const existingMap = await tx.pOSItemMapping.findFirst({
                        where: { posItemName: sale.name }
                    });
                    if (existingMap) {
                        productId = existingMap.matchedInventoryId;
                        if (Number(existingMap.lastSoldPrice) !== sale.sold_price) {
                            await tx.pOSItemMapping.update({
                                where: { id: existingMap.id },
                                data: { lastSoldPrice: sale.sold_price }
                            });
                        }
                    }
                    else {
                        const itemDescription = sale.name.replace(/[^a-zA-Z0-9 ]/g, '');
                        let match = await tx.product.findFirst({
                            where: { name: { contains: itemDescription, mode: 'insensitive' } }
                        });
                        if (match) {
                            productId = match.id;
                        }
                        else {
                            const newProduct = await tx.product.create({
                                data: {
                                    name: `${sale.name} (POS Import)`,
                                    sku: `POS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                                    price: sale.sold_price,
                                    costPrice: 0,
                                    stock: 0,
                                    isActive: true
                                }
                            });
                            productId = newProduct.id;
                        }
                        await tx.pOSItemMapping.create({
                            data: {
                                tenantId: tenant.id,
                                posItemName: sale.name,
                                product: { connect: { id: productId } },
                                lastSoldPrice: sale.sold_price,
                                confidenceScore: match ? 0.8 : 1.0,
                            }
                        });
                    }
                    if (productId) {
                        await tx.product.update({
                            where: { id: productId },
                            data: { stock: { decrement: sale.qty } }
                        });
                        await tx.stockMovement.create({
                            data: {
                                productId: productId,
                                type: 'OUT',
                                quantity: sale.qty,
                                description: `POS Sync: ${sale.name}`
                            }
                        });
                    }
                    results.push({ name: sale.name, status: 'processed', qty: sale.qty, qty_deducted: sale.qty });
                });
            }
            catch (error) {
                console.error(`Error processing item ${sale.name}:`, error);
                results.push({ name: sale.name, status: 'failed', error: error.message });
            }
        }
        return { success: true, processed: results };
    }
    async createPaymentIntent(subdomain, amount, currency = 'usd') {
        const secretKey = await this.settingsService.getSetting(subdomain, 'stripe_secret_key');
        if (!secretKey) {
            throw new common_1.NotFoundException('Stripe not configured for this tenant');
        }
        const stripe = new stripe_1.default(secretKey, {
            apiVersion: '2024-11-20.acacia',
        });
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });
        return {
            clientSecret: paymentIntent.client_secret,
        };
    }
    async updateSaleStatus(subdomain, saleId, status) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'READY', 'DELIVERED', 'COMPLETED', 'CANCELLED'];
        const upperStatus = status.toUpperCase();
        if (!validStatuses.includes(upperStatus)) {
            throw new common_1.NotFoundException(`Invalid status: ${status}. Valid: ${validStatuses.join(', ')}`);
        }
        const updated = await client.sale.update({
            where: { id: saleId },
            data: { status: upperStatus },
        });
        return { success: true, id: updated.id, status: updated.status };
    }
    async updatePaymentStatus(subdomain, saleId, paymentStatus) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const validStatuses = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];
        const upperStatus = paymentStatus.toUpperCase();
        if (!validStatuses.includes(upperStatus)) {
            throw new common_1.NotFoundException(`Invalid payment status: ${paymentStatus}. Valid: ${validStatuses.join(', ')}`);
        }
        const updated = await client.sale.update({
            where: { id: saleId },
            data: { paymentStatus: upperStatus },
        });
        return { success: true, id: updated.id, paymentStatus: updated.paymentStatus };
    }
};
exports.SaleService = SaleService;
exports.SaleService = SaleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_service_1.TenantService,
        tenant_prisma_service_1.TenantPrismaService,
        settings_service_1.SettingsService])
], SaleService);
//# sourceMappingURL=sale.service.js.map