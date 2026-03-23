import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private configService;
    private openai;
    private readonly logger;
    constructor(configService: ConfigService);
    generateProductDescription(name: string, category: string): Promise<string>;
    private downloadAndSaveImage;
    generateProductImage(name: string, category: string): Promise<string>;
    generateProductMetadata(name: string, currentContext?: any): Promise<any>;
}
