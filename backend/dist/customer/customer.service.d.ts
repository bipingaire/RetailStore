import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
export declare class CustomerService {
    private tenantService;
    private tenantPrisma;
    constructor(tenantService: TenantService, tenantPrisma: TenantPrismaService);
    create(subdomain: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string | null;
        phone: string | null;
        isActive: boolean;
        loyaltyPoints: number;
    }>;
    findAll(subdomain: string, search?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string | null;
        phone: string | null;
        isActive: boolean;
        loyaltyPoints: number;
    }[]>;
    findOne(subdomain: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string | null;
        phone: string | null;
        isActive: boolean;
        loyaltyPoints: number;
    }>;
    update(subdomain: string, id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string | null;
        phone: string | null;
        isActive: boolean;
        loyaltyPoints: number;
    }>;
    delete(subdomain: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string | null;
        phone: string | null;
        isActive: boolean;
        loyaltyPoints: number;
    }>;
    updateLoyaltyPoints(subdomain: string, id: string, points: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string | null;
        phone: string | null;
        isActive: boolean;
        loyaltyPoints: number;
    }>;
}
