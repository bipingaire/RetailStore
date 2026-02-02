import { NextRequest, NextResponse } from 'next/server';
import { getDomainType } from '@/lib/domain-utils';

export async function GET(request: NextRequest) {
    const host = request.headers.get('host') || 'unknown';
    const domainType = getDomainType(host);

    return NextResponse.json({
        host,
        domainType,
        headers: Object.fromEntries(request.headers.entries()),
        url: request.url,
        nextUrl: {
            pathname: request.nextUrl.pathname,
            search: request.nextUrl.search,
            origin: request.nextUrl.origin
        }
    });
}
