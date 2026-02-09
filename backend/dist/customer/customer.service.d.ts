import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
export declare class CustomerService {
    private tenantService;
    private tenantPrisma;
    constructor(tenantService: TenantService, tenantPrisma: TenantPrismaService);
    create(subdomain: string, data: any): Promise<{
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        isActive: boolean;
        loyaltyPoints: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(subdomain: string, search?: string): Promise<{
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        isActive: boolean;
        loyaltyPoints: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(subdomain: string, id: string): Promise<{
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        isActive: boolean;
        loyaltyPoints: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(subdomain: string, id: string, data: any): Promise<{
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        isActive: boolean;
        loyaltyPoints: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(subdomain: string, id: string): Promise<{
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        isActive: boolean;
        loyaltyPoints: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateLoyaltyPoints(subdomain: string, id: string, points: number): Promise<{
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        isActive: boolean;
        loyaltyPoints: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
