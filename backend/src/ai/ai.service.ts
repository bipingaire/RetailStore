
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

    private async downloadAndSaveImage(externalUrl: string): Promise<string> {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const ext = externalUrl.split('?')[0].split('.').pop()?.toLowerCase() || 'jpg';
        const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext) ? ext : 'jpg';
        const filename = `enriched_${Date.now()}.${safeExt}`;
        const localPath = path.join(uploadsDir, filename);

        const response = await axios.get(externalUrl, {
            responseType: 'arraybuffer',
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                'Referer': 'https://www.google.com/'
            }
        });

        // Validate it's actually an image by checking content-type
        const contentType = response.headers['content-type'] || '';
        if (!contentType.includes('image')) {
            throw new Error(`URL did not return an image (content-type: ${contentType})`);
        }

        fs.writeFileSync(localPath, response.data);
        this.logger.log(`Image cached locally: ${filename}`);
        return `/uploads/products/${filename}`;
    }

    async generateProductImage(name: string, category: string): Promise<string> {
        if (!this.openai) return '';
        this.logger.log(`OpenAI web searching for product image: ${name} (${category})`);

        try {
            const searchCompletion = await this.openai.chat.completions.create({
                model: 'gpt-4o-search-preview',
                messages: [
                    {
                        role: 'user',
                        content: `Search the web for a high-quality product image of "${name}" in the "${category}" category. Look on Google Images, major grocery retailer websites, manufacturer sites, or any product listing. Return ONLY the direct image URL (starting with https://) — no explanation, no markdown, just the raw URL.`
                    }
                ],
            } as any);

            const aiResponse = (searchCompletion.choices[0].message.content || '').trim();
            this.logger.log(`OpenAI web search response: ${aiResponse.substring(0, 200)}`);

            // Extract URL from response
            const urlMatch = aiResponse.match(/https?:\/\/[^\s"'<>\n]+/i);
            if (urlMatch) {
                const foundUrl = urlMatch[0].replace(/[.,;!?]+$/, '');
                this.logger.log(`Downloading image from: ${foundUrl}`);
                try {
                    return await this.downloadAndSaveImage(foundUrl);
                } catch (dlErr: any) {
                    this.logger.warn(`Could not download image: ${dlErr.message}`);
                }
            }
        } catch (err: any) {
            this.logger.warn(`OpenAI web search failed: ${err.message}`);
        }

        this.logger.warn(`No image found for: ${name}`);
        return '';
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
