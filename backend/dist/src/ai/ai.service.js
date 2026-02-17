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
    async generateProductImage(name, category) {
        if (!this.openai)
            return '';
        try {
            const response = await this.openai.images.generate({
                model: "dall-e-3",
                prompt: `Professional product photography of ${name}, category: ${category}. Clean white background, high resolution, marketing quality.`,
                n: 1,
                size: "1024x1024",
            });
            return response.data[0].url || '';
        }
        catch (error) {
            this.logger.error('OpenAI Image Generation Failed', error);
            return '';
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map