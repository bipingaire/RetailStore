import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    try {
        const supabase = createRouteHandlerClient({ cookies });
        const { campaignId, platforms } = await req.json(); // platforms = ['facebook', 'instagram']

        // 1. Get Session & Tenant
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: roleData } = await supabase
            .from('tenant-user-role')
            .select('tenant-id')
            .eq('user-id', session.user.id)
            .single();
        if (!roleData) return NextResponse.json({ error: 'No tenant' }, { status: 403 });
        const tenantId = roleData['tenant-id'];

        // 2. Fetch Campaign Data
        const { data: campaign } = await supabase
            .from('marketing-campaign-master') // Correct table name
            .select('*')
            .eq('campaign-id', campaignId) // Correct ID column
            .single();

        if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });

        const message = `${campaign['campaign-name']} \n\n${campaign['title-text'] || ''} - ${campaign['subtitle-text'] || ''}\n\nShop now!`;
        const imageUrl = campaign['banner-image-url'] || 'https://via.placeholder.com/800x400';

        // 3. Post to Platforms
        const results = [];

        // Facebook
        if (platforms.includes('facebook')) {
            // Fetch FB Credentials
            const { data: fbAcc } = await supabase
                .from('social-media-accounts')
                .select('*')
                .eq('tenant-id', tenantId)
                .eq('platform', 'facebook')
                .single();

            if (fbAcc) {
                // Call Internal or External FB Logic
                // Simple fetch to FB Graph API directly here or use helper
                try {
                    const fbUrl = `https://graph.facebook.com/v18.0/${fbAcc['page-id']}/feed`;
                    const fbRes = await fetch(fbUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            message: message,
                            link: imageUrl, // simplistic
                            access_token: fbAcc['access-token']
                        })
                    });
                    const fbJson = await fbRes.json();
                    if (!fbRes.ok) throw new Error(fbJson.error?.message || 'FB Error');
                    results.push({ platform: 'facebook', status: 'success', id: fbJson.id });
                } catch (e: any) {
                    results.push({ platform: 'facebook', status: 'error', error: e.message });
                }
            } else {
                results.push({ platform: 'facebook', status: 'skipped', reason: 'No account connected' });
            }
        }

        // Instagram (Simplified - requires Media Container flow)
        // We'll skip complex IG flow implementation in this specific file but acknowledge it
        if (platforms.includes('instagram')) {
            results.push({ platform: 'instagram', status: 'skipped', reason: 'IG Publishing requiring advanced media flow not fully implemented in this stub.' });
        }

        return NextResponse.json({ success: true, results, message: 'Processed ' + platforms.length + ' platforms' });

    } catch (err: any) {
        console.error("Publish Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
