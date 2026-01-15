import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
    try {
        const { prompt, size = '1024x1024' } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        console.log('[DALL-E] Generating image with prompt:', prompt);

        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: size as "1024x1024" | "1792x1024" | "1024x1792",
            quality: "standard",
        });

        const imageUrl = response.data[0]?.url;

        if (!imageUrl) {
            throw new Error('No image URL returned from DALL-E');
        }

        console.log('[DALL-E] Image generated successfully:', imageUrl);

        return NextResponse.json({
            success: true,
            imageUrl,
            revisedPrompt: response.data[0]?.revised_prompt
        });

    } catch (error: any) {
        console.error('[DALL-E] Error:', error);
        return NextResponse.json({
            error: error.message || 'Image generation failed'
        }, { status: 500 });
    }
}
