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
exports.PosMappingService = void 0;
const common_1 = require("@nestjs/common");
const tenant_service_1 = require("../tenant/tenant.service");
const tenant_prisma_service_1 = require("../prisma/tenant-prisma.service");
let PosMappingService = class PosMappingService {
    constructor(tenantService, tenantPrisma) {
        this.tenantService = tenantService;
        this.tenantPrisma = tenantPrisma;
    }
    async findAll(subdomain) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.pOSItemMapping.findMany({
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        imageUrl: true,
                        sku: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async updateMapping(subdomain, id, data) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.pOSItemMapping.update({
            where: { id },
            data: {
                matchedInventoryId: data.inventoryId,
                confidenceScore: data.confidenceScore || 1.0,
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        imageUrl: true,
                    }
                }
            }
        });
    }
    async verifyMapping(subdomain, id) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.pOSItemMapping.update({
            where: { id },
            data: { confidenceScore: 1.0 }
        });
    }
};
exports.PosMappingService = PosMappingService;
exports.PosMappingService = PosMappingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_service_1.TenantService,
        tenant_prisma_service_1.TenantPrismaService])
], PosMappingService);
//# sourceMappingURL=pos-mapping.service.js.map