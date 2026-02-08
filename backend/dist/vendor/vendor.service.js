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
exports.VendorService = void 0;
const common_1 = require("@nestjs/common");
const tenant_service_1 = require("../tenant/tenant.service");
const tenant_prisma_service_1 = require("../prisma/tenant-prisma.service");
let VendorService = class VendorService {
    constructor(tenantService, tenantPrisma) {
        this.tenantService = tenantService;
        this.tenantPrisma = tenantPrisma;
    }
    async findAll(subdomain) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const vendors = await client.vendor.findMany({
            include: { PurchaseOrders: true }
        });
        return vendors.map(v => ({
            id: v.id,
            name: v.name,
            'contact-phone': v.phone,
            email: v.email,
            address: v.address,
            'poc-name': v.contactPerson,
            'reliability-score': 95
        }));
    }
    async findInvoices(subdomain) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const pos = await client.purchaseOrder.findMany({
            include: { vendor: true },
            orderBy: { orderDate: 'desc' }
        });
        return pos.map(po => ({
            'invoice-id': po.id,
            'invoice-number': po.poNumber,
            'invoice-date': po.orderDate,
            'total-amount-value': po.totalAmount,
            'processing-status': po.status,
            'supplier-name': po.vendor.name
        }));
    }
};
exports.VendorService = VendorService;
exports.VendorService = VendorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_service_1.TenantService,
        tenant_prisma_service_1.TenantPrismaService])
], VendorService);
//# sourceMappingURL=vendor.service.js.map