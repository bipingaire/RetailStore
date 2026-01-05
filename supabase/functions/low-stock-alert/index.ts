// Supabase Edge Function for Low Stock Alerts
// Deploy: supabase functions deploy low-stock-alert

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // Get all tenants
        const { data: tenants } = await supabase
            .from('retail-store-tenant')
            .select('tenant-id, store-name, email-address')
            .eq('is-active', true);

        if (!tenants) {
            return new Response(
                JSON.stringify({ message: 'No tenants found' }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const alerts: any[] = [];

        // Check each tenant's inventory
        for (const tenant of tenants) {
            const { data: lowStockItems } = await supabase
                .from('retail-store-inventory-item')
                .select(`
          inventory-id,
          current-stock-quantity,
          reorder-point-value,
          global-product-master-catalog (product-name)
        `)
                .eq('tenant-id', tenant['tenant-id'])
                .lte('current-stock-quantity', supabase.rpc('reorder-point-value'))
                .eq('is-active', true);

            if (lowStockItems && lowStockItems.length > 0) {
                // Send alert email
                const emailHTML = buildLowStockAlertEmail(tenant['store-name'], lowStockItems);

                if (SENDGRID_API_KEY && tenant['email-address']) {
                    await fetch('https://api.sendgrid.com/v3/mail/send', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${SENDGRID_API_KEY}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            personalizations: [{
                                to: [{ email: tenant['email-address'], name: tenant['store-name'] }],
                                subject: `⚠️ Low Stock Alert - ${lowStockItems.length} items`,
                            }],
                            from: {
                                email: 'alerts@retailstore.com',
                                name: 'RetailStore Alerts',
                            },
                            content: [{
                                type: 'text/html',
                                value: emailHTML,
                            }],
                        }),
                    });
                }

                alerts.push({
                    tenant: tenant['store-name'],
                    itemCount: lowStockItems.length,
                    items: lowStockItems.map((item: any) => ({
                        name: item['global-product-master-catalog']?.['product-name'],
                        currentStock: item['current-stock-quantity'],
                        reorderPoint: item['reorder-point-value'],
                    })),
                });
            }
        }

        return new Response(
            JSON.stringify({
                success: true,
                alertsSent: alerts.length,
                alerts: alerts
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error: any) {
        console.error('Error checking low stock:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
});

function buildLowStockAlertEmail(storeName: string, items: any[]): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Low Stock Alert</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">⚠️ Low Stock Alert</h1>
                  <p style="margin: 10px 0 0 0; color: #fef3c7; font-size: 16px;">${storeName}</p>
                </td>
              </tr>

              <!-- Alert Message -->
              <tr>
                <td style="padding: 30px;">
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
                    The following <strong>${items.length} item${items.length > 1 ? 's are' : ' is'}</strong> running low on stock and need to be reordered:
                  </p>

                  <table width="100%" cellpadding="12" style="border: 2px solid #fee2e2; border-radius: 8px;">
                    <tr style="background-color: #fef2f2;">
                      <th align="left" style="font-size: 14px; color: #991b1b; font-weight: bold;">Product</th>
                      <th align="center" style="font-size: 14px; color: #991b1b; font-weight: bold;">Current</th>
                      <th align="center" style="font-size: 14px; color: #991b1b; font-weight: bold;">Reorder Point</th>
                    </tr>
                    ${items.map((item: any) => `
                      <tr style="border-top: 1px solid #fee2e2;">
                        <td style="font-size: 14px; color: #374151; padding: 12px;">
                          <strong>${item['global-product-master-catalog']?.['product-name'] || 'Unknown Product'}</strong>
                        </td>
                        <td align="center" style="font-size: 14px; color: #dc2626; font-weight: bold; padding: 12px;">
                          ${item['current-stock-quantity']}
                        </td>
                        <td align="center" style="font-size: 14px; color: #6b7280; padding: 12px;">
                          ${item['reorder-point-value']}
                        </td>
                      </tr>
                    `).join('')}
                  </table>

                  <div style="margin: 30px 0; padding: 20px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                    <p style="margin: 0; font-size: 14px; color: #92400e;">
                      <strong>Action Required:</strong> Please reorder these items to maintain adequate stock levels and avoid stockouts.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; font-size: 12px; color: #6b7280;">
                    This is an automated alert from RetailStore Inventory Management
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
