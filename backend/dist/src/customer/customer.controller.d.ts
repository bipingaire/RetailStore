import { CustomerService } from './customer.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
export declare class CustomerController {
    private customerService;
    constructor(customerService: CustomerService);
    create(subdomain: string, dto: CreateCustomerDto): Promise<{
        email: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        phone: string | null;
        loyaltyPoints: number;
    }>;
    findAll(subdomain: string, search?: string): Promise<{
        email: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        phone: string | null;
        loyaltyPoints: number;
    }[]>;
    findOne(subdomain: string, id: string): Promise<{
        email: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        phone: string | null;
        loyaltyPoints: number;
    }>;
    update(subdomain: string, id: string, dto: UpdateCustomerDto): Promise<{
        email: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        phone: string | null;
        loyaltyPoints: number;
    }>;
    delete(subdomain: string, id: string): Promise<{
        email: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        phone: string | null;
        loyaltyPoints: number;
    }>;
    updateLoyaltyPoints(subdomain: string, id: string, points: number): Promise<{
        email: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        phone: string | null;
        loyaltyPoints: number;
    }>;
}
