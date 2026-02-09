import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { CreateCampaignDto } from './dto/campaign.dto';
export declare class CampaignService {
    private prisma;
    constructor(prisma: TenantPrismaService);
    create(tenantId: string, dto: CreateCampaignDto): Promise<any>;
    findAll(tenantId: string, status?: string): Promise<any>;
    findOne(tenantId: string, id: string): Promise<any>;
    pushToWebsite(tenantId: string, id: string): Promise<any>;
    pushToSocial(tenantId: string, id: string): Promise<any>;
    getSuggestions(tenantId: string): Promise<any[]>;
    private generateMarketingContent;
}
