import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openaiKey = process.env.OPENAI_API_KEY;
const openai = openaiKey
  ? new OpenAI({ apiKey: openaiKey })
  : null;

export async function POST(req: Request) {
  try {
    const { fileData, fileType } = await req.json();

    if (!fileData) {
      return NextResponse.json({ error: 'No file data provided' }, { status: 400 });
    }

    const prompt = `
      You are a Forensic Invoice Analyst.
      Analyze the provided ${fileType}.
      
      Extract TWO sections:
      1. **EXTENDED VENDOR DATA**: Look for every scrap of contact info.
         - 'vendor_name': Official company name.
         - 'ein': Tax ID / EIN if visible.
         - 'website': URL.
         - 'email': General or support email.
         - 'phone': Main phone number.
         - 'fax': Fax number.
         - 'shipping_address': The "Remit To" or main office address.
         - 'warehouse_address': If a "Ship From" address differs from main address.
         - 'poc_name': Name of a sales rep or contact person if listed.
      
      2. **INVOICE METADATA**:
         - 'invoice_number', 'invoice_date'
         - 'total_tax', 'total_transport', 'total_amount'

      3. **LINE ITEMS**:
         - Clean product names, SKU, UPC, Qty, Unit Cost.

      Return STRICT JSON:
      {
        "vendor": {
          "name": "string",
          "ein": "string or null",
          "website": "string or null",
          "email": "string or null",
          "phone": "string or null",
          "fax": "string or null",
          "address": "string or null",
          "warehouse_address": "string or null",
          "poc_name": "string or null"
        },
        "metadata": {
          "invoice_number": "string",
          "invoice_date": "YYYY-MM-DD",
          "total_tax": number,
          "total_transport": number,
          "total_amount": number
        },
        "items": [
          { "product_name": "...", "vendor_code": "...", "upc": "...", "qty": 0, "unit_cost": 0, "notes": "..." }
        ]
      }
    `;

    const contentPayload = fileType === 'pdf_text' 
        ? [{ type: "text", text: fileData.substring(0, 15000) }]
        : [
            { type: "text", text: "Extract detailed vendor and product data." },
            { type: "image_url", image_url: { url: fileData } }
          ];

    if (!openai) {
      // Fallback mock for local/testing when no API key is configured
      return NextResponse.json({
        success: true,
        data: {
          vendor: {
            name: 'Sample Vendor',
            ein: null,
            website: null,
            email: null,
            phone: null,
            fax: null,
            address: null,
            warehouse_address: null,
            poc_name: null,
          },
          metadata: {
            invoice_number: 'TEST-123',
            invoice_date: new Date().toISOString().split('T')[0],
            total_tax: 0,
            total_transport: 0,
            total_amount: 100,
          },
          items: [
            { product_name: 'Sample Item', vendor_code: 'SKU-1', upc: '0000', qty: 1, unit_cost: 100, notes: '' },
          ],
        },
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: contentPayload as any },
      ],
      response_format: { type: "json_object" },
      max_tokens: 3000,
    });

    const parsedData = JSON.parse(response.choices[0].message.content || '{}');

    return NextResponse.json({ success: true, data: parsedData });

  } catch (error: any) {
    console.error("Invoice Parse Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}