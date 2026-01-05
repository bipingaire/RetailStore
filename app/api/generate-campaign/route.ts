import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: NextRequest) {
    try {
        const { products } = await request.json();

        if (!products || products.length === 0) {
            return NextResponse.json({ error: 'Products are required' }, { status: 400 });
        }

        const productList = products
            .map((p: any) => `- ${p.global_products?.product_name}: $${p.selling_price_amount}`)
            .join('\n');

        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: `You are a social media marketing expert for retail stores. Create engaging, action-oriented posts that drive sales. Include:
- Eye-catching hook
- Product benefits
- Price mentions
- Call-to-action
- Relevant emojis
Keep it under 150 words and make it perfect for Facebook/Instagram.`
                },
                {
                    role: 'user',
                    content: `Create a promotional social media post for these products:\n\n${productList}\n\nThese are slow-moving inventory items, so emphasize value and urgency.`
                }
            ],
            temperature: 0.8,
            max_tokens: 300
        });

        const post = completion.choices[0].message.content;

        return NextResponse.json({ post });

    } catch (error: any) {
        console.error('Campaign generation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate campaign' },
            { status: 500 }
        );
    }
}
