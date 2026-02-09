export const apiClient = {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',

    async request(endpoint: string, options: RequestInit = {}) {
        const token = localStorage.getItem('access_token');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            (headers as any)['Authorization'] = 'Bearer ' + token;
        }

        const hostname = window.location.hostname;
        const parts = hostname.split('.');
        let subdomain = 'public';
        if (parts.length > 1 && parts[0] !== 'www') {
            subdomain = parts[0];
        }
        if (hostname === 'localhost') subdomain = 'anuj';

        (headers as any)['x-tenant'] = subdomain;

        const response = await fetch(this.baseUrl + endpoint, {
            ...options,
            headers,
        });

        if (!response.ok) {
            throw new Error('API Error: ' + response.statusText);
        }

        return response.json();
    },

    get(endpoint: string) {
        return this.request(endpoint, { method: 'GET' });
    },

    post(endpoint: string, body: any) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    },

    put(endpoint: string, body: any) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    },

    delete(endpoint: string) {
        return this.request(endpoint, { method: 'DELETE' });
    },
};
