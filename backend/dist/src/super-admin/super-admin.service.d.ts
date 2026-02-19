import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
export declare class SuperAdminService {
    private prisma;
    private aiService;
    constructor(prisma: PrismaService, aiService: AiService);
    getDashboardData(): Promise<{
        products: {
            tenantId: string;
            sku: string;
            productName: string;
            category: string | null;
            description: string | null;
            basePrice: import("src/generated/master-client/runtime/library").Decimal;
            imageUrl: string | null;
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
            subdomain: string;
            storeName: string;
            databaseUrl: string;
            adminEmail: string;
            isActive: boolean;
        }[];
        pendingItems: ({
            tenant: {
                storeName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            tenantId: string;
            productName: string;
            imageUrl: string | null;
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
                tenantId: string;
                description: string | null;
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
    approveProduct(pendingId: string): Promise<{
        tenantId: string;
        sku: string;
        productName: string;
        category: string | null;
        description: string | null;
        basePrice: import("src/generated/master-client/runtime/library").Decimal;
        imageUrl: string | null;
        aiEnrichedAt: Date | null;
        syncedAt: Date;
    }>;
    rejectProduct(pendingId: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        productName: string;
        imageUrl: string | null;
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
        tenantId: string;
        sku: string;
        productName: string;
        category: string | null;
        description: string | null;
        basePrice: import("src/generated/master-client/runtime/library").Decimal;
        imageUrl: string | null;
        aiEnrichedAt: Date | null;
        syncedAt: Date;
    }>;
    enrichProduct(id: string): Promise<{
        tenantId: string;
        sku: string;
        productName: string;
        category: string | null;
        description: string | null;
        basePrice: import("src/generated/master-client/runtime/library").Decimal;
        imageUrl: string | null;
        aiEnrichedAt: Date | null;
        syncedAt: Date;
    }>;
}
