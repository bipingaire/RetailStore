import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

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

        const openai = new OpenAI({ apiKey: finalApiKey });

        // 2. Call DALL-E 3
        console.log("Generating image with prompt:", prompt);
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        });

        const temporaryImageUrl = response.data?.[0]?.url;

        if (!temporaryImageUrl) {
            return NextResponse.json(
                { error: 'No image URL returned from DALL-E' },
                { status: 500 }
            );
        }

        // 3. Download the image from temporary URL
        console.log("Downloading image from DALL-E...");
        const imageResponse = await fetch(temporaryImageUrl);

        if (!imageResponse.ok) {
            throw new Error(`Failed to download image: ${imageResponse.statusText}`);
        }

        const imageBuffer = await imageResponse.arrayBuffer();
        const imageBlob = new Blob([imageBuffer], { type: 'image/png' });

        // 4. Upload to Supabase Storage
        const fileName = `ai-generated-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
        console.log("Uploading to Supabase Storage:", fileName);

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('ai-generated-images')
            .upload(fileName, imageBlob, {
                contentType: 'image/png',
                cacheControl: '31536000', // Cache for 1 year
            });

        if (uploadError) {
            console.error("Supabase upload error:", uploadError);
            // Fallback to temporary URL if upload fails
            console.warn("Falling back to temporary DALL-E URL");
            return NextResponse.json({ success: true, imageUrl: temporaryImageUrl });
        }

        // 5. Get permanent public URL
        const { data: urlData } = supabase.storage
            .from('ai-generated-images')
            .getPublicUrl(uploadData.path);

        const permanentUrl = urlData.publicUrl;
        console.log("Image stored permanently at:", permanentUrl);

        return NextResponse.json({ success: true, imageUrl: permanentUrl });

    } catch (error: any) {
        console.error("Image Gen Error:", error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate image' },
            { status: 500 }
        );
    }
}
