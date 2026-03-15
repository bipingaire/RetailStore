
import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
    private openai: OpenAI;
    private readonly logger = new Logger(AiService.name);

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('OPENAI_API_KEY');
        if (apiKey) {
            this.openai = new OpenAI({
                apiKey: apiKey,
            });
        } else {
            this.logger.warn('OPENAI_API_KEY is not set. AI features will be disabled.');
        }
    }

    async generateProductDescription(name: string, category: string): Promise<string> {
        if (!this.openai) return 'AI Configuration Missing';

        try {
            const completion = await this.openai.chat.completions.create({
                messages: [{ role: 'system', content: 'You are a helpful assistant for a retail store.' },
                { role: 'user', content: `Write a compelling and SEO-friendly product description for a "${name}" which is in the "${category}" category. Keep it under 100 words.` }],
                model: 'gpt-4o',
            });

            return completion.choices[0].message.content || 'Failed to generate description.';
        } catch (error) {
            this.logger.error('OpenAI Description Generation Failed', error);
            return 'Error generating description.';
        }
    }

    async generateProductImage(name: string, category: string): Promise<string> {
        if (!this.openai) return '';
        try {
            // Use OpenAI to find a real product image from the web
            this.logger.log(`Using OpenAI to find product image for: ${name} (${category})`);
            
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a product image finder. When asked about a product, you must return ONLY a single valid, direct image URL (ending in .jpg, .jpeg, .png, or .webp) from a reliable public source like Amazon, Walmart, Wikipedia, or manufacturer sites. Do not include any explanation, markdown, or extra text. Just the raw URL.'
                    },
                    {
                        role: 'user',
                        content: `Find a high-quality product image URL for: "${name}" in the "${category}" category. The image should show the product clearly on a white or clean background. Return only the direct image URL, nothing else.`
                    }
                ],
            });

            const imageUrl = (completion.choices[0].message.content || '').trim();
            // Basic validation: must look like a URL starting with http and ending with image extension or contain image-related path
            if (imageUrl.startsWith('http') && imageUrl.length > 10) {
                this.logger.log(`OpenAI found image URL: ${imageUrl}`);
                return imageUrl;
            }
            return '';
        } catch (error) {
            this.logger.error('OpenAI Image Search Failed', error);
            return '';
        }
    }

    async generateProductMetadata(name: string, currentContext?: any): Promise<any> {
        if (!this.openai) return null;

        try {
            const completion = await this.openai.chat.completions.create({
                messages: [
                    { role: 'system', content: 'You are a retail product expert. unique JSON response.' },
                    { role: 'user', content: `Generate metadata for product "${name}". Context: ${JSON.stringify(currentContext || {})}. Return JSON with fields: suggestedDescription, suggestedCategory, suggestedBrand, suggestedSubcategory.` }
                ],
                model: 'gpt-4o',
                response_format: { type: "json_object" },
            });

            return JSON.parse(completion.choices[0].message.content || '{}');
        } catch (error) {
            this.logger.error('OpenAI Metadata Generation Failed', error);
            return null;
        }
    }
}
