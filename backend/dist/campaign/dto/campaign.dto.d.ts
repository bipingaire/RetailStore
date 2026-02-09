export declare class CreateCampaignDto {
    name: string;
    description?: string;
    type: 'FLASH_SALE' | 'EXPIRY_CLEARANCE' | 'OVERSTOCK' | 'FESTIVE';
    discount: number;
    startDate: Date;
    endDate: Date;
    productIds: string[];
    socialPlatforms?: string[];
}
