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
exports.CampaignService = void 0;
const common_1 = require("@nestjs/common");
const tenant_service_1 = require("../tenant/tenant.service");
const tenant_prisma_service_1 = require("../prisma/tenant-prisma.service");
let CampaignService = class CampaignService {
    constructor(tenantService, tenantPrisma) {
        this.tenantService = tenantService;
        this.tenantPrisma = tenantPrisma;
    }
    async createCampaign(subdomain, data) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.campaign.create({
            data: {
                name: data.name,
                type: data.type || 'SOCIAL',
                status: data.status || 'DRAFT',
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
                budget: data.budget,
            },
        });
    }
    async updateCampaign(subdomain, id, data) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.type !== undefined)
            updateData.type = data.type;
        if (data.status !== undefined)
            updateData.status = data.status;
        if (data.startDate !== undefined)
            updateData.startDate = new Date(data.startDate);
        if (data.endDate !== undefined)
            updateData.endDate = new Date(data.endDate);
        if (data.budget !== undefined)
            updateData.budget = data.budget;
        return client.campaign.update({
            where: { id },
            data: updateData,
        });
    }
    async deleteCampaign(subdomain, id) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.campaign.delete({ where: { id } });
    }
    async listCampaigns(subdomain) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.campaign.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async generateCampaignContent(data) {
        const productNames = data.products.map((p) => p.name || 'our products').join(', ');
        return {
            post: `🎉 Flash Sale Alert! 🚀\n\nCheck out amazing deals on ${productNames}! \n\nGet 20% OFF this week only. Don't miss out! #Sale #Deals`,
            image: 'https://via.placeholder.com/600x400?text=Sale+Campaign',
        };
    }
};
exports.CampaignService = CampaignService;
exports.CampaignService = CampaignService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_service_1.TenantService,
        tenant_prisma_service_1.TenantPrismaService])
], CampaignService);
//# sourceMappingURL=campaign.service.js.map