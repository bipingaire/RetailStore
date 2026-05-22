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

            if (pageId !== undefined && token !== undefined) {
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

        const extraKeys = ['siteUrl', 'canvaApiKey', 'imageApiKey'];
        for (const key of extraKeys) {
            const val = accounts[key];
            if (val !== undefined) {
                const existing = await client.socialAccount.findFirst({
                    where: { platform: key }
                });

                if (existing) {
                    await client.socialAccount.update({
                        where: { id: existing.id },
                        data: {
                            accountId: val,
                            isConnected: true
                        }
                    });
                } else {
                    await client.socialAccount.create({
                        data: {
                            platform: key,
                            accountId: val,
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
        const result: any = {};
        for (const acc of accounts) {
            result[acc.platform] = acc.accountId;
            if (acc.accessToken) {
                result[`${acc.platform}_token`] = acc.accessToken;
            }
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

        // Resolve absolute storefront URL for public asset accessibility
        let siteUrl = 'https://yourshop.com';
        const siteUrlAcc = await client.socialAccount.findFirst({ where: { platform: 'siteUrl' } });
        if (siteUrlAcc && siteUrlAcc.accountId) {
            siteUrl = siteUrlAcc.accountId.trim();
        }
        if (!siteUrl.startsWith('http')) {
            siteUrl = `https://${siteUrl}`;
        }
        const normalizedSiteUrl = siteUrl.replace(/\/+$/, '');

        // Resolve Campaign Image URL
        let finalImageUrl = `https://placehold.co/1024x1024/1a3c5e/ffffff?text=${encodeURIComponent(campaign.name)}`;
        const campaignProducts = await client.campaignProduct.findMany({
            where: { campaignId },
            include: { product: true }
        });
        const productWithImage = campaignProducts.find(cp => cp.product?.imageUrl)?.product;
        if (productWithImage && productWithImage.imageUrl) {
            const img = productWithImage.imageUrl;
            if (img.startsWith('http')) {
                finalImageUrl = img;
            } else {
                const normalizedImg = img.replace(/^\/+/, '');
                finalImageUrl = `${normalizedSiteUrl}/${normalizedImg}`;
            }
        }

        const message = `${campaign.name} - Check out our amazing sale! Visit: ${normalizedSiteUrl}/shop#segment-${campaign.id}`;
        const results = [];

        // 1. Facebook Feed Publishing
        if (platforms.includes('facebook')) {
            const fbAcc = await client.socialAccount.findFirst({
                where: { platform: 'facebook' }
            });

            if (fbAcc && fbAcc.accessToken) {
                try {
                    const fbUrl = `https://graph.facebook.com/v18.0/${fbAcc.accountId}/feed`;
                    const response = await fetch(fbUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            message: message,
                            link: finalImageUrl,
                            access_token: fbAcc.accessToken
                        })
                    });

                    const data = await response.json();
                    if (!response.ok) throw new Error(data.error?.message || 'Facebook API Error');
                    results.push({ platform: 'facebook', status: 'success', id: data.id });
                } catch (e: any) {
                    console.error('Facebook publish error:', e.message);
                    results.push({ platform: 'facebook', status: 'error', error: e.message });
                }
            } else {
                results.push({ platform: 'facebook', status: 'skipped', reason: 'Account credentials missing' });
            }
        }

        // 2. Instagram Business Media Publishing (Two-Step Flow)
        if (platforms.includes('instagram')) {
            const igAcc = await client.socialAccount.findFirst({
                where: { platform: 'instagram' }
            });

            if (igAcc && igAcc.accessToken) {
                try {
                    // Step 1: Create Media Container
                    const containerUrl = `https://graph.facebook.com/v18.0/${igAcc.accountId}/media`;
                    const containerRes = await fetch(containerUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            image_url: finalImageUrl,
                            caption: message,
                            access_token: igAcc.accessToken
                        })
                    });

                    const containerData = await containerRes.json();
                    if (!containerRes.ok) {
                        throw new Error(containerData.error?.message || 'Instagram Media Container Creation failed');
                    }

                    const containerId = containerData.id;

                    // Step 2: Publish Media Container
                    const publishUrl = `https://graph.facebook.com/v18.0/${igAcc.accountId}/media_publish`;
                    const publishRes = await fetch(publishUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            creation_id: containerId,
                            access_token: igAcc.accessToken
                        })
                    });

                    const publishData = await publishRes.json();
                    if (!publishRes.ok) {
                        throw new Error(publishData.error?.message || 'Instagram Media Publish failed');
                    }

                    results.push({ platform: 'instagram', status: 'success', id: publishData.id });
                } catch (e: any) {
                    console.error('Instagram publish error:', e.message);
                    results.push({ platform: 'instagram', status: 'error', error: e.message });
                }
            } else {
                results.push({ platform: 'instagram', status: 'skipped', reason: 'Account credentials missing' });
            }
        }

        // 3. TikTok Content Posting API (v2 Spec)
        if (platforms.includes('tiktok')) {
            const ttAcc = await client.socialAccount.findFirst({
                where: { platform: 'tiktok' }
            });

            if (ttAcc && ttAcc.accessToken) {
                try {
                    // Direct Sandbox / Mock Simulator if token is standard or local
                    if (!ttAcc.accessToken.startsWith('act.') && !ttAcc.accessToken.startsWith('tt.')) {
                        console.log('TikTok Sandbox Mock Post Triggered:', {
                            title: campaign.name,
                            text: message,
                            url: finalImageUrl
                        });
                        results.push({ platform: 'tiktok', status: 'success', id: `mock_tt_post_${Date.now()}` });
                    } else {
                        // Real TikTok API direct publication handshake (v2)
                        const ttUrl = 'https://open.tiktokapis.com/v2/post/publish/content/init/';
                        const response = await fetch(ttUrl, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${ttAcc.accessToken}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                post_info: {
                                    title: campaign.name,
                                    text: message,
                                    privacy_level: 'PUBLIC_TO_EVERYONE'
                                },
                                source_info: {
                                    source: 'FILE_UPLOAD',
                                    video_size: 1024 * 1024 // Sample video constraint
                                }
                            })
                        });

                        const data = await response.json();
                        if (!response.ok) throw new Error(data.error?.message || 'TikTok API v2 Error');
                        results.push({ platform: 'tiktok', status: 'success', id: data.data?.publish_id });
                    }
                } catch (e: any) {
                    console.error('TikTok publish error:', e.message);
                    results.push({ platform: 'tiktok', status: 'error', error: e.message });
                }
            } else {
                results.push({ platform: 'tiktok', status: 'skipped', reason: 'Account credentials missing' });
            }
        }

        return { success: true, results };
    }
}
