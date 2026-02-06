// OAuth Callback Handler for Facebook/Instagram
import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken } from '@/lib/social-media';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const code = searchParams.get('code');
        const state = searchParams.get('state'); // Contains platform and tenant info
        const error = searchParams.get('error');

        if (error) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/admin/settings?error=${encodeURIComponent(error)}`
            );
        }

        if (!code || !state) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/admin/settings?error=missing_code`
            );
        }

        // Decode state (format: "platform:tenantId")
        const [platform, tenantId] = state.split(':');

        if (platform !== 'facebook' && platform !== 'instagram') {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/admin/settings?error=invalid_platform`
            );
        }

        // Exchange code for access token
        const result = await exchangeCodeForToken(code, platform as 'facebook' | 'instagram');

        if (result.error || !result.accessToken || !result.pageId) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/admin/settings?error=${encodeURIComponent(result.error || 'token_exchange_failed')}`
            );
        }

        // Save to database
        const supabase = createRouteHandlerClient({ cookies });

        const { error: dbError } = await supabase
            .from('social-media-accounts')
            .upsert({
                'tenant-id': tenantId,
                platform: platform,
                'page-id': result.pageId,
                'access-token': result.accessToken,
                'is-active': true,
                'connected-at': new Date().toISOString(),
            }, {
                onConflict: 'tenant-id,platform,page-id'
            });

        if (dbError) {
            console.error('Database error:', dbError);
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/admin/settings?error=database_save_failed`
            );
        }

        // Success - redirect back to settings
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/admin/settings?tab=social&success=${platform}_connected`
        );
    } catch (error: any) {
        console.error('OAuth callback error:', error);
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/admin/settings?error=${encodeURIComponent(error.message)}`
        );
    }
}
