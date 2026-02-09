import { CustomerService } from './customer.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
export declare class CustomerController {
    private customerService;
    constructor(customerService: CustomerService);
    create(subdomain: string, dto: CreateCustomerDto): Promise<{
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
    update(subdomain: string, id: string, dto: UpdateCustomerDto): Promise<{
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
