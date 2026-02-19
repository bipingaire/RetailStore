import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openaiKey = process.env.OPENAI_API_KEY;
const openai = openaiKey
  ? new OpenAI({ apiKey: openaiKey || 'placeholder' })
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
      // --- DEMO MODE: SMART RANDOM MOCK ---
      // This ensures the features are testable even without an API key.

      const MOCK_VENDORS = [
        { name: "Global Foods Distributors", type: "food" },
        { name: "TechParts Solutions", type: "tech" },
        { name: "FreshFarm Supply", type: "food" },
        { name: "Office Basics Inc.", type: "office" }
      ];

      const MOCK_ITEMS = {
        food: [
          { name: "Organic Bananas", sku: "BAN-ORG-001", cost: 0.85 },
          { name: "Almond Milk", sku: "ALM-US-32", cost: 2.10 },
          { name: "Whole Wheat Bread", sku: "BRD-WW-05", cost: 1.50 },
          { name: "Avocados (Case)", sku: "AVO-MX-20", cost: 45.00 },
        ],
        tech: [
          { name: "USB-C Cable 6ft", sku: "CB-USC-6", cost: 3.50 },
          { name: "Wireless Mouse", sku: "MS-WL-01", cost: 12.00 },
          { name: "Monitor Stand", sku: "ST-MN-02", cost: 25.00 },
        ],
        office: [
          { name: "Printer Paper (Box)", sku: "PPR-A4-500", cost: 32.00 },
          { name: "Ballpoint Pens (Blue)", sku: "PN-BL-12", cost: 4.50 },
        ]
      } as const; // Add 'as const' to fix indexing error

      const vendor = MOCK_VENDORS[Math.floor(Math.random() * MOCK_VENDORS.length)];
      // Force type assertion or use a type guard if needed, but for mock simple indexing is fine with 'any' fallback
      const availableItems = (MOCK_ITEMS as any)[vendor.type] || MOCK_ITEMS.food;

      const numItems = Math.floor(Math.random() * 3) + 2; // 2-4 items
      const selectedItems = [];
      let total = 0;

      for (let i = 0; i < numItems; i++) {
        const item = availableItems[Math.floor(Math.random() * availableItems.length)];
        const qty = Math.floor(Math.random() * 20) + 5;
        const lineTotal = qty * item.cost;
        total += lineTotal;
        selectedItems.push({
          product_name: item.name,
          vendor_code: item.sku,
          upc: "000" + Math.floor(Math.random() * 9999),
          qty: qty,
          unit_cost: item.cost,
          notes: i === 0 ? "Demo: Extracted from image" : ""
        });
      }

      const tax = parseFloat((total * 0.08).toFixed(2));
      const shipping = 15.00;
      const grandTotal = parseFloat((total + tax + shipping).toFixed(2));

      // Simulate network delay for realism
      await new Promise(resolve => setTimeout(resolve, 1500));

      return NextResponse.json({
        success: true,
        data: {
          vendor: {
            name: vendor.name,
            ein: "12-3456789",
            website: `www.${vendor.name.replace(/\s+/g, '').toLowerCase()}.com`,
            email: `support@${vendor.name.replace(/\s+/g, '').toLowerCase()}.com`,
            phone: "(555) 123-4567",
            fax: "(555) 123-4568",
            address: "123 Business Park Dr, Commerce City, CA 90210",
            warehouse_address: null,
            poc_name: "Demo Agent",
          },
          metadata: {
            invoice_number: `INV-${Math.floor(Math.random() * 10000)}`,
            invoice_date: new Date().toISOString().split('T')[0],
            total_tax: tax,
            total_transport: shipping,
            total_amount: grandTotal,
          },
          items: selectedItems,
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