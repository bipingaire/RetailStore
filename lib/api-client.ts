/**
 * FastAPI Backend Client
 * 
 * Replaces Supabase client with direct FastAPI calls.
 * Handles authentication, tenant routing, and all API operations.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL !== undefined ? process.env.NEXT_PUBLIC_API_URL : 'http://localhost:8000';

export class APIClient {
    private subdomain: string;

    constructor() {
        // Get subdomain from hostname or localStorage
        if (typeof window !== 'undefined') {
            const hostname = window.location.hostname;
            this.subdomain = hostname.includes('localhost')
                ? (localStorage.getItem('subdomain') || 'demo1')
                : hostname.split('.')[0];
        } else {
            this.subdomain = 'demo1'; // Default for SSR
        }
    }

    /**
     * Generic request handler
     */
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

        const headers: Record<string, string> = {
            'X-Subdomain': this.subdomain,
            ...((options.headers as Record<string, string>) || {}),
        };

        // Add auth token if available
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Add content-type for JSON requests
        if (options.body && typeof options.body === 'string') {
            headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`API Error (${response.status}): ${error}`);
        }

        return response.json();
    }

    // ==================== AUTH ====================

    /**
     * Login as admin or customer
     */
    async login(email: string, password: string, role: 'admin' | 'customer' | 'superadmin', subdomain?: string) {
        const formData = new URLSearchParams({
            username: email,
            password: password,
        });

        // Use the override subdomain if provided, otherwise fallback to instance default
        const targetSubdomain = subdomain || this.subdomain;

        // NOTE: The backend endpoint is /api/auth/login (role is in payload/user record, not path)
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Subdomain': targetSubdomain,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Login failed');
        }

        const data = await response.json();

        // Store tokens
        if (typeof window !== 'undefined') {
            // LocalStorage for Client Components
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            localStorage.setItem('user_role', data.user_role);
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('subdomain', targetSubdomain);

            // Cookies for Middleware (Server Side)
            // Set cookie for 7 days
            const expires = new Date();
            expires.setDate(expires.getDate() + 7);
            document.cookie = `access_token=${data.access_token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
        }

        return data;
    }

    /**
     * Register new user
     */
    async register(email: string, password: string, role: 'admin' | 'customer', data?: any) {
        const payload = {
            email,
            password,
            subdomain: this.subdomain,
            ...data,
        };

        return this.request(`/api/auth/${role}/register`, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }

    /**
     * Logout
     */
    async logout() {
        if (typeof window !== 'undefined') {
            // Clear LocalStorage
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_role');
            localStorage.removeItem('user_id');

            // Clear Cookie
            document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
    }

    /**
     * Get current user info
     */
    async getCurrentUser() {
        return this.request('/api/auth/me');
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem('access_token');
    }

    /**
     * Get current user role
     */
    getUserRole(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('user_role');
    }

    /**
     * Request password reset (Forgot Password)
     */
    async forgotPassword(email: string) {
        return this.request('/api/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }

    /**
     * Reset password with token
     */
    async resetPassword(token: string, newPassword: string) {
        return this.request('/api/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, new_password: newPassword }),
        });
    }

    /**
     * Update password (authenticated)
     */
    async updatePassword(oldPassword: string, newPassword: string) {
        return this.request('/api/auth/update-password', {
            method: 'PUT',
            body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
        });
    }

    // ==================== PRODUCTS ====================

    /**
     * Get all products (global catalog)
     */
    async getProducts(params?: { search?: string; category?: string; limit?: number; status?: string }) {
        const query = new URLSearchParams();
        if (params?.search) query.append('search', params.search);
        if (params?.category) query.append('category', params.category);
        if (params?.limit) query.append('limit', params.limit.toString());
        if (params?.status) query.append('status', params.status);

        const queryString = query.toString();
        return this.request(`/api/products${queryString ? '?' + queryString : ''}`);
    }

    /**
     * Get product by ID
     */
    async getProduct(id: string) {
        return this.request(`/api/products/${id}`);
    }

    /**
     * Get product by UPC
     */
    async getProductByUPC(upc: string) {
        return this.request(`/api/products/upc/${upc}`);
    }

    /**
     * Create product (SuperAdmin only)
     */
    async createProduct(data: any) {
        return this.request('/api/products', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * Update product (SuperAdmin only)
     */
    async updateProduct(id: string, data: any) {
        return this.request(`/api/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // ==================== INVENTORY ====================

    /**
     * Get inventory items
     */
    async getInventory(params?: { search?: string; low_stock?: boolean; limit?: number }) {
        const query = new URLSearchParams();
        if (params?.search) query.append('search', params.search);
        if (params?.low_stock) query.append('low_stock', 'true');
        if (params?.limit) query.append('limit', params.limit.toString());

        const queryString = query.toString();
        return this.request(`/api/inventory${queryString ? '?' + queryString : ''}`);
    }

    /**
     * Get inventory item by ID
     */
    async getInventoryItem(id: string) {
        return this.request(`/api/inventory/${id}`);
    }

    /**
     * Update inventory item
     */
    async updateInventory(id: string, data: any) {
        return this.request(`/api/inventory/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    /**
     * Create inventory item
     */
    async createInventory(data: any) {
        return this.request('/api/inventory', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * Delete inventory item
     */
    async deleteInventory(id: string) {
        return this.request(`/api/inventory/${id}`, {
            method: 'DELETE',
        });
    }

    // ==================== ORDERS ====================

    /**
     * Get orders
     */
    async getOrders(params?: { customer_id?: string; status?: string }) {
        const query = new URLSearchParams();
        if (params?.customer_id) query.append('customer_id', params.customer_id);
        if (params?.status) query.append('status', params.status);

        const queryString = query.toString();
        return this.request(`/api/orders${queryString ? '?' + queryString : ''}`);
    }

    /**
     * Get order by ID
     */
    async getOrder(id: string) {
        return this.request(`/api/orders/${id}`);
    }

    /**
     * Create order
     */
    async createOrder(data: any) {
        return this.request('/api/orders', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * Update order status
     */
    async updateOrderStatus(id: string, status: string) {
        return this.request(`/api/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }

    // ==================== VENDORS ====================

    /**
     * Get vendors
     */
    async getVendors() {
        return this.request('/api/vendors');
    }

    /**
     * Create vendor
     */
    async createVendor(data: any) {
        return this.request('/api/vendors', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * Update vendor
     */
    async updateVendor(id: string, data: any) {
        return this.request(`/api/vendors/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    /**
     * Delete vendor
     */
    async deleteVendor(id: string) {
        return this.request(`/api/vendors/${id}`, {
            method: 'DELETE',
        });
    }

    // ==================== CUSTOMERS ====================

    /**
     * Get customers
     */
    async getCustomers() {
        return this.request('/api/customers');
    }

    /**
     * Get customer orders
     */
    async getCustomerOrders() {
        return this.request('/api/customers/me/orders');
    }

    // ==================== INVOICES ====================

    /**
     * Upload invoice
     */
    async uploadInvoice(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

        const response = await fetch(`${API_URL}/api/invoices/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-Subdomain': this.subdomain,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        return response.json();
    }

    async commitInvoice(invoiceData: any) {
        return this.request('/api/invoices/process', {
            method: 'POST',
            body: JSON.stringify(invoiceData),
        });
    }

    /**
     * Get invoices
     */
    async getInvoices() {
        return this.request('/api/invoices');
    }

    /**
     * Get invoice history
     */
    async getInvoiceHistory() {
        return this.request('/api/invoices/history');
    }

    /**
     * Get invoice details
     */
    async getInvoice(id: string) {
        return this.request(`/api/invoices/${id}`);
    }

    // ==================== SALES & POS ====================

    /**
     * Sync sales from Z-report
     */
    async syncSales(data: any) {
        return this.request('/api/sales/sync', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * Get daily sales summary
     */
    async getDailySales(date?: string) {
        const query = date ? `?date=${date}` : '';
        return this.request(`/api/sales/daily${query}`);
    }

    // ==================== AUDITS ====================

    /**
     * Start shelf audit
     */
    async startAudit(data: any) {
        return this.request('/api/audits/start', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * Complete audit
     */
    async completeAudit(id: string, items: any[]) {
        return this.request(`/api/audits/${id}/complete`, {
            method: 'POST',
            body: JSON.stringify({ items }),
        });
    }

    /**
     * Get audits
     */
    async getAudits() {
        return this.request('/api/audits');
    }

    // ==================== ANALYTICS ====================

    /**
     * Get inventory health
     */
    async getInventoryHealth() {
        return this.request('/api/analytics/inventory-health');
    }

    /**
     * Get profit summary
     */
    async getProfitSummary(params?: { start_date?: string; end_date?: string }) {
        const query = new URLSearchParams();
        if (params?.start_date) query.append('start_date', params.start_date);
        if (params?.end_date) query.append('end_date', params.end_date);

        const queryString = query.toString();
        return this.request(`/api/profits/summary${queryString ? '?' + queryString : ''}`);
    }

    // ==================== RESTOCK ====================

    /**
     * Get restock recommendations
     */
    async getRestockRecommendations() {
        return this.request('/api/restock/recommendations');
    }

    /**
     * Generate purchase order
     */
    async generatePO(vendorId: string, items: any[]) {
        return this.request('/api/restock/generate-po', {
            method: 'POST',
            body: JSON.stringify({ vendor_id: vendorId, items }),
        });
    }

    // ==================== FILES ====================

    /**
     * Upload file
     */
    async uploadFile(file: File, type?: string) {
        const formData = new FormData();
        formData.append('file', file);
        if (type) formData.append('type', type);

        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

        const response = await fetch(`${API_URL}/api/files/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-Subdomain': this.subdomain,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        return response.json();
    }



    // ==================== CAMPAIGNS ====================

    async getCampaigns() {
        return this.request('/api/campaigns');
    }

    async createCampaign(data: any) {
        return this.request('/api/campaigns', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateCampaignProducts(campaignId: string, inventoryIds: string[]) {
        return this.request(`/api/campaigns/${campaignId}/products`, {
            method: 'PUT',
            body: JSON.stringify({ inventory_ids: inventoryIds }),
        });
    }

    async generateCampaignPost(products: any[]) {
        return this.request('/api/campaigns/generate-post', {
            method: 'POST',
            body: JSON.stringify({ products }),
        });
    }

    // ==================== SOCIAL ====================

    async getSocialAccounts() {
        return this.request('/api/social/accounts');
    }

    async saveSocialSettings(accounts: any) {
        return this.request('/api/social/save-settings', {
            method: 'POST',
            body: JSON.stringify({ accounts }),
        });
    }

    async publishSocial(campaignId: string, platforms: string[]) {
        return this.request('/api/social/publish', {
            method: 'POST',
            body: JSON.stringify({ campaignId, platforms }),
        });
    }

    // ==================== PROMOTIONS ====================

    async createPromotion(data: any) {
        return this.request('/api/promotions', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getUnenrichedProducts(limit: number = 50) {
        // This endpoint needs to be implemented in backend, 
        // for now allow it to fail or return empty if 404
        return this.request(`/api/products/unenriched?limit=${limit}`);
    }

    async getSettings() {
        return this.request('/api/settings');
    }

    async updateSettings(data: any) {
        return this.request('/api/settings', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // --- PAYMENT SETTINGS ---

    async getPaymentSettings() {
        return this.request('/api/settings/payment');
    }

    async updatePaymentSettings(data: { stripe_publishable_key: string; stripe_secret_key: string }) {
        return this.request('/api/settings/payment', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async getPaymentStatements() {
        return this.request('/api/settings/payment/statements');
    }



    async generateSocialImage(prompt: string, apiKey?: string) {
        return this.request('/api/social/generate-image', {
            method: 'POST',
            body: JSON.stringify({ prompt, apiKey }),
        });
    }

    // ==================== AI ====================

    async enrichProduct(data: { product_name: string; category?: string; brand?: string; description?: string }) {
        return this.request('/api/ai/enrich-product', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async parseInvoice(file: File) {
        return this.uploadInvoice(file);
    }

    // --- STORES (Tenants) ---

    async getSystemStats() {
        return this.request('/api/superadmin/stats');
    }

    async getStores() {
        return this.request('/api/superadmin/tenants');
    }

    async getNearestStore(lat: number, lng: number) {
        return this.request(`/api/tenants/nearest?lat=${lat}&lng=${lng}`);
    }

    async createTenant(data: {
        subdomain: string;
        store_name: string;
        admin_email: string;
        admin_password: string;
    }) {
        return this.request('/api/superadmin/tenants', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // --- EXPENSES ---

    async getExpenses(params?: {
        skip?: number;
        limit?: number;
        start_date?: string;
        end_date?: string;
        category?: string;
    }) {
        const queryParams = new URLSearchParams();
        if (params?.skip) queryParams.append('skip', params.skip.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.start_date) queryParams.append('start_date', params.start_date);
        if (params?.end_date) queryParams.append('end_date', params.end_date);
        if (params?.category) queryParams.append('category', params.category);

        return this.request(`/api/expenses?${queryParams.toString()}`);
    }

    async createExpense(data: {
        expense_date: string;
        category: string;
        amount: number;
        description?: string;
        payment_method?: string;
    }) {
        return this.request('/api/expenses', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getExpenseCategories() {
        return this.request('/api/expenses/categories');
    }

    // --- PROFITS ---

    // --- AUDITS (Extended) ---

    async applyAudit(id: string) {
        return this.request(`/api/audits/${id}/apply`, {
            method: 'POST'
        });
    }

    async rejectAudit(id: string) {
        return this.request(`/api/audits/${id}/reject`, {
            method: 'POST'
        });
    }

    async getAuditDetails(id: string) {
        return this.request(`/api/audits/${id}/details`);
    }

    // --- ANALYTICS ---


    // Wrapper method removed (duplicate)
}

// Export singleton instance
export const apiClient = new APIClient();

// Export auth helper
export const auth = {
    async login(email: string, password: string, role: 'admin' | 'customer' | 'superadmin') {
        return apiClient.login(email, password, role);
    },
    async logout() {
        return apiClient.logout();
    },
    async getCurrentUser() {
        return apiClient.getCurrentUser();
    },
    isAuthenticated() {
        return apiClient.isAuthenticated();
    },
    getUserRole() {
        return apiClient.getUserRole();
    },
};
