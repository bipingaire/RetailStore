import { apiClient } from '../api-client';

export async function login(email: string, password: string) {
    try {
        const response = await apiClient.post('/auth/login', { email, password });

        // Backend returns { access_token: string }
        const { access_token } = response;

        if (access_token) {
            // 1. Store in LocalStorage (for Client Side Requests)
            localStorage.setItem('accessToken', access_token);

            // 2. Set Cookie (for Server Components / Middleware)
            // Note: Middleware checks 'access_token' cookie.
            // We can set it via JS document.cookie
            document.cookie = `access_token=${access_token}; path=/; max-age=86400; SameSite=Lax`;

            return { success: true };
        }
        throw new Error('No access token returned');
    } catch (error) {
        console.error('Login Failed', error);
        throw error;
    }
}

export function logout() {
    localStorage.removeItem('access_token');
    document.cookie = 'access_token=; path=/; max-age=0';
    window.location.href = '/admin/login';
}

export function getToken() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('access_token');
    }
    return null;
}
