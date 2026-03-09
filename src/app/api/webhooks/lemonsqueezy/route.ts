import { NextResponse } from "next/server";
import crypto from "crypto";
import type { Order } from "@/lib/orders";

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(digest)
    );
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      console.error("[webhook] LEMONSQUEEZY_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    const rawBody = await request.text();
    const signature = request.headers.get("x-signature") ?? "";

    if (!verifyWebhookSignature(rawBody, signature, secret)) {
      console.error("[webhook] Invalid signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(rawBody);
    const eventName = event.meta?.event_name;

    if (eventName !== "order_created") {
      return NextResponse.json({ received: true });
    }

    const attrs = event.data?.attributes;
    const order: Order = {
      id: crypto.randomUUID(),
      lsOrderId: String(event.data?.id ?? ""),
      customerEmail: attrs?.user_email ?? "",
      customerName: attrs?.user_name ?? "",
      productId: String(attrs?.first_order_item?.product_id ?? ""),
      productName: attrs?.first_order_item?.product_name ?? "AI Native Playbook",
      variantId: String(attrs?.first_order_item?.variant_id ?? ""),
      amount: attrs?.total ?? 0,
      currency: attrs?.currency ?? "USD",
      createdAt: new Date().toISOString(),
    };

    try {
      await sendConfirmationEmail(order);
    } catch (emailErr) {
      console.error("[order] Email send failed:", emailErr);
    }

    return NextResponse.json({ received: true, orderId: order.id });
  } catch (err) {
    console.error("[webhook] Error processing webhook:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function sendConfirmationEmail(order: Order): Promise<void> {
  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) {
    return;
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": brevoKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: "AI Native Playbook Series",
        email: "hello@ai-driven-architect.com",
      },
      to: [{ email: order.customerEmail, name: order.customerName }],
      subject: `Your ${order.productName} is ready to download`,
      htmlContent: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a2e;">Thank you for your purchase!</h1>
          <p>Hi ${order.customerName || "there"},</p>
          <p>Your order for <strong>${order.productName}</strong> has been confirmed.</p>
          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Order ID:</strong> ${order.lsOrderId}</p>
            <p style="margin: 0;"><strong>Amount:</strong> $${(order.amount / 100).toFixed(2)} ${order.currency}</p>
          </div>
          <p>You can download your PDF from your Lemon Squeezy receipt:</p>
          <a href="https://app.lemonsqueezy.com/my-orders" style="display: inline-block; background: #d4a574; color: #1a1a2e; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Access My Orders
          </a>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            If you have any issues, reply to this email and we'll help you right away.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px;">AI Native Playbook Series | ai-driven-architect.com</p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Brevo API error: ${res.status} ${errText}`);
  }
}
