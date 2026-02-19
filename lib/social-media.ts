/**
 * Social media integration - deprecated
 * TODO: Implement via backend API
 */

export const socialMedia = {
    post: async () => ({ success: false, error: 'Not implemented' }),
    schedule: async () => ({ success: false, error: 'Not implemented' }),
};

export async function exchangeCodeForToken(platform: string, code: string) {
    return {
        access_token: 'mock_token',
        refresh_token: 'mock_refresh',
        expires_in: 3600
    };
}
