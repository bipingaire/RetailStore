// Supabase Edge Function for Order Confirmation Emails
// Deploy: supabase functions deploy order-confirmation

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface EmailData {
    orderId: string;
    customerEmail: string;
    customerName: string;
}

serve(async (req) => {
    try {
        const { orderId, customerEmail, customerName }: EmailData = await req.json();

        if (!orderId || !customerEmail) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Initialize Supabase client
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // Fetch order details
        const { data: order, error: orderError } = await supabase
            .from('customer-order-header')
            .select(`
        *,
        order-line-item-detail (*),
        delivery-address-information (*),
        retail-store-tenant (store-name, phone-number, email-address)
      `)
            .eq('order-id', orderId)
            .single();

        if (orderError || !order) {
            throw new Error('Order not found');
        }

        // Build email HTML
        const emailHTML = buildOrderConfirmationEmail(order, customerName);

        // Send email via SendGrid
        if (SENDGRID_API_KEY) {
            const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${SENDGRID_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    personalizations: [{
                        to: [{ email: customerEmail, name: customerName }],
                        subject: `Order Confirmation #${orderId.substring(0, 8)}`,
                    }],
                    from: {
                        email: order['retail-store-tenant']?.['email-address'] || 'noreply@retailstore.com',
                        name: order['retail-store-tenant']?.['store-name'] || 'RetailStore',
                    },
                    content: [{
                        type: 'text/html',
                        value: emailHTML,
                    }],
                }),
            });

            if (!sendGridResponse.ok) {
                throw new Error('Failed to send email via SendGrid');
            }

            return new Response(
                JSON.stringify({ success: true, message: 'Email sent successfully' }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        } else {
            // Fallback: Log email (for development)
            console.log('Email would be sent to:', customerEmail);
            console.log('Email HTML:', emailHTML);

            return new Response(
                JSON.stringify({
                    success: true,
                    message: 'Email logged (SendGrid not configured)',
                    preview: emailHTML.substring(0, 200)
                }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }

    } catch (error: any) {
        console.error('Error sending order confirmation:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
});

function buildOrderConfirmationEmail(order: any, customerName: string): string {
    const storeName = order['retail-store-tenant']?.['store-name'] || 'RetailStore';
    const orderNumber = order['order-id'].substring(0, 8);
    const orderDate = new Date(order['created-at']).toLocaleDateString();
    const items = order['order-line-item-detail'] || [];
    const address = order['delivery-address-information']?.[0];

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">✓ Order Confirmed!</h1>
                  <p style="margin: 10px 0 0 0; color: #d1fae5; font-size: 16px;">Thank you for your purchase</p>
                </td>
              </tr>

              <!-- Order Info -->
              <tr>
                <td style="padding: 30px;">
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151;">Hi ${customerName},</p>
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
                    We've received your order and it's being processed. You'll receive another email when your order ships.
                  </p>

                  <table width="100%" cellpadding="10" style="background-color: #f9fafb; border-radius: 8px; margin: 20px 0;">
                    <tr>
                      <td style="font-size: 14px; color: #6b7280;">Order Number:</td>
                      <td align="right" style="font-size: 14px; font-weight: bold; color: #111827;">#${orderNumber}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 14px; color: #6b7280;">Order Date:</td>
                      <td align="right" style="font-size: 14px; font-weight: bold; color: #111827;">${orderDate}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 14px; color: #6b7280;">Payment Status:</td>
                      <td align="right" style="font-size: 14px; font-weight: bold; color: #10b981;">${order['payment-status']}</td>
                    </tr>
                  </table>

                  ${address ? `
                  <h3 style="margin: 30px 0 10px 0; font-size: 18px; color: #111827;">Delivery Address</h3>
                  <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.8;">
                    ${address['address-line-1']}<br>
                    ${address['address-line-2'] ? address['address-line-2'] + '<br>' : ''}
                    ${address['city-name']}, ${address['state-code']} ${address['zip-code']}
                  </p>
                  ` : `
                  <div style="margin: 30px 0; padding: 15px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                    <p style="margin: 0; font-size: 14px; color: #92400e;">
                      <strong>Pickup:</strong> Your order will be ready for pickup at our store location.
                    </p>
                  </div>
                  `}

                  <h3 style="margin: 30px 0 15px 0; font-size: 18px; color: #111827;">Order Items</h3>
                  <table width="100%" cellpadding="10" style="border-top: 2px solid #e5e7eb;">
                    ${items.map((item: any) => `
                      <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="font-size: 14px; color: #374151;">
                          <strong>${item['product-name']}</strong><br>
                          <span style="color: #6b7280; font-size: 12px;">Qty: ${item['quantity-ordered']}</span>
                        </td>
                        <td align="right" style="font-size: 14px; font-weight: bold; color: #10b981;">
                          $${item['total-amount'].toFixed(2)}
                        </td>
                      </tr>
                    `).join('')}
                    
                    <tr>
                      <td style="padding-top: 15px; font-size: 14px; color: #6b7280;">Subtotal</td>
                      <td align="right" style="padding-top: 15px; font-size: 14px; font-weight: bold;">
                        $${order['total-amount-value'].toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td style="font-size: 14px; color: #6b7280;">Tax</td>
                      <td align="right" style="font-size: 14px; font-weight: bold;">
                        $${order['tax-amount'].toFixed(2)}
                      </td>
                    </tr>
                    <tr style="border-top: 2px solid #e5e7eb;">
                      <td style="padding-top: 15px; font-size: 18px; font-weight: bold; color: #111827;">Total</td>
                      <td align="right" style="padding-top: 15px; font-size: 18px; font-weight: bold; color: #10b981;">
                        $${order['final-amount'].toFixed(2)}
                      </td>
                    </tr>
                  </table>

                  <div style="margin: 30px 0; text-align: center;">
                    <p style="margin: 0 0 15px 0; font-size: 14px; color: #6b7280;">Questions about your order?</p>
                    <p style="margin: 0; font-size: 14px; color: #10b981;">
                      <strong>Contact us:</strong> ${order['retail-store-tenant']?.['phone-number'] || '(555) 123-4567'}
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: #111827;">
                    ${storeName}
                  </p>
                  <p style="margin: 0; font-size: 12px; color: #6b7280;">
                    © ${new Date().getFullYear()} All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
