import { PrismaService } from '../prisma/prisma.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { AiService } from '../ai/ai.service';
export declare class SuperAdminService {
    private prisma;
    private tenantPrisma;
    private aiService;
    constructor(prisma: PrismaService, tenantPrisma: TenantPrismaService, aiService: AiService);
    private broadcastUpdateToTenants;
    getGlobalProduct(id: string): Promise<{
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
    approveProduct(pendingId: string): Promise<{
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
    rejectProduct(pendingId: string): Promise<{
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
    uploadProductImage(id: string, imageUrl: string): Promise<{
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
}
