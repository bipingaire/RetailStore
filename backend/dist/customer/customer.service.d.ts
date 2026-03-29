import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
export declare class CustomerService {
    private tenantService;
    private tenantPrisma;
    constructor(tenantService: TenantService, tenantPrisma: TenantPrismaService);
    create(subdomain: string, data: any): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        phone: string | null;
        loyaltyPoints: number;
    }>;
    findAll(subdomain: string, search?: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        phone: string | null;
        loyaltyPoints: number;
    }[]>;
    findOne(subdomain: string, id: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        phone: string | null;
        loyaltyPoints: number;
    }>;
    update(subdomain: string, id: string, data: any): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        phone: string | null;
        loyaltyPoints: number;
    }>;
    delete(subdomain: string, id: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        phone: string | null;
        loyaltyPoints: number;
    }>;
    updateLoyaltyPoints(subdomain: string, id: string, points: number): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        phone: string | null;
        loyaltyPoints: number;
    }>;
}
