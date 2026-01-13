import { Resend } from 'resend';

// Initialize lazily inside functions
// const resend = ...

/**
 * Send purchase order email to vendor
 */
export async function sendPurchaseOrder(params: {
    to: string;
    subject: string;
    message: string;
    from?: string;
}) {
    const { to, subject, message, from = 'orders@retailstore.app' } = params;

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
            from,
            to,
            subject,
            text: message,
        });

        if (error) {
            console.error('Email error:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error: any) {
        console.error('Email send failed:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Send low stock alert to store owner
 */
export async function sendLowStockAlert(params: {
    to: string;
    items: Array<{ name: string; stock: number; reorderPoint: number }>;
}) {
    const { to, items } = params;

    const message = `
LOW STOCK ALERT

The following items are below reorder point:

${items
            .map(
                (item, idx) =>
                    `${idx + 1}. ${item.name}
   Current Stock: ${item.stock}
   Reorder Point: ${item.reorderPoint}
   Action Needed: Restock soon`
            )
            .join('\n\n')}

Log in to your dashboard to generate purchase orders.
  `.trim();

    return sendPurchaseOrder({
        to,
        subject: '⚠️ Low Stock Alert - Action Required',
        message,
        from: 'alerts@retailstore.app',
    });
}

/**
 * Send order confirmation to customer (for e-commerce feature)
 */
export async function sendOrderConfirmation(params: {
    to: string;
    orderNumber: string;
    total: number;
    items: Array<{ name: string; quantity: number; price: number }>;
}) {
    const { to, orderNumber, total, items } = params;

    const message = `
ORDER CONFIRMATION

Order #: ${orderNumber}
Date: ${new Date().toLocaleDateString()}

Items:
${items
            .map(
                (item, idx) =>
                    `${idx + 1}. ${item.name}
   Quantity: ${item.quantity}
   Price: $${item.price.toFixed(2)}`
            )
            .join('\n\n')}

Total: $${total.toFixed(2)}

Thank you for your order!
  `.trim();

    return sendPurchaseOrder({
        to,
        subject: `Order Confirmation - #${orderNumber}`,
        message,
        from: 'orders@retailstore.app',
    });
}
