import { CategoryService } from './category.service';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
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
    addCategory(subdomain: string, body: {
        name: string;
        description?: string;
    }): Promise<{
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
    addGlobalCategory(body: {
        name: string;
        description?: string;
    }): Promise<{
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
    updateGlobalCategory(id: string, body: {
        name: string;
        description?: string;
    }): Promise<{
        name: string;
        id: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    renameDynamicCategory(body: {
        oldName: string;
        newName: string;
    }): Promise<{
        success: boolean;
        oldName: string;
        newName: string;
    }>;
}
