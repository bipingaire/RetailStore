"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = require("openai");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const fs = require("fs");
const path = require("path");
let AiService = AiService_1 = class AiService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(AiService_1.name);
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (apiKey) {
            this.openai = new openai_1.default({
                apiKey: apiKey,
            });
        }
        else {
            this.logger.warn('OPENAI_API_KEY is not set. AI features will be disabled.');
        }
    }
    async generateProductDescription(name, category) {
        if (!this.openai)
            return 'AI Configuration Missing';
        try {
            const completion = await this.openai.chat.completions.create({
                messages: [{ role: 'system', content: 'You are a helpful assistant for a retail store.' },
                    { role: 'user', content: `Write a compelling and SEO-friendly product description for a "${name}" which is in the "${category}" category. Keep it under 100 words.` }],
                model: 'gpt-4o',
            });
            return completion.choices[0].message.content || 'Failed to generate description.';
        }
        catch (error) {
            this.logger.error('OpenAI Description Generation Failed', error);
            return 'Error generating description.';
        }
    }
    async downloadAndSaveImage(externalUrl) {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const ext = externalUrl.split('?')[0].split('.').pop()?.toLowerCase() || 'jpg';
        const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext) ? ext : 'jpg';
        const filename = `enriched_${Date.now()}.${safeExt}`;
        const localPath = path.join(uploadsDir, filename);
        const response = await axios_1.default.get(externalUrl, {
            responseType: 'arraybuffer',
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                'Referer': 'https://www.google.com/'
            }
        });
        const contentType = response.headers['content-type'] || '';
        if (!contentType.includes('image')) {
            throw new Error(`URL did not return an image (content-type: ${contentType})`);
        }
        fs.writeFileSync(localPath, response.data);
        this.logger.log(`Image cached locally: ${filename}`);
        return `/uploads/products/${filename}`;
    }
    async generateProductImage(name, category) {
        if (!this.openai)
            return '';
        this.logger.log(`Searching web for product image: ${name}`);
        try {
            const searchCompletion = await this.openai.chat.completions.create({
                model: 'gpt-4o-search-preview',
                web_search_options: {},
                messages: [
                    {
                        role: 'user',
                        content: `Search Google for "${name} ${category}" and find any real product page (grocery, supermarket, manufacturer or Wikipedia) that shows an image of this product. Return ONLY the full https:// URL of that webpage — not an image URL, just the webpage URL. One URL, nothing else.`
                    }
                ],
            });
            const rawResponse = (searchCompletion.choices[0].message.content || '').trim();
            this.logger.log(`OpenAI found page: ${rawResponse.substring(0, 200)}`);
            const pageUrlMatch = rawResponse.match(/https?:\/\/[^\s"'<>\n)]+/i);
            if (!pageUrlMatch) {
                this.logger.warn(`No page URL found for: ${name}`);
                return '';
            }
            const pageUrl = pageUrlMatch[0].replace(/[.,;!?)\]]+$/, '');
            this.logger.log(`Fetching page to extract image: ${pageUrl}`);
            const pageRes = await axios_1.default.get(pageUrl, {
                timeout: 12000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml',
                }
            });
            const html = pageRes.data?.toString() || '';
            const ogImageMatch = html.match(/<meta[^>]+(?:property="og:image"|name="og:image")[^>]+content="([^"]+)"/i)
                ?? html.match(/<meta[^>]+content="([^"]+)"[^>]+(?:property="og:image"|name="og:image")/i);
            const candidates = [];
            if (ogImageMatch?.[1])
                candidates.push(ogImageMatch[1]);
            const imgMatches = html.matchAll(/<img[^>]+src="(https?:\/\/[^"]+\.(jpg|jpeg|png|webp)(?:\?[^"]*)?)"[^>]*/gi);
            for (const m of imgMatches) {
                if (m[1] && !m[1].includes('logo') && !m[1].includes('icon') && !m[1].includes('banner')) {
                    candidates.push(m[1]);
                    if (candidates.length >= 5)
                        break;
                }
            }
            this.logger.log(`Found ${candidates.length} image candidates on the page`);
            for (const imgUrl of candidates) {
                try {
                    const localPath = await this.downloadAndSaveImage(imgUrl);
                    this.logger.log(`Successfully saved image from: ${imgUrl}`);
                    return localPath;
                }
                catch {
                }
            }
            this.logger.warn(`Could not download any image from page: ${pageUrl}`);
            return '';
        }
        catch (err) {
            this.logger.error(`Product image search failed: ${err.message}`);
            return '';
        }
    }
    async generateProductMetadata(name, currentContext) {
        if (!this.openai)
            return null;
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
        }
        catch (error) {
            this.logger.error('OpenAI Metadata Generation Failed', error);
            return null;
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map