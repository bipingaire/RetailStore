import { SuperAdminService } from './super-admin.service';
export declare class SuperAdminController {
    private service;
    constructor(service: SuperAdminService);
    getDashboardData(): Promise<{
        products: {
            category: string | null;
            sku: string;
            description: string | null;
            imageUrl: string | null;
            tenantId: string;
            productName: string;
            basePrice: import("src/generated/master-client/runtime/library").Decimal;
            aiEnrichedAt: Date | null;
            syncedAt: Date;
        }[];
        tenants: {
            subscriptionTier: string;
            TenantSubscriptions: {
                id: string;
                status: string;
                tenantId: string;
                startDate: Date;
                endDate: Date | null;
                planType: string;
                monthlyPrice: import("src/generated/master-client/runtime/library").Decimal;
            }[];
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            storeName: string;
            subdomain: string;
            databaseUrl: string;
            adminEmail: string;
        }[];
        pendingItems: ({
            tenant: {
                storeName: string;
            };
        } & {
            id: string;
            status: string;
            createdAt: Date;
            imageUrl: string | null;
            tenantId: string;
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
                status: string;
                tenantId: string;
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
                status: string;
                description: string | null;
                tenantId: string;
                amount: import("src/generated/master-client/runtime/library").Decimal;
                paymentMethod: string;
                transactionDate: Date;
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
        category: string | null;
        sku: string;
        description: string | null;
        imageUrl: string | null;
        tenantId: string;
        productName: string;
        basePrice: import("src/generated/master-client/runtime/library").Decimal;
        aiEnrichedAt: Date | null;
        syncedAt: Date;
    }>;
    rejectProduct(id: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        imageUrl: string | null;
        tenantId: string;
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
        category: string | null;
        sku: string;
        description: string | null;
        imageUrl: string | null;
        tenantId: string;
        productName: string;
        basePrice: import("src/generated/master-client/runtime/library").Decimal;
        aiEnrichedAt: Date | null;
        syncedAt: Date;
    }>;
    uploadProductImage(id: string, file: any): Promise<{
        category: string | null;
        sku: string;
        description: string | null;
        imageUrl: string | null;
        tenantId: string;
        productName: string;
        basePrice: import("src/generated/master-client/runtime/library").Decimal;
        aiEnrichedAt: Date | null;
        syncedAt: Date;
    }>;
    enrichProduct(id: string): Promise<{
        category: string | null;
        sku: string;
        description: string | null;
        imageUrl: string | null;
        tenantId: string;
        productName: string;
        basePrice: import("src/generated/master-client/runtime/library").Decimal;
        aiEnrichedAt: Date | null;
        syncedAt: Date;
    }>;
    getAiSuggestions(id: string): Promise<any>;
    getProduct(id: string): Promise<{
        category: string | null;
        sku: string;
        description: string | null;
        imageUrl: string | null;
        tenantId: string;
        productName: string;
        basePrice: import("src/generated/master-client/runtime/library").Decimal;
        aiEnrichedAt: Date | null;
        syncedAt: Date;
    }>;
}
