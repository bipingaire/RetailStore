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

    const ALLOWED_Root_DOMAINS = ["retailOS.cloud", "indumart.us"];

    // 1. Allow the main root domains themselves (e.g. retailOS.cloud, indumart.us)
    // Check if domain is exactly one of the roots or www.root
    if (ALLOWED_Root_DOMAINS.includes(domain) || ALLOWED_Root_DOMAINS.includes(domain.replace('www.', ''))) {
        return new NextResponse("OK", { status: 200 });
    }

    // 2. Determine which root domain this subdomain belongs to
    const matchedRoot = ALLOWED_Root_DOMAINS.find(root => domain.endsWith(`.${root}`));

    if (!matchedRoot) {
        console.log(`Domain check failed: ${domain} is not a subdomain of allowed roots`);
        return new NextResponse("Domain not allowed", { status: 403 });
    }

    // 3. Extract Validation Subdomain
    // e.g. "store2.indumart.us" -> "store2"
    const subdomain = domain.replace(`.${matchedRoot}`, "");

    // 4. Check DB for valid active subdomain
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // Query the NEW mapping table
        const { data, error } = await supabase
            .from("subdomain-tenant-mapping")
            .select("tenant-id")
            .eq("subdomain", subdomain)
            .eq("is-active", true)
            .single();

        if (error || !data) {
            console.log(`Domain check failed for ${domain}: Subdomain '${subdomain}' not found in mapping`);
            return new NextResponse("Subdomain not found", { status: 404 });
        }

        // Tenant exists and is active
        return new NextResponse("OK", { status: 200 });
    } catch (err) {
        console.error("Domain check error:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
