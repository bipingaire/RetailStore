import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize lazily
// const openai = ...

export async function POST(request: NextRequest) {
    try {
        const { fileUrl } = await request.json();

        if (!fileUrl) {
            return NextResponse.json({ error: 'File URL is required' }, { status: 400 });
        }

        // Download the file content
        const fileResponse = await fetch(fileUrl);
        const fileText = await fileResponse.text();

        // Use OpenAI to parse the Z-report
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: `You are a Z-report parser. Extract sales data from POS reports and return it as JSON.
          
Expected JSON format:
{
  "reportDate": "YYYY-MM-DD",
  "totalSales": number,
  "transactionCount": number,
  "lineItems": [
    {
      "skuCode": "string",
      "productName": "string",
      "quantitySold": number,
      "totalAmount": number
    }
  ]
}

If you cannot find certain fields, use reasonable defaults:
- reportDate: use today's date
- transactionCount: estimate from line items if not explicitly stated
- lineItems: extract as many as possible from the report`
                },
                {
                    role: 'user',
                    content: `Parse this Z-report and extract sales data:\n\n${fileText}`
                }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.1
        });

        const parsedData = JSON.parse(completion.choices[0].message.content || '{}');

        // Validate the parsed data
        if (!parsedData.reportDate || !parsedData.totalSales) {
            throw new Error('Failed to parse required fields from Z-report');
        }

        return NextResponse.json(parsedData);

    } catch (error: any) {
        console.error('Z-Report parsing error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to parse Z-report' },
            { status: 500 }
        );
    }
}
