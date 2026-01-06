import { NextRequest, NextResponse } from 'next/server';

interface FacebookPostRequest {
    message: string;
    imageUrl?: string;
    accessToken: string;
    pageId: string;
}

export async function POST(request: NextRequest) {
    try {
        const { message, imageUrl, accessToken, pageId }: FacebookPostRequest = await request.json();

        if (!message || !accessToken || !pageId) {
            return NextResponse.json({
                error: 'Message, access token, and page ID are required'
            }, { status: 400 });
        }

        const facebookApiUrl = `https://graph.facebook.com/v18.0/${pageId}/feed`;

        const payload: any = {
            message,
            access_token: accessToken
        };

        if (imageUrl) {
            payload.link = imageUrl;
        }

        const response = await fetch(facebookApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Facebook API error');
        }

        return NextResponse.json({
            success: true,
            postId: data.id,
            message: 'Posted successfully to Facebook'
        });

    } catch (error: any) {
        console.error('Facebook posting error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to post to Facebook' },
            { status: 500 }
        );
    }
}
