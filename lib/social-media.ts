/**
 * Social media integration - deprecated
 * TODO: Implement via backend API
 */

export const socialMedia = {
    post: async () => ({ success: false, error: 'Not implemented' }),
    schedule: async () => ({ success: false, error: 'Not implemented' }),
};

export async function exchangeCodeForToken(code: string, platform: 'facebook' | 'instagram') {
    return {
        accessToken: 'mock_access_token',
        pageId: 'mock_page_id',
        error: null
    };
}
