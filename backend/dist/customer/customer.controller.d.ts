import { CustomerService } from './customer.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
export declare class CustomerController {
    private customerService;
    constructor(customerService: CustomerService);
    create(subdomain: string, dto: CreateCustomerDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        email: string | null;
        phone: string | null;
        loyaltyPoints: number;
    }>;
    findAll(subdomain: string, search?: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        email: string | null;
        phone: string | null;
        loyaltyPoints: number;
    }[]>;
    findOne(subdomain: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        email: string | null;
        phone: string | null;
        loyaltyPoints: number;
    }>;
    update(subdomain: string, id: string, dto: UpdateCustomerDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        email: string | null;
        phone: string | null;
        loyaltyPoints: number;
    }>;
    delete(subdomain: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        email: string | null;
        phone: string | null;
        loyaltyPoints: number;
    }>;
    updateLoyaltyPoints(subdomain: string, id: string, points: number): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        email: string | null;
        phone: string | null;
        loyaltyPoints: number;
    }>;
}
