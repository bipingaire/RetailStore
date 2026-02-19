import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { TenantService } from '../tenant/tenant.service';

@Injectable()
export class SocialService {
    constructor(
        private prisma: TenantPrismaService,
        private tenantService: TenantService
    ) { }

    async saveSettings(subdomain: string, accounts: any) {
        const platforms = ['facebook', 'instagram', 'tiktok'];
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.prisma.getTenantClient(tenant.databaseUrl);

        for (const p of platforms) {
            const pageId = accounts[p];
            const token = accounts[`${p}_token`];

            if (pageId && token) {
                // Upsert logic
                // Prisma upsert requires a unique constraint. 
                // schema-tenant.prisma: model SocialAccount { ... } 
                // It doesn't have a unique constraint on [platform, accountId] in the schema I saw?
                // Step 1434: model SocialAccount { ... id, platform, accountId, accessToken ... }
                // No @@unique.
                // I should add @@unique([platform, accountId]) to schema?
                // Or just findFirst and update/create.

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
                } else {
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

    async getSettings(subdomain: string) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.prisma.getTenantClient(tenant.databaseUrl);

        const accounts = await client.socialAccount.findMany();
        // Transform array to object { facebook: pageId, facebook_token: token ... }
        const result: any = {};
        for (const acc of accounts) {
            result[acc.platform] = acc.accountId;
            result[`${acc.platform}_token`] = acc.accessToken;
        }
        return result;
    }

    async publish(subdomain: string, campaignId: string, platforms: string[]) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.prisma.getTenantClient(tenant.databaseUrl);

        const campaign = await client.campaign.findUnique({
            where: { id: campaignId }
        });

        if (!campaign) throw new NotFoundException('Campaign not found');

        const results = [];

        // Facebook Logic
        if (platforms.includes('facebook')) {
            const fbAcc = await client.socialAccount.findFirst({
                where: { platform: 'facebook' }
            });

            if (fbAcc && fbAcc.accessToken) {
                try {
                    // Start of Mock/Real logic
                    // In real implementation, use fetch/axios
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
                    if (!response.ok) throw new Error(data.error?.message || 'FB API Error');
                    results.push({ platform: 'facebook', status: 'success', id: data.id });
                } catch (e: any) {
                    results.push({ platform: 'facebook', status: 'error', error: e.message });
                }
            } else {
                results.push({ platform: 'facebook', status: 'skipped', reason: 'No account' });
            }
        }

        return { success: true, results };
    }
}
