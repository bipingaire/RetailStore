export const apiClient = {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',

    async request(endpoint: string, options: RequestInit = {}) {
        const token = localStorage.getItem('accessToken');
        let headers: any = {
            ...options.headers,
        };

        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        if (token) {
            headers['Authorization'] = 'Bearer ' + token;
        }

        const hostname = window.location.hostname;
        const parts = hostname.split('.');
        let subdomain = 'public';
        // A real subdomain requires 3+ parts: greensboro.indumart.us -> ['greensboro','indumart','us']
        // indumart.us (2 parts) has no subdomain — keep 'public'
        if (parts.length >= 3 && parts[0] !== 'www') {
            subdomain = parts[0];
        }
        if (hostname === 'localhost') subdomain = 'anuj';

        (headers as any)['x-tenant'] = subdomain;

        const response = await fetch(this.baseUrl + endpoint, {
            ...options,
            headers,
        });

        if (!response.ok) {
            // Try to read the JSON body for a meaningful error message
            try {
                const errBody = await response.json();
                const msg = errBody?.message || errBody?.error || response.statusText;
                const text = Array.isArray(msg) ? msg.join(', ') : msg;
                throw new Error(text);
            } catch (e: any) {
                if (e.message && e.message !== response.statusText) throw e;
                throw new Error(response.statusText);
            }
        }

        return response.json();
    },

    get(endpoint: string) {
        return this.request(endpoint, { method: 'GET' });
    },

    post(endpoint: string, body: any) {
        return this.request(endpoint, {
            method: 'POST',
            body: body instanceof FormData ? body : JSON.stringify(body),
        });
    },

    put(endpoint: string, body: any) {
        return this.request(endpoint, {
            method: 'PUT',
            body: body instanceof FormData ? body : JSON.stringify(body),
        });
    },

    delete(endpoint: string) {
        return this.request(endpoint, { method: 'DELETE' });
    },

    patch(endpoint: string, body: any) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: body instanceof FormData ? body : JSON.stringify(body),
        });
    },
};
