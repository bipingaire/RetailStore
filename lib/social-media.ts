// Social Media Service - Facebook & Instagram Integration
// DEPRECATED: Logic moved to FastAPI Backend
// import { createClient } from '@supabase/supabase-js';

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

// ===== FACEBOOK & INSTAGRAM INTEGRATION =====
// Logic has been moved to the Backend Python Social Router.
// This file is kept temporarily if validation or types are imported elsewhere.

export async function postToFacebook(
    account: SocialAccount,
    post: SocialPost
): Promise<{ success: boolean; postId?: string; error?: string }> {
    return { success: false, error: "Moved to Backend API" };
}

export async function postToInstagram(
    account: SocialAccount,
    post: SocialPost
): Promise<{ success: boolean; postId?: string; error?: string }> {
    return { success: false, error: "Moved to Backend API" };
}

export async function postToBothPlatforms(
    post: SocialPost,
    platforms: ('facebook' | 'instagram')[] = ['facebook', 'instagram']
): Promise<{
    facebook?: { success: boolean; postId?: string; error?: string };
    instagram?: { success: boolean; postId?: string; error?: string };
}> {
    console.warn("Using legacy social media lib. Please migrate to backend API.");
    return {
        facebook: { success: false, error: "Use Backend API" },
        instagram: { success: false, error: "Use Backend API" },
    };
}

export async function exchangeCodeForToken(
    code: string,
    platform: 'facebook' | 'instagram'
): Promise<{ accessToken?: string; pageId?: string; error?: string }> {
    return { error: "Moved to Backend API" };
}
