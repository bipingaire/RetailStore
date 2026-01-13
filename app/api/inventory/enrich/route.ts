import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
    try {
        const { productId, productName } = await req.json();

        if (!productId || !productName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        // 1. Generate Image Description/Prompt
        // Optional: We could use GPT to refine the prompt, but direct name usually works well for DALL-E 3
        const prompt = `Professional product photography of ${productName}, isolated on white background, high quality, commercial lighting, photorealistic, 4k`;

        // 2. Generate Image
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        });

        const imageUrl = response.data[0].url;

        if (!imageUrl) {
            throw new Error("Failed to generate image");
        }

        // 3. Update Database
        // We update the Global Catalog entry so all tenants benefit (or just this one if it's a private item)
        const { error } = await supabase
            .from('global-product-master-catalog')
            .update({ 'image-url': imageUrl })
            .eq('product-id', productId);

        if (error) throw error;

        return NextResponse.json({ success: true, imageUrl });

    } catch (error: any) {
        console.error("Enrichment Error:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
