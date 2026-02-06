// Social Media Service - Facebook & Instagram Integration
import { supabase } from './supabase';


export interface SocialPost {
    message: string;
    imageUrl?: string;
    link?: string;
    campaignId?: string;
    tenantId: string;
}

export interface SocialAccount {
    platform: 'facebook' | 'instagram';
    pageId: string;
    accessToken: string;
}

// ===== FACEBOOK INTEGRATION =====

/**
 * Post to Facebook Page
 * Docs: https://developers.facebook.com/docs/pages-api/posts
 */
export async function postToFacebook(
    account: SocialAccount,
    post: SocialPost
): Promise<{ success: boolean; postId?: string; error?: string }> {
    try {
        const { pageId, accessToken } = account;
        const { message, imageUrl, link } = post;

        // Construct Facebook API request
        const url = `https://graph.facebook.com/v18.0/${pageId}/feed`;

        const body: any = {
            message,
            access_token: accessToken,
        };

        if (link) body.link = link;
        if (imageUrl) {
            // If image, use /photos endpoint instead
            const photoUrl = `https://graph.facebook.com/v18.0/${pageId}/photos`;
            const photoResponse = await fetch(photoUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: imageUrl,
                    caption: message,
                    access_token: accessToken,
                }),
            });

            const photoData = await photoResponse.json();
            if (photoData.error) {
                return { success: false, error: photoData.error.message };
            }

            return { success: true, postId: photoData.id };
        }

        // Post text/link
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (data.error) {
            return { success: false, error: data.error.message };
        }

        return { success: true, postId: data.id };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// ===== INSTAGRAM INTEGRATION =====

/**
 * Post to Instagram Business Account
 * Docs: https://developers.facebook.com/docs/instagram-api/guides/content-publishing
 * Note: Instagram requires 2-step process: create container → publish
 */
export async function postToInstagram(
    account: SocialAccount,
    post: SocialPost
): Promise<{ success: boolean; postId?: string; error?: string }> {
    try {
        const { pageId: instagramAccountId, accessToken } = account;
        const { message, imageUrl } = post;

        if (!imageUrl) {
            return { success: false, error: 'Instagram posts require an image' };
        }

        // Step 1: Create Media Container
        const containerUrl = `https://graph.facebook.com/v18.0/${instagramAccountId}/media`;
        const containerResponse = await fetch(containerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image_url: imageUrl,
                caption: message,
                access_token: accessToken,
            }),
        });

        const containerData = await containerResponse.json();
        if (containerData.error) {
            return { success: false, error: containerData.error.message };
        }

        const creationId = containerData.id;

        // Step 2: Publish Container
        const publishUrl = `https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish`;
        const publishResponse = await fetch(publishUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                creation_id: creationId,
                access_token: accessToken,
            }),
        });

        const publishData = await publishResponse.json();
        if (publishData.error) {
            return { success: false, error: publishData.error.message };
        }

        return { success: true, postId: publishData.id };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// ===== COMBINED POSTING =====

/**
 * Post to both Facebook and Instagram
 */
export async function postToBothPlatforms(
    post: SocialPost,
    platforms: ('facebook' | 'instagram')[] = ['facebook', 'instagram']
): Promise<{
    facebook?: { success: boolean; postId?: string; error?: string };
    instagram?: { success: boolean; postId?: string; error?: string };
}> {
    const results: any = {};

    // Fetch connected accounts for tenant
    const { data: accounts } = await supabase
        .from('social-media-accounts')
        .select('*')
        .eq('tenant-id', post.tenantId)
        .eq('is-active', true)
        .in('platform', platforms);

    if (!accounts || accounts.length === 0) {
        return {
            facebook: { success: false, error: 'No connected accounts' },
            instagram: { success: false, error: 'No connected accounts' },
        };
    }

    // Post to each platform
    for (const account of accounts) {
        const socialAccount: SocialAccount = {
            platform: account.platform,
            pageId: account['page-id'],
            accessToken: account['access-token'],
        };

        if (account.platform === 'facebook' && platforms.includes('facebook')) {
            results.facebook = await postToFacebook(socialAccount, post);

            // Track in database
            await supabase.from('social-media-posts').insert({
                'tenant-id': post.tenantId,
                'campaign-id': post.campaignId,
                platform: 'facebook',
                'post-content': post.message,
                'image-url': post.imageUrl,
                'facebook-post-id': results.facebook.postId,
                status: results.facebook.success ? 'published' : 'failed',
                'error-message': results.facebook.error,
            });
        }

        if (account.platform === 'instagram' && platforms.includes('instagram')) {
            results.instagram = await postToInstagram(socialAccount, post);

            // Track in database
            await supabase.from('social-media-posts').insert({
                'tenant-id': post.tenantId,
                'campaign-id': post.campaignId,
                platform: 'instagram',
                'post-content': post.message,
                'image-url': post.imageUrl,
                'instagram-post-id': results.instagram.postId,
                status: results.instagram.success ? 'published' : 'failed',
                'error-message': results.instagram.error,
            });
        }
    }

    return results;
}

// ===== OAUTH TOKEN EXCHANGE =====

/**
 * Exchange OAuth code for long-lived access token
 */
export async function exchangeCodeForToken(
    code: string,
    platform: 'facebook' | 'instagram'
): Promise<{ accessToken?: string; pageId?: string; error?: string }> {
    try {
        const appId = process.env.META_APP_ID!;
        const appSecret = process.env.META_APP_SECRET!;
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/social/oauth/callback`;

        // Step 1: Exchange code for short-lived token
        const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${appId}&redirect_uri=${redirectUri}&client_secret=${appSecret}&code=${code}`;

        const tokenResponse = await fetch(tokenUrl);
        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            return { error: tokenData.error.message };
        }

        const shortLivedToken = tokenData.access_token;

        // Step 2: Exchange for long-lived token (60 days)
        const longLivedUrl = `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`;

        const longLivedResponse = await fetch(longLivedUrl);
        const longLivedData = await longLivedResponse.json();

        if (longLivedData.error) {
            return { error: longLivedData.error.message };
        }

        // Step 3: Get Page Access Token (never expires)
        const pagesUrl = `https://graph.facebook.com/v18.0/me/accounts?access_token=${longLivedData.access_token}`;
        const pagesResponse = await fetch(pagesUrl);
        const pagesData = await pagesResponse.json();

        if (pagesData.error || !pagesData.data || pagesData.data.length === 0) {
            return { error: 'No Facebook Pages found. Please create a Page first.' };
        }

        // Use first page
        const page = pagesData.data[0];

        return {
            accessToken: page.access_token, // Never expires!
            pageId: page.id,
        };
    } catch (error: any) {
        return { error: error.message };
    }
}
