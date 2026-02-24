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
exports.SocialService = void 0;
const common_1 = require("@nestjs/common");
const tenant_prisma_service_1 = require("../prisma/tenant-prisma.service");
const tenant_service_1 = require("../tenant/tenant.service");
let SocialService = class SocialService {
    constructor(prisma, tenantService) {
        this.prisma = prisma;
        this.tenantService = tenantService;
    }
    async saveSettings(subdomain, accounts) {
        const platforms = ['facebook', 'instagram', 'tiktok'];
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.prisma.getTenantClient(tenant.databaseUrl);
        for (const p of platforms) {
            const pageId = accounts[p];
            const token = accounts[`${p}_token`];
            if (pageId && token) {
                const existing = await client.socialAccount.findFirst({
                    where: { platform: p }
                });
                if (existing) {
                    await client.socialAccount.update({
                        where: { id: existing.id },
                        data: {
                            accountId: pageId,
                            accessToken: token,
                            isConnected: true
                        }
                    });
                }
                else {
                    await client.socialAccount.create({
                        data: {
                            platform: p,
                            accountId: pageId,
                            accessToken: token,
                            isConnected: true
                        }
                    });
                }
            }
        }
        return { success: true };
    }
    async getSettings(subdomain) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.prisma.getTenantClient(tenant.databaseUrl);
        const accounts = await client.socialAccount.findMany();
        const result = {};
        for (const acc of accounts) {
            result[acc.platform] = acc.accountId;
            result[`${acc.platform}_token`] = acc.accessToken;
        }
        return result;
    }
    async publish(subdomain, campaignId, platforms) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.prisma.getTenantClient(tenant.databaseUrl);
        const campaign = await client.campaign.findUnique({
            where: { id: campaignId }
        });
        if (!campaign)
            throw new common_1.NotFoundException('Campaign not found');
        const results = [];
        if (platforms.includes('facebook')) {
            const fbAcc = await client.socialAccount.findFirst({
                where: { platform: 'facebook' }
            });
            if (fbAcc && fbAcc.accessToken) {
                try {
                    const message = `${campaign.name} - Check it out!`;
                    const fbUrl = `https://graph.facebook.com/v18.0/${fbAcc.accountId}/feed`;
                    const response = await fetch(fbUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            message: message,
                            access_token: fbAcc.accessToken
                        })
                    });
                    const data = await response.json();
                    if (!response.ok)
                        throw new Error(data.error?.message || 'FB API Error');
                    results.push({ platform: 'facebook', status: 'success', id: data.id });
                }
                catch (e) {
                    results.push({ platform: 'facebook', status: 'error', error: e.message });
                }
            }
            else {
                results.push({ platform: 'facebook', status: 'skipped', reason: 'No account' });
            }
        }
        return { success: true, results };
    }
};
exports.SocialService = SocialService;
exports.SocialService = SocialService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_prisma_service_1.TenantPrismaService,
        tenant_service_1.TenantService])
], SocialService);
//# sourceMappingURL=social.service.js.map