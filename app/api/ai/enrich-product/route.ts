import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Helper: Google Search
const googleSearch = async (query: string, searchType: 'text' | 'image' = 'text') => {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const cx = process.env.GOOGLE_SEARCH_CX || process.env.GOOGLE_CSE_ID;

  // Debug Logs
  // console.log(`[Google Search] Key Available: ${!!apiKey}, CX Available: ${!!cx}`);

  if (!apiKey || !cx) {
    console.warn("Google Search API Keys missing (Check .env.local). Falling back to AI knowledge.");
    return null;
  }

  const params = new URLSearchParams({
    key: apiKey,
    cx: cx,
    q: query,
  });

  if (searchType === 'image') {
    params.append('searchType', 'image');
    params.append('num', '1'); // Try to get 1, but we might check if empty later
  } else {
    params.append('num', '5'); // Top 5 for text
  }

  const url = `https://www.googleapis.com/customsearch/v1?${params.toString()}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      console.error("Google API Error:", data.error.message);
      return null;
    }

    return data.items || [];
  } catch (e) {
    console.error("Google Search Network Error:", e);
    return null;
  }
};

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Helper: AI Detective Step
    async function askAI(systemPrompt: string, userPrompt: string, jsonMode = false) {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: jsonMode ? { type: "json_object" } : { type: "text" },
        temperature: 0.2
      });
      return response.choices[0].message.content;
    }

    const { productName, upc: providedUpc, vendorWebsite } = await req.json();

    if (!productName) {
      return NextResponse.json({ error: 'Product Name is required' }, { status: 400 });
    }

    let upc = providedUpc;
    let cleanName = productName;
    let isProduce = false;

    // --- PHASE 0: QUERY CLEANING ---
    const cleaningPrompt = `
        You are a Search Query Optimizer.
        Extract ONLY the core Brand and Product Name for a Google Search.
        Remove vendor codes (LX., BLK, 6X12) but KEEP vital flavor/variant info.
        
        Raw String: "${productName}"
        
        Return JSON: { "clean_name": "string", "is_produce": boolean }
    `;
    const cleanRes = await askAI("You are a text cleaner.", cleaningPrompt, true);
    const cleanData = JSON.parse(cleanRes || "{}");
    cleanName = cleanData.clean_name || productName;
    isProduce = cleanData.is_produce || false;

    // --- PHASE 1: IDENTIFICATION ---
    if (!upc) {
      const idResponse = await askAI(
        "You are a barcode database expert.",
        `Find the most common UPC-A (12 digit) or EAN-13 barcode for: "${cleanName}". 
         Return JSON: { "upc": "string or null", "manufacturer": "string" }`,
        true
      );
      const idData = JSON.parse(idResponse || "{}");
      upc = idData.upc;
    }

    // --- PHASE 2: INVESTIGATION (Multi-Source Crawl) ---

    let searchContext = "";
    let sourceUrl = "";
    let imageUrl = "";
    let textResults: any[] = [];

    // STRATEGY A: VENDOR WEBSITE SEARCH (High Priority)
    if (vendorWebsite) {
      // Strip http/www for cleaner query if needed, or rely on Google's smarts
      const siteQuery = `site:${vendorWebsite} ${cleanName} ${upc || ''}`;
      console.log("Attempting Vendor Search:", siteQuery);
      const vendorResults = await googleSearch(siteQuery, 'text');

      if (vendorResults && vendorResults.length > 0) {
        textResults = vendorResults;
        sourceUrl = vendorResults[0].link;
        console.log("Found on Vendor Site:", sourceUrl);
      }
    }

    // STRATEGY B: GLOBAL SEARCH (Fallback)
    if (!textResults || textResults.length === 0) {
      console.log("Vendor search failed or no website provided. Falling back to global search.");
      const query = upc
        ? `${upc} product specifications nutrition ingredients`
        : `${cleanName} product specifications nutrition facts`;

      textResults = await googleSearch(query, 'text');
    }

    // PROCESS TEXT RESULTS
    if (textResults && textResults.length > 0) {
      if (!sourceUrl) sourceUrl = textResults[0].link;

      searchContext = textResults.slice(0, 5).map((r: any, i: number) => `
            [Source ${i + 1}]: ${r.title}
            URL: ${r.link}
            Snippet: ${r.snippet}
        `).join('\n\n');

      // Check for backup image in text metadata (OpenGraph/CSE)
      const bestTextResult = textResults.find((r: any) => r.pagemap?.cse_image?.[0]?.src || r.pagemap?.metatags?.[0]?.['og:image']);
      if (bestTextResult) {
        imageUrl = bestTextResult.pagemap?.cse_image?.[0]?.src || bestTextResult.pagemap?.metatags?.[0]?.['og:image'];
      }
    } else {
      searchContext = "No search results found. Rely on internal knowledge base and Raw Product Name.";
    }

    // STRATEGY C: IMAGE SEARCH
    // If we didn't find an image on the specific vendor page, search broadly or specifically based on availability
    if (!imageUrl) {
      // If we have a vendor website, try to find the image on that site specifically first
      if (vendorWebsite) {
        const vendorImgQuery = `site:${vendorWebsite} ${cleanName}`;
        const vendorImages = await googleSearch(vendorImgQuery, 'image');
        if (vendorImages && vendorImages.length > 0) {
          imageUrl = vendorImages[0].link;
        }
      }

      // Fallback to global image search
      if (!imageUrl) {
        const imgQuery1 = upc
          ? `${upc} product packaging`
          : `${cleanName} product packaging white background`;
        const imageResults = await googleSearch(imgQuery1, 'image');
        if (imageResults && imageResults.length > 0) {
          imageUrl = imageResults[0].link;
        }
      }
    }

    // --- PHASE 3: EXTRACTION ---

    const extractionPrompt = `
      You are a Product Data Entry Bot.
      
      RAW NAME: "${productName}" (Contains vital Pack/Size info)
      CLEAN NAME: "${cleanName}"
      UPC: "${upc || 'Unknown'}"
      VENDOR SITE: "${vendorWebsite || 'N/A'}"
      
      WEB SEARCH CONTEXT:
      ${searchContext}

      TASK:
      Synthesize data.
      **CRITICAL:** 1. If the context comes from the VENDOR SITE (${vendorWebsite}), prioritize that information above all else.
      2. The RAW NAME often contains the Pack Size (e.g. '6x12') and Net Weight. Use it if the Web Context is vague.
      
      Return JSON:
      {
        "manufacturer": "String (Extract from context or infer)",
        "description": "Professional 2-sentence description.",
        "category": "Industry Category",
        "subcategory": "Specific Subcategory",
        "target_demographic": "Primary cultural audience",
        
        "net_weight": "String (e.g. '10 lbs', '12 oz', '100g')",
        "uom": "String (The unit only, e.g. 'lbs', 'oz', 'kg', 'g')",
        "pack_quantity": Number (The count of base units inside this item. Default 1),
        
        "upc_ean": "String (Confirmed barcode)",
        
        "ingredients": "String list or 'N/A'",
        "allergens": "String or 'None'",
        "storage_instructions": "String (e.g. Keep Frozen)",
        "nutrients_json": { "calories": "val", "protein": "val", "fat": "val" }
      }
    `;

    const finalJsonStr = await askAI("You are a JSON extractor.", extractionPrompt, true);
    const finalData = JSON.parse(finalJsonStr || "{}");

    // Merge Findings
    const result = {
      ...finalData,
      upc_ean: finalData.upc_ean || upc,
      image_url: imageUrl || "",
      source_url: sourceUrl
    };

    return NextResponse.json({ success: true, data: result });

  } catch (error: any) {
    console.error("Enrichment API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}