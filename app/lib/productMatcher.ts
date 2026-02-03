import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type MatchStatus = 'matched' | 'review' | 'new';

export type MatchedProduct = {
    id: string;
    name: string;
    sku: string;
    confidence: number;
};

export async function findBestMatch(rawName: string): Promise<{
    status: MatchStatus;
    match?: MatchedProduct;
    suggestions: MatchedProduct[];
}> {
    if (!rawName || rawName.trim().length === 0) {
        return { status: 'new', suggestions: [] };
    }

    const cleanName = rawName.trim();

    // 1. Try exact match by name (case-insensitive)
    const { data: exactMatch } = await supabase
        .from('global-product-master-catalog')
        .select('product-id, product-name, sku')
        .ilike('product-name', cleanName)
        .limit(1);

    if (exactMatch && exactMatch.length > 0) {
        return {
            status: 'matched',
            match: {
                id: exactMatch[0]['product-id'],
                name: exactMatch[0]['product-name'],
                sku: exactMatch[0].sku || '',
                confidence: 1.0
            },
            suggestions: []
        };
    }

    // 2. Try SKU/UPC match
    const { data: skuMatch } = await supabase
        .from('global-product-master-catalog')
        .select('product-id, product-name, sku')
        .or(`sku.ilike.${cleanName},barcode.ilike.${cleanName}`)
        .limit(1);

    if (skuMatch && skuMatch.length > 0) {
        return {
            status: 'matched',
            match: {
                id: skuMatch[0]['product-id'],
                name: skuMatch[0]['product-name'],
                sku: skuMatch[0].sku || '',
                confidence: 1.0
            },
            suggestions: []
        };
    }

    // 3. Fuzzy search by partial name (top 5 suggestions)
    const keywords = cleanName.split(' ').filter(w => w.length > 2);
    if (keywords.length > 0) {
        const searchPattern = keywords.join('%');
        const { data: fuzzyMatches } = await supabase
            .from('global-product-master-catalog')
            .select('product-id, product-name, sku')
            .ilike('product-name', `%${searchPattern}%`)
            .limit(5);

        if (fuzzyMatches && fuzzyMatches.length > 0) {
            const suggestions = fuzzyMatches.map((m, idx) => ({
                id: m['product-id'],
                name: m['product-name'],
                sku: m.sku || '',
                confidence: Math.max(0.5, 0.9 - (idx * 0.1)) // Decreasing confidence
            }));

            return {
                status: 'review',
                match: suggestions[0], // Best guess
                suggestions
            };
        }
    }

    // 4. No match found - mark as new product
    return {
        status: 'new',
        suggestions: []
    };
}

// Batch matching for multiple items
export async function matchProducts(items: { product_name: string; vendor_code?: string; upc?: string }[]) {
    return Promise.all(
        items.map(async (item) => {
            // Try matching by SKU/UPC first if available
            if (item.vendor_code || item.upc) {
                const codeMatch = await findBestMatch(item.vendor_code || item.upc || '');
                if (codeMatch.status === 'matched') {
                    return codeMatch;
                }
            }
            // Fall back to name matching
            return findBestMatch(item.product_name);
        })
    );
}
