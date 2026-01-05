import { NextRequest, NextResponse } from 'next/server';

interface InstagramPostRequest {
    caption: string;
    imageUrl: string;
    accessToken: string;
    accountId: string;
}

export async function POST(request: NextRequest) {
    try {
        const { caption, imageUrl, accessToken, accountId }: InstagramPostRequest = await request.json();

        if (!caption || !imageUrl || !accessToken || !accountId) {
            return NextResponse.json({
                error: 'Caption, image URL, access token, and account ID are required'
            }, { status: 400 });
        }

        // Step 1: Create media container
        const containerUrl = `https://graph.facebook.com/v18.0/${accountId}/media`;

        const containerResponse = await fetch(containerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image_url: imageUrl,
                caption,
                access_token: accessToken
            })
        });

        const containerData = await containerResponse.json();

        if (!containerResponse.ok) {
            throw new Error(containerData.error?.message || 'Failed to create media container');
        }

        const containerId = containerData.id;

        // Step 2: Publish the media
        const publishUrl = `https://graph.facebook.com/v18.0/${accountId}/media_publish`;

        const publishResponse = await fetch(publishUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                creation_id: containerId,
                access_token: accessToken
            })
        });

        const publishData = await publishResponse.json();

        if (!publishResponse.ok) {
            throw new Error(publishData.error?.message || 'Failed to publish to Instagram');
        }

        return NextResponse.json({
            success: true,
            postId: publishData.id,
            message: 'Posted successfully to Instagram'
        });

    } catch (error: any) {
        console.error('Instagram posting error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to post to Instagram' },
            { status: 500 }
        );
    }
}
