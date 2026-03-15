
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
        this.logger.log(`Searching for product image: ${name} (${category})`);

        try {
            // ── Tier 1: OpenFoodFacts – huge open grocery/food product database with real photos ──
            const foodSearchUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(name)}&search_simple=1&action=process&json=1&page_size=5`;
            const foodRes = await axios.get(foodSearchUrl, { timeout: 8000, headers: { 'User-Agent': 'RetailStore-ProductEnricher/1.0' } });
            const foodProducts = foodRes.data?.products || [];

            for (const p of foodProducts) {
                const imgUrl = p.image_front_url || p.image_url;
                if (imgUrl && imgUrl.startsWith('http')) {
                    this.logger.log(`Found OpenFoodFacts image: ${imgUrl}`);
                    try { return await this.downloadAndSaveImage(imgUrl); } catch { /* try next */ }
                }
            }
        } catch (err: any) {
            this.logger.warn(`OpenFoodFacts search failed: ${err.message}`);
        }

        try {
            // ── Tier 2: Wikimedia Commons image search – open, no hotlink protection ──
            const wikiSearchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name + ' product')}&srnamespace=6&srlimit=5&format=json&origin=*`;
            const wikiRes = await axios.get(wikiSearchUrl, { timeout: 8000, headers: { 'User-Agent': 'RetailStore-ProductEnricher/1.0' } });
            const wikiHits = wikiRes.data?.query?.search || [];

            for (const hit of wikiHits) {
                // Extract filename from title (e.g. "File:Vegetable_oil_bottle.jpg")
                const title = (hit.title || '').replace('File:', '').replace(/ /g, '_');
                if (!title) continue;

                // Build Wikimedia thumb URL
                const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json&origin=*`;
                const infoRes = await axios.get(infoUrl, { timeout: 8000 });
                const pages = infoRes.data?.query?.pages || {};
                const pageData: any = Object.values(pages)[0];
                const imgUrl = pageData?.imageinfo?.[0]?.url;

                if (imgUrl && imgUrl.startsWith('http')) {
                    this.logger.log(`Found Wikimedia image: ${imgUrl}`);
                    try { return await this.downloadAndSaveImage(imgUrl); } catch { /* try next */ }
                }
            }
        } catch (err: any) {
            this.logger.warn(`Wikimedia Commons search failed: ${err.message}`);
        }

        this.logger.warn(`No image found for: ${name}. Returning empty.`);
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
