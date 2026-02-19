import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'placeholder'
    });

    const { textData, fileType } = await req.json();

    if (!textData) {
      return NextResponse.json({ error: 'No text data provided' }, { status: 400 });
    }

    // OpenAI Prompt to structure raw text from a PDF scan
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a Data Entry Specialist. 
          Analyze the provided raw text extracted from a ${fileType} catalog.
          Extract all product rows into a JSON array.
          
          Return a JSON object with key "products". 
          Each product object must have:
          - "name": string
          - "upc_ean": string (if found)
          - "category": string (Infer)
          - "manufacturer": string (Infer)
          - "uom": string (e.g. Case, Unit, Box)
          - "pack_quantity": number (default 1)
          
          Strict JSON only.`
        },
        {
          role: "user",
          content: textData.substring(0, 15000) // Limit token usage
        },
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    const parsedData = JSON.parse(content || '{"products": []}');

    return NextResponse.json({
      success: true,
      data: parsedData.products
    });

  } catch (error: any) {
    console.error("Catalog Parse Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}