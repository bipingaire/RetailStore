import { SuperAdminService } from './super-admin.service';
export declare class SuperAdminController {
    private service;
    constructor(service: SuperAdminService);
    getDashboardData(): Promise<{
        products: {
            sku: string;
            productName: string;
            category: string | null;
            description: string | null;
            basePrice: import("src/generated/master-client/runtime/library").Decimal;
            imageUrl: string | null;
            aiEnrichedAt: Date | null;
            syncedAt: Date;
            tenantId: string;
        }[];
        tenants: {
            subscriptionTier: string;
            TenantSubscriptions: {
                tenantId: string;
                id: string;
                planType: string;
                monthlyPrice: import("src/generated/master-client/runtime/library").Decimal;
                status: string;
                startDate: Date;
                endDate: Date | null;
            }[];
            id: string;
            storeName: string;
            subdomain: string;
            databaseUrl: string;
            adminEmail: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        pendingItems: ({
            tenant: {
                storeName: string;
            };
        } & {
            productName: string;
            imageUrl: string | null;
            tenantId: string;
            id: string;
            createdAt: Date;
            status: string;
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
                tenantId: string;
                id: string;
                planType: string;
                monthlyPrice: import("src/generated/master-client/runtime/library").Decimal;
                status: string;
                startDate: Date;
                endDate: Date | null;
            }[];
            transactions: ({
                tenant: {
                    storeName: string;
                };
            } & {
                description: string | null;
                tenantId: string;
                id: string;
                status: string;
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
        sku: string;
        productName: string;
        category: string | null;
        description: string | null;
        basePrice: import("src/generated/master-client/runtime/library").Decimal;
        imageUrl: string | null;
        aiEnrichedAt: Date | null;
        syncedAt: Date;
        tenantId: string;
    }>;
    rejectProduct(id: string): Promise<{
        productName: string;
        imageUrl: string | null;
        tenantId: string;
        id: string;
        createdAt: Date;
        status: string;
        upcEanCode: string;
        brandName: string;
        categoryName: string;
        descriptionText: string | null;
        aiConfidenceScore: number;
        addedByUserId: string;
        suggestedMatchProductId: string | null;
    }>;
    updateProduct(id: string, data: any): Promise<{
        sku: string;
        productName: string;
        category: string | null;
        description: string | null;
        basePrice: import("src/generated/master-client/runtime/library").Decimal;
        imageUrl: string | null;
        aiEnrichedAt: Date | null;
        syncedAt: Date;
        tenantId: string;
    }>;
    uploadProductImage(id: string, file: any): Promise<{
        sku: string;
        productName: string;
        category: string | null;
        description: string | null;
        basePrice: import("src/generated/master-client/runtime/library").Decimal;
        imageUrl: string | null;
        aiEnrichedAt: Date | null;
        syncedAt: Date;
        tenantId: string;
    }>;
    enrichProduct(id: string): Promise<{
        sku: string;
        productName: string;
        category: string | null;
        description: string | null;
        basePrice: import("src/generated/master-client/runtime/library").Decimal;
        imageUrl: string | null;
        aiEnrichedAt: Date | null;
        syncedAt: Date;
        tenantId: string;
    }>;
    getAiSuggestions(id: string): Promise<any>;
    getProduct(id: string): Promise<{
        sku: string;
        productName: string;
        category: string | null;
        description: string | null;
        basePrice: import("src/generated/master-client/runtime/library").Decimal;
        imageUrl: string | null;
        aiEnrichedAt: Date | null;
        syncedAt: Date;
        tenantId: string;
    }>;
}
