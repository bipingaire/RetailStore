
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
        this.logger.log(`Searching web for product image: ${name}`);

        try {
            // Step 1: Ask gpt-4o-search-preview to find a REAL webpage that sells or shows the product
            // We ask for a page URL, not an image CDN URL — model can't hallucinate page URLs
            const searchCompletion = await this.openai.chat.completions.create({
                model: 'gpt-4o-search-preview',
                web_search_options: {},
                messages: [
                    {
                        role: 'user',
                        content: `Search Google for "${name} ${category}" and find any real product page (grocery, supermarket, manufacturer or Wikipedia) that shows an image of this product. Return ONLY the full https:// URL of that webpage — not an image URL, just the webpage URL. One URL, nothing else.`
                    }
                ],
            } as any);

            const rawResponse = (searchCompletion.choices[0].message.content || '').trim();
            this.logger.log(`OpenAI found page: ${rawResponse.substring(0, 200)}`);

            // Extract any https URL from the response
            const pageUrlMatch = rawResponse.match(/https?:\/\/[^\s"'<>\n)]+/i);
            if (!pageUrlMatch) {
                this.logger.warn(`No page URL found for: ${name}`);
                return '';
            }

            const pageUrl = pageUrlMatch[0].replace(/[.,;!?)\]]+$/, '');
            this.logger.log(`Fetching page to extract image: ${pageUrl}`);

            // Step 2: Fetch the actual webpage and extract a real image URL from its HTML
            const pageRes = await axios.get(pageUrl, {
                timeout: 12000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml',
                }
            });

            const html: string = pageRes.data?.toString() || '';

            // Step 3: Try og:image first (best quality, specifically set for sharing)
            const ogImageMatch = html.match(/<meta[^>]+(?:property="og:image"|name="og:image")[^>]+content="([^"]+)"/i)
                ?? html.match(/<meta[^>]+content="([^"]+)"[^>]+(?:property="og:image"|name="og:image")/i);

            const candidates: string[] = [];

            if (ogImageMatch?.[1]) candidates.push(ogImageMatch[1]);

            // Also try src of img tags with product-related class names or sizes
            const imgMatches = html.matchAll(/<img[^>]+src="(https?:\/\/[^"]+\.(jpg|jpeg|png|webp)(?:\?[^"]*)?)"[^>]*/gi);
            for (const m of imgMatches) {
                if (m[1] && !m[1].includes('logo') && !m[1].includes('icon') && !m[1].includes('banner')) {
                    candidates.push(m[1]);
                    if (candidates.length >= 5) break;
                }
            }

            this.logger.log(`Found ${candidates.length} image candidates on the page`);

            // Step 4: Try each candidate URL — download the first one that actually returns an image
            for (const imgUrl of candidates) {
                try {
                    const localPath = await this.downloadAndSaveImage(imgUrl);
                    this.logger.log(`Successfully saved image from: ${imgUrl}`);
                    return localPath;
                } catch {
                    // Try the next candidate
                }
            }

            this.logger.warn(`Could not download any image from page: ${pageUrl}`);
            return '';
        } catch (err: any) {
            this.logger.error(`Product image search failed: ${err.message}`);
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
