/**
 * Email sending utilities via Brevo API
 *
 * Used by webhook handlers to send purchase confirmation emails.
 * Extracted for testability and reuse across payment providers.
 */

import type { Order } from "@/lib/orders";

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send purchase confirmation email via Brevo.
 *
 * Includes: product name, amount, transaction ID, download link.
 * Gracefully returns { success: false } when BREVO_API_KEY is not set.
 */
export async function sendPurchaseConfirmationEmail(
  order: Order,
  transactionId: string
): Promise<EmailSendResult> {
  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) {
    return { success: false, error: "BREVO_API_KEY not configured" };
  }

  if (!order.customerEmail) {
    return { success: false, error: "Customer email is empty" };
  }

  const siteUrl =
    (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com").trim();

  const htmlContent = buildConfirmationEmailHtml(order, transactionId, siteUrl);

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": brevoKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: "AI Native Playbook Series",
        email: "hello@ai-native-playbook.com",
      },
      to: [{ email: order.customerEmail, name: order.customerName || undefined }],
      subject: `Your ${order.productName} is ready to download`,
      htmlContent,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    return {
      success: false,
      error: `Brevo API error: ${res.status} ${errText}`,
    };
  }

  const data = await res.json();
  return { success: true, messageId: data.messageId };
}

/**
 * Build professional HTML for purchase confirmation email.
 */
export function buildConfirmationEmailHtml(
  order: Order,
  transactionId: string,
  siteUrl: string
): string {
  const displayAmount =
    order.amount >= 100
      ? `$${(order.amount / 100).toFixed(2)}`
      : `$${order.amount.toFixed(2)}`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f5;">
<div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
  <div style="background:#ffffff;border-radius:12px;padding:40px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#1a1a2e;margin:0 0 8px 0;font-size:24px;">Thank you for your purchase!</h1>
      <p style="color:#666;margin:0;font-size:16px;">Your order has been confirmed</p>
    </div>

    <p style="color:#333;font-size:16px;line-height:1.6;">Hi ${order.customerName || "there"},</p>
    <p style="color:#333;font-size:16px;line-height:1.6;">Your copy of <strong>${order.productName}</strong> is ready.</p>

    <div style="background:#faf8f5;border:1px solid #e8e0d4;border-radius:8px;padding:20px;margin:24px 0;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="color:#888;font-size:14px;padding:4px 0;">Transaction ID</td>
          <td style="color:#333;font-size:14px;padding:4px 0;text-align:right;font-family:monospace;">${transactionId}</td>
        </tr>
        <tr>
          <td style="color:#888;font-size:14px;padding:4px 0;">Product</td>
          <td style="color:#333;font-size:14px;padding:4px 0;text-align:right;">${order.productName}</td>
        </tr>
        <tr>
          <td style="color:#888;font-size:14px;padding:4px 0;">Amount</td>
          <td style="color:#333;font-size:14px;padding:4px 0;text-align:right;font-weight:bold;">${displayAmount} ${order.currency}</td>
        </tr>
      </table>
    </div>

    <div style="text-align:center;margin:32px 0;">
      <a href="https://customer.paddle.com" style="display:inline-block;background:#d4a574;color:#1a1a2e;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">
        Access My Purchase
      </a>
    </div>

    <p style="color:#555;font-size:14px;line-height:1.6;">
      You can also visit our <a href="${siteUrl}/thank-you" style="color:#d4a574;">thank-you page</a> for additional resources.
    </p>

    <p style="color:#666;font-size:14px;line-height:1.6;margin-top:24px;">
      If you have any questions, simply reply to this email and we will help you right away.
    </p>

    <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
    <p style="color:#999;font-size:12px;text-align:center;margin:0;">
      AI Native Playbook Series | ai-native-playbook.com
    </p>
  </div>
</div>
</body>
</html>`;
}

/**
 * Send payment failure notification email.
 * Notifies the customer that their payment could not be processed.
 */
export async function sendPaymentFailureEmail(
  customerEmail: string,
  customerName: string,
  productName: string
): Promise<EmailSendResult> {
  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) {
    return { success: false, error: "BREVO_API_KEY not configured" };
  }

  if (!customerEmail) {
    return { success: false, error: "Customer email is empty" };
  }

  const siteUrl =
    (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com").trim();

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": brevoKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: "AI Native Playbook Series",
        email: "hello@ai-native-playbook.com",
      },
      to: [{ email: customerEmail, name: customerName || undefined }],
      subject: `Action needed: Payment issue for ${productName}`,
      htmlContent: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f5;">
<div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
  <div style="background:#ffffff;border-radius:12px;padding:40px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
    <h1 style="color:#1a1a2e;font-size:22px;">Payment could not be processed</h1>
    <p style="color:#333;font-size:16px;line-height:1.6;">Hi ${customerName || "there"},</p>
    <p style="color:#333;font-size:16px;line-height:1.6;">
      We were unable to process your payment for <strong>${productName}</strong>.
      This can happen due to insufficient funds, an expired card, or a temporary bank issue.
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${siteUrl}/products" style="display:inline-block;background:#d4a574;color:#1a1a2e;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">
        Try Again
      </a>
    </div>
    <p style="color:#666;font-size:14px;line-height:1.6;">
      If you continue to experience issues, reply to this email and we will help.
    </p>
    <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
    <p style="color:#999;font-size:12px;text-align:center;margin:0;">
      AI Native Playbook Series | ai-native-playbook.com
    </p>
  </div>
</div>
</body>
</html>`,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    return { success: false, error: `Brevo API error: ${res.status} ${errText}` };
  }

  const data = await res.json();
  return { success: true, messageId: data.messageId };
}
