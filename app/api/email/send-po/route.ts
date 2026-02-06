import { NextRequest, NextResponse } from 'next/server';
import { sendPurchaseOrder } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const { to, subject, message } = await request.json();

        // Validate inputs
        if (!to || !message) {
            return NextResponse.json(
                { error: 'Missing required fields: to, message' },
                { status: 400 }
            );
        }

        // Send email
        const result = await sendPurchaseOrder({
            to,
            subject: subject || `Purchase Order - ${new Date().toLocaleDateString()}`,
            message,
        });

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Failed to send email' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Email sent successfully',
            data: result.data,
        });
    } catch (error: any) {
        console.error('Send PO API error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
