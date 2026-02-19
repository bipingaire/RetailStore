import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
    try {
        const { prompt, apiKey } = await req.json();

        // 1. Determine which Key to use
        // Prioritize "User Provided Key" from UI, fallback to "System Key" from .env
        const finalApiKey = apiKey || process.env.OPENAI_API_KEY;

        if (!finalApiKey) {
            return NextResponse.json(
                { error: 'No API Key available. Please add OpenAI Key to .env or settings.' },
                { status: 400 }
            );
        }

        const openai = new OpenAI({ apiKey: finalApiKey || 'placeholder' });

        // 2. Call DALL-E 3
        console.log("Generating image with prompt:", prompt);
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        });

        const imageUrl = response.data?.[0]?.url;

        return NextResponse.json({ success: true, imageUrl });

    } catch (error: any) {
        console.error("Image Gen Error:", error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate image' },
            { status: 500 }
        );
    }
}
