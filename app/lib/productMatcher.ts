const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

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

    try {
        const response = await fetch(`${API_URL}/api/products/search?q=${encodeURIComponent(rawName)}&limit=5`);
        const data = await response.json();

        if (!data.success || !data.results || data.results.length === 0) {
            return { status: 'new', suggestions: [] };
        }

        const suggestions = data.results.map((item: any, idx: number) => ({
            id: item.id,
            name: item.name,
            sku: item.sku || '',
            confidence: item.confidence || Math.max(0.5, 0.9 - (idx * 0.1))
        }));

        // If first result has high confidence (>0.9), auto-match
        if (suggestions[0].confidence > 0.9) {
            return {
                status: 'matched',
                match: suggestions[0],
                suggestions: []
            };
        }

        // Otherwise, needs review
        return {
            status: 'review',
            match: suggestions[0],
            suggestions
        };

    } catch (err) {
        console.error('Product matching failed:', err);
        return { status: 'new', suggestions: [] };
    }
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
