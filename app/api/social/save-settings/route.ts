import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    try {
        const supabase = createRouteHandlerClient({ cookies });
        const { accounts } = await req.json();

        // 1. Get current tenant
        // In a real app we'd get this from session claim or a specific tenant-context header.
        // For now we'll fetch the first tenant the user owns/manges.
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: roleData } = await supabase
            .from('tenant-user-role')
            .select('tenant-id')
            .eq('user-id', session.user.id)
            .single();

        if (!roleData) return NextResponse.json({ error: 'No tenant found for user' }, { status: 403 });
        const tenantId = roleData['tenant-id'];

        // 2. Save Accounts
        const platforms = ['facebook', 'instagram', 'tiktok'];

        for (const p of platforms) {
            const pageId = accounts[p];
            const token = accounts[`${p}_token`];

            if (pageId && token) {
                await supabase.from('social-media-accounts').upsert({
                    'tenant-id': tenantId,
                    'platform': p,
                    'page-id': pageId,
                    'account-name': pageId, // Defaulting name to ID/Handle
                    'access-token': token,
                    'is-active': true,
                    'connected-at': new Date().toISOString()
                }, {
                    onConflict: 'tenant-id, platform, page-id'
                });
            }
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Save Settings Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
