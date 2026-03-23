import { SuperAdminService } from './super-admin.service';
export declare class SuperAdminController {
    private service;
    constructor(service: SuperAdminService);
    getDashboardData(): Promise<{
        products: {
            tenantId: string;
            sku: string;
            category: string | null;
            description: string | null;
            imageUrl: string | null;
            productName: string;
            basePrice: import("src/generated/master-client/runtime/library").Decimal;
            aiEnrichedAt: Date | null;
            syncedAt: Date;
        }[];
        tenants: {
            subscriptionTier: string;
            TenantSubscriptions: {
                id: string;
                tenantId: string;
                status: string;
                startDate: Date;
                endDate: Date | null;
                planType: string;
                monthlyPrice: import("src/generated/master-client/runtime/library").Decimal;
            }[];
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            subdomain: string;
            storeName: string;
            databaseUrl: string;
            adminEmail: string;
        }[];
        pendingItems: ({
            tenant: {
                storeName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            tenantId: string;
            status: string;
            imageUrl: string | null;
            productName: string;
            upcEanCode: string;
            brandName: string;
            categoryName: string;
            descriptionText: string | null;
            aiConfidenceScore: number;
            addedByUserId: string;
            suggestedMatchProductId: string | null;
        })[];
        revenueData: {
            subscriptions: {
                id: string;
                tenantId: string;
                status: string;
                startDate: Date;
                endDate: Date | null;
                planType: string;
                monthlyPrice: import("src/generated/master-client/runtime/library").Decimal;
            }[];
            transactions: ({
                tenant: {
                    storeName: string;
                };
            } & {
                id: string;
                tenantId: string;
                status: string;
                description: string | null;
                amount: import("src/generated/master-client/runtime/library").Decimal;
                transactionDate: Date;
                paymentMethod: string;
            })[];
        };
        websiteConfig: {
            id: string;
            updatedAt: Date;
            primaryDomain: string;
            sslEnabled: boolean;
            dnsConfigured: boolean;
        };
    }>;
    approveProduct(id: string): Promise<{
        tenantId: string;
        sku: string;
        category: string | null;
        description: string | null;
        imageUrl: string | null;
        productName: string;
        basePrice: import("src/generated/master-client/runtime/library").Decimal;
        aiEnrichedAt: Date | null;
        syncedAt: Date;
    }>;
    rejectProduct(id: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        status: string;
        imageUrl: string | null;
        productName: string;
        upcEanCode: string;
        brandName: string;
        categoryName: string;
        descriptionText: string | null;
        aiConfidenceScore: number;
        addedByUserId: string;
        suggestedMatchProductId: string | null;
    }>;
    updateProduct(id: string, data: any): Promise<{
        tenantId: string;
        sku: string;
        category: string | null;
        description: string | null;
        imageUrl: string | null;
        productName: string;
        basePrice: import("src/generated/master-client/runtime/library").Decimal;
        aiEnrichedAt: Date | null;
        syncedAt: Date;
    }>;
    uploadProductImage(id: string, file: any): Promise<{
        tenantId: string;
        sku: string;
        category: string | null;
        description: string | null;
        imageUrl: string | null;
        productName: string;
        basePrice: import("src/generated/master-client/runtime/library").Decimal;
        aiEnrichedAt: Date | null;
        syncedAt: Date;
    }>;
    enrichProduct(id: string): Promise<{
        tenantId: string;
        sku: string;
        category: string | null;
        description: string | null;
        imageUrl: string | null;
        productName: string;
        basePrice: import("src/generated/master-client/runtime/library").Decimal;
        aiEnrichedAt: Date | null;
        syncedAt: Date;
    }>;
    getAiSuggestions(id: string): Promise<any>;
    getProduct(id: string): Promise<{
        tenantId: string;
        sku: string;
        category: string | null;
        description: string | null;
        imageUrl: string | null;
        productName: string;
        basePrice: import("src/generated/master-client/runtime/library").Decimal;
        aiEnrichedAt: Date | null;
        syncedAt: Date;
    }>;
}
