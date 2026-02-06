#!/usr/bin/env ts-node

/**
 * Cleanup Script for Expired DALL-E Images
 * 
 * This script finds campaigns with expired image URLs (stored temporarily from DALL-E)
 * and removes them from the database. Use this for campaigns created before the
 * permanent image storage was implemented.
 *
 * Usage: npx ts-node scripts/cleanup-expired-images.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function cleanup() {
    console.log('🔍 Scanning for campaigns with potentially expired image URLs...\n');

    // Find campaigns with OpenAI temporary URLs
    const { data: campaigns, error } = await supabase
        .from('social-media-campaign')
        .select('campaign-id, campaign-image-url, campaign-title')
        .like('campaign-image-url', '%oaidalleapiprodscus.blob.core.windows.net%');

    if (error) {
        console.error('❌ Database error:', error.message);
        process.exit(1);
    }

    if (!campaigns || campaigns.length === 0) {
        console.log('✅ No campaigns with expired URLs found!');
        process.exit(0);
    }

    console.log(`Found ${campaigns.length} campaigns with temporary DALL-E URLs:\n`);

    campaigns.forEach((c: any, idx: number) => {
        console.log(`${idx + 1}. ${c['campaign-title']} (ID: ${c['campaign-id']})`);
    });

    console.log(`\n⚠️  These campaigns will be DELETED.\n`);
    console.log(`Continue? (y/n)`);

    // Simple confirmation (in production, use a proper prompt library)
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readline.question('', async (answer: string) => {
        if (answer.toLowerCase() !== 'y') {
            console.log('Aborted.');
            process.exit(0);
        }

        // Delete campaigns
        const ids = campaigns.map((c: any) => c['campaign-id']);
        const { error: deleteError } = await supabase
            .from('social-media-campaign')
            .delete()
            .in('campaign-id', ids);

        if (deleteError) {
            console.error('❌ Delete error:', deleteError.message);
            process.exit(1);
        }

        console.log(`\n✅ Deleted ${ids.length} campaigns successfully!`);
        readline.close();
        process.exit(0);
    });
}

cleanup();
