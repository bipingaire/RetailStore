
import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

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
            this.logger.log(`Using OpenAI to find product image for: ${name} (${category})`);
            
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a product image URL finder. Return ONLY a single direct image URL (ending in .jpg, .jpeg, .png, or .webp) from a public, freely accessible source like Wikimedia Commons, open government food databases, or open product image repositories. Do NOT use Amazon, Flipkart, BigBasket, or any hotlink-protected CDN. Return only the raw URL with no explanation.'
                    },
                    {
                        role: 'user',
                        content: `Find a publicly accessible product image URL for: "${name}" in the "${category}" category. Prefer Wikimedia Commons or open image sources. Return only the direct image URL.`
                    }
                ],
            });

            const externalUrl = (completion.choices[0].message.content || '').trim();

            if (!externalUrl.startsWith('http')) {
                this.logger.warn(`OpenAI returned non-URL: ${externalUrl}`);
                return '';
            }

            this.logger.log(`OpenAI found image URL: ${externalUrl} — downloading to local...`);

            // Ensure uploads directory exists
            const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products');
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }

            // Download externally found image locally to bypass hotlink protection
            const ext = externalUrl.split('?')[0].split('.').pop()?.split('/').pop() || 'jpg';
            const safeExt = ['jpg','jpeg','png','webp','gif'].includes(ext) ? ext : 'jpg';
            const filename = `enriched_${Date.now()}.${safeExt}`;
            const localPath = path.join(uploadsDir, filename);

            const response = await axios.get(externalUrl, {
                responseType: 'arraybuffer',
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; RetailBot/1.0)',
                    'Accept': 'image/*'
                }
            });

            fs.writeFileSync(localPath, response.data);
            this.logger.log(`Image saved locally: ${localPath}`);

            return `/uploads/products/${filename}`;
        } catch (error: any) {
            this.logger.error(`Product image fetch failed: ${error.message}`);
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
