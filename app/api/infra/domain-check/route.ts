import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// This endpoint is called by Caddy to verify if a domain is allowed to have an SSL certificate.
// Caddy sends a GET request with ?domain=example.com

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain");

    if (!domain) {
        return new NextResponse("Domain parameter required", { status: 400 });
    }

    // 1. Allow the main domain (generic check)
    // We allow "retailOS.cloud" and "www.retailOS.cloud"
    // You might want to make this configurable via env var
    const mainDomain = "retailOS.cloud";
    if (domain === mainDomain || domain === `www.${mainDomain}`) {
        return new NextResponse("OK", { status: 200 });
    }

    // 2. Check if it's a valid subdomain for a tenant
    // Extract subdomain part: "demo.retailOS.cloud" -> "demo"
    const subdomain = domain.replace(`.${mainDomain}`, "");

    // Basic sanity check: if domain doesn't end with mainDomain, and it's not mainDomain, 
    // then maybe it's a custom domain? (Future feature). 
    // For now, only allow subdomains of retailOS.cloud
    if (!domain.endsWith(mainDomain)) {
        return new NextResponse("Domain not allowed", { status: 403 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { data, error } = await supabase
            .from("retail-store-tenant")
            .select("id")
            .eq("subdomain", subdomain)
            .eq("is-active", true)
            .single();

        if (error || !data) {
            console.log(`Domain check failed for ${domain}: Tenant not found`);
            return new NextResponse("Tenant not found", { status: 404 });
        }

        // Tenant exists and is active
        return new NextResponse("OK", { status: 200 });
    } catch (err) {
        console.error("Domain check error:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
