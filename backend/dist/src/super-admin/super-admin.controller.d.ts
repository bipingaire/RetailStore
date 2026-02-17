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
                id: string;
                tenantId: string;
                status: string;
                startDate: Date;
                endDate: Date | null;
                planType: string;
                monthlyPrice: import("src/generated/master-client/runtime/library").Decimal;
            }[];
            id: string;
            subdomain: string;
            storeName: string;
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
            id: string;
            createdAt: Date;
            productName: string;
            imageUrl: string | null;
            tenantId: string;
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
                description: string | null;
                tenantId: string;
                status: string;
                paymentMethod: string;
                amount: import("src/generated/master-client/runtime/library").Decimal;
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
        id: string;
        createdAt: Date;
        productName: string;
        imageUrl: string | null;
        tenantId: string;
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
}
