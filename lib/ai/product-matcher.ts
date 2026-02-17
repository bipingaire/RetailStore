/**
 * AI-powered product matching service
 * Uses OpenAI to match similar products and suggest additions to master catalog
 */

import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface ProductData {
    name: string;
    upc?: string;
    brand?: string;
    manufacturer?: string;
    category?: string;
    description?: string;
    imageUrl?: string;
}

export interface ProductMatchResult {
    matchFound: boolean;
    matchedProductId?: string;
    confidenceScore: number;
    reasoning: string;
    suggestedAction: 'link' | 'add_new' | 'manual_review';
}

/**
 * Match a product against the master catalog using AI
 */
export async function matchProductToMasterCatalog(
    productData: ProductData,
    masterCatalogProducts: any[]
): Promise<ProductMatchResult> {
    try {
        // First, try exact UPC match
        if (productData.upc) {
            const upcMatch = masterCatalogProducts.find(
                p => p['upc-ean-code'] === productData.upc
            );

            if (upcMatch) {
                return {
                    matchFound: true,
                    matchedProductId: upcMatch['product-id'],
                    confidenceScore: 1.0,
                    reasoning: 'Exact UPC/EAN code match',
                    suggestedAction: 'link'
                };
            }
        }

        // If no exact match, use AI for fuzzy matching
        const prompt = `
You are a product matching expert. I need to determine if a new product matches any existing products in our catalog.

New Product:
- Name: ${productData.name}
- Brand: ${productData.brand || 'Unknown'}
- Category: ${productData.category || 'Unknown'}
- Description: ${productData.description || 'None'}

Existing Catalog Products:
${masterCatalogProducts.slice(0, 50).map((p, i) => `
${i + 1}. ID: ${p['product-id']}
   Name: ${p['product-name']}
   Brand: ${p['brand-name'] || 'Unknown'}
   Category: ${p['category-name'] || 'Unknown'}
`).join('\n')}

Analyze if the new product matches any existing product. Consider variations in naming, misspellings, abbreviations, and brand differences.

Respond in JSON format:
{
  "matchFound": boolean,
  "matchedProductId": "uuid or null",
  "confidenceScore": 0.0 to 1.0,
  "reasoning": "brief explanation",
  "suggestedAction": "link | add_new | manual_review"
}

Rules:
- confidenceScore > 0.85: suggest "link" (auto-link)
- confidenceScore 0.50-0.85: suggest "manual_review" 
- confidenceScore < 0.50: suggest "add_new" (add as new product)
`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a product matching expert. Always respond with valid JSON only.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.3,
            response_format: { type: 'json_object' }
        });

        const result = JSON.parse(response.choices[0].message.content || '{}');

        return {
            matchFound: result.matchFound || false,
            matchedProductId: result.matchedProductId || undefined,
            confidenceScore: result.confidenceScore || 0,
            reasoning: result.reasoning || 'AI analysis completed',
            suggestedAction: result.suggestedAction || 'manual_review'
        };

    } catch (error) {
        console.error('Error in AI product matching:', error);

        // Fallback: simple name matching
        const nameLower = productData.name.toLowerCase();
        const exactNameMatch = masterCatalogProducts.find(
            p => p['product-name'].toLowerCase() === nameLower
        );

        if (exactNameMatch) {
            return {
                matchFound: true,
                matchedProductId: exactNameMatch['product-id'],
                confidenceScore: 0.9,
                reasoning: 'Exact name match (fallback)',
                suggestedAction: 'link'
            };
        }

        return {
            matchFound: false,
            confidenceScore: 0,
            reasoning: 'AI matching failed, no exact match found',
            suggestedAction: 'manual_review'
        };
    }
}

/**
 * Generate product enrichment suggestions using AI
 */
export async function generateProductEnrichment(productData: ProductData): Promise<{
    suggestedDescription?: string;
    suggestedCategory?: string;
    suggestedBrand?: string;
    keywords?: string[];
}> {
    try {
        const prompt = `
Given this product information, suggest improvements:

Product Name: ${productData.name}
Current Description: ${productData.description || 'None'}
Brand: ${productData.brand || 'Unknown'}
Category: ${productData.category || 'Unknown'}

Provide:
1. A better, more detailed product description (2-3 sentences)
2. Suggested category if current is vague
3. Suggested brand if missing or unclear
4. Relevant keywords for search

Respond in JSON format:
{
  "suggestedDescription": "...",
  "suggestedCategory": "...",
  "suggestedBrand": "...",
  "keywords": ["keyword1", "keyword2", ...]
}
`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a product catalog expert. Provide concise, accurate product information.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.5,
            response_format: { type: 'json_object' }
        });

        return JSON.parse(response.choices[0].message.content || '{}');

    } catch (error) {
        console.error('Error generating product enrichment:', error);
        return {};
    }
}

/**
 * Batch match multiple products
 */
export async function batchMatchProducts(
    products: ProductData[],
    masterCatalog: any[]
): Promise<ProductMatchResult[]> {
    const results: ProductMatchResult[] = [];

    // Process in batches of 5 to avoid rate limits
    for (let i = 0; i < products.length; i += 5) {
        const batch = products.slice(i, i + 5);
        const batchResults = await Promise.all(
            batch.map(product => matchProductToMasterCatalog(product, masterCatalog))
        );
        results.push(...batchResults);

        // Small delay between batches
        if (i + 5 < products.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    return results;
}
