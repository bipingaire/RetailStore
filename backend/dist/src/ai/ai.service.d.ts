import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private configService;
    private openai;
    private readonly logger;
    constructor(configService: ConfigService);
    generateProductDescription(name: string, category: string): Promise<string>;
    generateProductImage(name: string, category: string): Promise<string>;
}
