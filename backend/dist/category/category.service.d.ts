import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { PrismaService } from '../prisma/prisma.service';
import { TenantService } from '../tenant/tenant.service';
export declare class CategoryService {
    private readonly tenantPrisma;
    private readonly prisma;
    private readonly tenantService;
    constructor(tenantPrisma: TenantPrismaService, prisma: PrismaService, tenantService: TenantService);
    getCategories(subdomain: string): Promise<{
        global: {
            name: string;
            id: string;
            description: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        local: {
            name: string;
            id: string;
            description: string | null;
            isActive: boolean;
            createdAt: Date;
        }[];
        combined: string[];
    }>;
    addCategory(subdomain: string, name: string, description?: string): Promise<{
        name: string;
        id: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
    }>;
    deleteCategory(subdomain: string, id: string): Promise<{
        name: string;
        id: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
    }>;
    getGlobalCategories(): Promise<{
        name: string;
        id: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    addGlobalCategory(name: string, description?: string): Promise<{
        name: string;
        id: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteGlobalCategory(id: string): Promise<{
        name: string;
        id: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateGlobalCategory(id: string, name: string, description?: string): Promise<{
        name: string;
        id: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    renameDynamicCategory(oldName: string, newName: string): Promise<{
        success: boolean;
        oldName: string;
        newName: string;
    }>;
}
