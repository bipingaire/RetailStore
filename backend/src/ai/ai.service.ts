
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
        try {
            this.logger.log(`Searching web for product image: ${name} (${category})`);

            // Use OpenAI Responses API with real web_search_preview tool
            // This performs ACTUAL web searches unlike standard chat completions
            const response = await (this.openai as any).responses.create({
                model: 'gpt-4o-mini',
                tools: [{ type: 'web_search_preview' }],
                input: `Search the web for a high-quality product image of "${name}" (${category} category). Find a direct, publicly accessible image URL that is NOT from Amazon, Flipkart, or any hotlink-protected CDN. Prefer images from Wikipedia, Wikimedia Commons, manufacturer websites, or open image repositories. Return ONLY the direct image URL, nothing else.`,
            });

            // Extract the text output from the response
            const outputText = response.output
                ?.filter((item: any) => item.type === 'message')
                ?.flatMap((item: any) => item.content)
                ?.filter((c: any) => c.type === 'output_text')
                ?.map((c: any) => c.text)
                ?.join('') || '';

            this.logger.log(`Web search response: ${outputText.substring(0, 200)}`);

            // Extract a URL from the response text
            const urlMatch = outputText.match(/https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|webp|gif)(\?[^\s"'<>]*)?/i);
            if (urlMatch) {
                const imageUrl = urlMatch[0];
                this.logger.log(`Found image URL via web search: ${imageUrl}`);
                try {
                    return await this.downloadAndSaveImage(imageUrl);
                } catch (dlErr: any) {
                    this.logger.warn(`Could not download web-searched image: ${dlErr.message}`);
                }
            }

            // Fallback: Use DALL-E 3 to generate an image (always produces a downloadable URL)
            this.logger.log(`Web search fallback: generating image with DALL-E 3 for: ${name}`);
            const imageResponse = await this.openai.images.generate({
                model: 'dall-e-3',
                prompt: `A professional product photo of ${name}, ${category}, on a clean white background, high quality, product catalog style`,
                n: 1,
                size: '1024x1024',
                quality: 'standard',
            });

            const dalleUrl = imageResponse.data[0]?.url;
            if (dalleUrl) {
                return await this.downloadAndSaveImage(dalleUrl);
            }

            return '';
        } catch (error: any) {
            this.logger.error(`Product image generation failed: ${error.message}`);
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
