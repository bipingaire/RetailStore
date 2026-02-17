/**
 * Superadmin authentication and authorization utilities
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Check if user is a superadmin
 */
export async function isSuperadmin(supabase: SupabaseClient, userId: string): Promise<boolean> {
    if (!userId) return false;

    const { data, error } = await supabase
        .from('superadmin-users')
        .select('superadmin-id')
        .eq('user-id', userId)
        .eq('is-active', true)
        .maybeSingle();

    return !error && !!data;
}

/**
 * Get superadmin details
 */
/**
 * Middleware to require superadmin access
 */
export async function requireSuperadmin(request: NextRequest, supabase: SupabaseClient): Promise<NextResponse | null> {
    // Get user from session
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const isAdmin = await isSuperadmin(supabase, user.id);

    if (!isAdmin) {
        return NextResponse.json(
            { error: 'Unauthorized. Superadmin access required.' },
            { status: 403 }
        );
    }

    return null; // Allow request to proceed
}

/**
 * Check superadmin permission
 */
export async function hasSuperadminPermission(
    supabase: SupabaseClient,
    userId: string,
    permission: 'manage_stores' | 'manage_products' | 'manage_users' | 'view_analytics'
): Promise<boolean> {
    const details = await getSuperadminDetails(supabase, userId);

    if (!details) return false;

    const permissions = details['permissions-json'] || {};
    return permissions[permission] === true;
}

/**
 * Get superadmin details
 */
export async function getSuperadminDetails(supabase: SupabaseClient, userId: string) {
    const { data, error } = await supabase
        .from('superadmin-users')
        .select('*')
        .eq('user-id', userId)
        .eq('is-active', true)
        .maybeSingle();

    if (error) return null;
    return data;
}

/**
 * Create a new superadmin user
 */
export async function createSuperadmin(supabase: SupabaseClient, userId: string, fullName: string, email: string) {
    const { data, error } = await supabase
        .from('superadmin-users')
        .insert({
            'user-id': userId,
            'full-name': fullName,
            'email': email,
            'is-active': true
        })
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to create superadmin: ${error.message}`);
    }

    return data;
}

/**
 * Deactivate superadmin
 */
export async function deactivateSuperadmin(supabase: SupabaseClient, userId: string) {
    const { error } = await supabase
        .from('superadmin-users')
        .update({ 'is-active': false })
        .eq('user-id', userId);

    if (error) {
        throw new Error(`Failed to deactivate superadmin: ${error.message}`);
    }
}

/**
 * Get all superadmins
 */
export async function getAllSuperadmins(supabase: SupabaseClient) {
    const { data, error } = await supabase
        .from('superadmin-users')
        .select('*')
        .order('created-at', { ascending: false });

    if (error) {
        throw new Error(`Failed to fetch superadmins: ${error.message}`);
    }

    return data || [];
}
