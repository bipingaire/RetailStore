import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase Admin Client (Service Role)
// We need this to create users programmatically without sending confirmation emails immediately implies
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // MUST use service role for admin.createUser
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, fullName, storeName, subdomain } = body;

        // 1. Basic Validation
        if (!email || !password || !storeName || !subdomain) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 2. Check Subdomain Availability (Database Check)
        // We use the admin client to check the mapping table directly
        const { data: existingSubdomain } = await supabaseAdmin
            .from('subdomain-tenant-mapping')
            .select('subdomain')
            .eq('subdomain', subdomain)
            .single();

        if (existingSubdomain) {
            return NextResponse.json({ error: 'Subdomain is already taken' }, { status: 409 });
        }

        // 3. Create Auth User
        // Using admin.createUser auto-confirms the email (no SMTP needed for now)
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm for instant access
            user_metadata: {
                full_name: fullName
            }
        });

        if (authError) {
            console.error('Auth User Create Error:', authError);
            return NextResponse.json({ error: authError.message }, { status: 400 });
        }

        const userId = authData.user.id;

        // 4. Create Tenant (Store)
        // We link the owner-user-id immediately
        const { data: tenantData, error: tenantError } = await supabaseAdmin
            .from('retail-store-tenant')
            .insert({
                'store-name': storeName,
                'subscription-tier': 'free', // Default tier
                'is-active': true,
                'owner-user-id': userId
            })
            .select('tenant-id')
            .single();

        if (tenantError) {
            // Rollback User Creation if Tenant fails? (Ideally yes, but simplified here)
            // Real-world: Delete user to clean up
            await supabaseAdmin.auth.admin.deleteUser(userId);
            console.error('Tenant Create Error:', tenantError);
            return NextResponse.json({ error: 'Failed to create store record' }, { status: 500 });
        }

        const tenantId = tenantData['tenant-id'];

        // 5. Create Subdomain Mapping
        const { error: mappingError } = await supabaseAdmin
            .from('subdomain-tenant-mapping')
            .insert({
                'subdomain': subdomain,
                'tenant-id': tenantId,
                'is-active': true
            });

        if (mappingError) {
            console.error('Mapping Create Error:', mappingError);
            // Partial failure - heavy rollback needed in prod, but for now just report
            return NextResponse.json({ error: 'Store created but domain mapping failed. Contact support.' }, { status: 500 });
        }

        // 6. Create Store Location Stub (For Map visibility)
        // We'll just put it at 0,0 or a default until they set it
        const { error: locationError } = await supabaseAdmin
            .from('store-location-mapping')
            .insert({
                'tenant-id': tenantId,
                'subdomain': subdomain,
                'latitude': 0,
                'longitude': 0,
                'address-text': 'Address not set',
                'city': 'Unknown',
                'state-province': 'Unknown',
                'country': 'USA',
                'is-active': true
            });

        // Ignore location error, non-critical

        return NextResponse.json({
            success: true,
            message: 'Store created successfully',
            redirect: '/admin/login'
        });

    } catch (error: any) {
        console.error('Registration API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
