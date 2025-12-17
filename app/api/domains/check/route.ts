import { NextResponse } from 'next/server';

// Switch to 'api.godaddy.com' for production
const GODADDY_API_URL = 'https://api.ote-godaddy.com'; 

export async function POST(req: Request) {
  try {
    const { domain } = await req.json();
    
    const apiKey = process.env.GODADDY_API_KEY;
    const apiSecret = process.env.GODADDY_API_SECRET;

    if (!apiKey || !apiSecret) {
        // Fallback for demo if keys aren't set
        console.warn("GoDaddy Keys missing, returning mock response");
        return NextResponse.json({ 
            available: true, 
            price: 14.99, 
            currency: 'USD', 
            domain: domain 
        });
    }

    const response = await fetch(`${GODADDY_API_URL}/v1/domains/available?domain=${domain}`, {
      method: 'GET',
      headers: {
        'Authorization': `sso-key ${apiKey}:${apiSecret}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GoDaddy Error: ${errorText}`);
    }

    const data = await response.json();
    
    // Convert price (GoDaddy returns price in micros, e.g. 1000000 = 1.00)
    const price = data.price ? data.price / 1000000 : 0;

    return NextResponse.json({ 
        available: data.available, 
        price: price,
        currency: data.currency,
        domain: data.domain
    });

  } catch (error: any) {
    console.error("Domain Check Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}