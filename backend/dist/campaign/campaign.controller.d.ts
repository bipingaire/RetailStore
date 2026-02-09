import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/campaign.dto';
export declare class CampaignController {
    private readonly campaignService;
    constructor(campaignService: CampaignService);
    create(req: any, dto: CreateCampaignDto): Promise<any>;
    findAll(req: any, status?: string): Promise<any>;
    getSuggestions(req: any): Promise<any[]>;
    findOne(req: any, id: string): Promise<any>;
    pushToWebsite(req: any, id: string): Promise<any>;
    pushToSocial(req: any, id: string): Promise<any>;
}
