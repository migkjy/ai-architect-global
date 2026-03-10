import { NextResponse } from "next/server";
import { verifyPaddleWebhook } from "@/lib/paddle";
import type { Order } from "@/lib/orders";
import crypto from "crypto";

// Simple in-memory dedup for serverless (best-effort)
// Prevents duplicate emails when Paddle retries webhooks
const processedTransactions = new Set<string>();
const MAX_PROCESSED = 1000;

/**
 * Paddle Webhook 핸들러
 *
 * 처리 이벤트:
 * - transaction.completed: 결제 완료 → 구매 확인 이메일 발송 + CEO 텔레그램 알림
 * - transaction.payment_failed: 결제 실패 (로깅)
 *
 * 검증: Paddle-Signature 헤더 (HMAC-SHA256)
 * 참고: https://developer.paddle.com/webhooks/overview
 */
export async function POST(request: Request) {
  try {
    const secret = process.env.PADDLE_WEBHOOK_SECRET;
    if (!secret) {
      console.error("[paddle-webhook] PADDLE_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    const rawBody = await request.text();
    const signatureHeader = request.headers.get("Paddle-Signature") ?? "";

    if (!verifyPaddleWebhook(rawBody, signatureHeader, secret)) {
      console.error("[paddle-webhook] Invalid signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(rawBody);
    const eventType: string = event.event_type ?? "";

    // transaction.completed: 결제 완료
    if (eventType === "transaction.completed") {
      const tx = event.data;
      const txId: string = tx?.id ?? "";

      // Idempotency: skip if already processed
      if (txId && processedTransactions.has(txId)) {
        console.log(`[paddle-webhook] Duplicate transaction ${txId}, skipping`);
        return NextResponse.json({ received: true, duplicate: true });
      }
      if (txId) {
        processedTransactions.add(txId);
        // Prevent memory leak in long-running instances
        if (processedTransactions.size > MAX_PROCESSED) {
          const first = processedTransactions.values().next().value;
          if (first) processedTransactions.delete(first);
        }
      }

      // Paddle Billing v2: billing_details at top level, fallback to customer object
      const customerEmail: string =
        tx?.billing_details?.email ??
        tx?.customer?.email ??
        tx?.details?.billing_details?.email ??
        "";
      const customerName: string =
        tx?.billing_details?.name ??
        tx?.customer?.name ??
        [
          tx?.details?.billing_details?.first_name ?? "",
          tx?.details?.billing_details?.last_name ?? "",
        ]
          .join(" ")
          .trim();

      // 상품 정보: tx.items (v2) or tx.details.line_items (fallback)
      const firstItem = tx?.items?.[0] ?? tx?.details?.line_items?.[0];
      const productName: string =
        firstItem?.product?.name ??
        firstItem?.price?.description ??
        "AI Native Playbook";
      const productId: string = firstItem?.product?.id ?? "";
      const priceId: string = firstItem?.price?.id ?? "";

      // 금액: Paddle sends as string in cents
      const amount: number =
        typeof tx?.details?.totals?.grand_total === "string"
          ? parseInt(tx.details.totals.grand_total, 10)
          : tx?.details?.totals?.grand_total ?? 0;
      const currency: string = tx?.currency_code ?? "USD";

      const order: Order = {
        id: crypto.randomUUID(),
        paddleTransactionId: txId,
        customerEmail,
        customerName,
        productId,
        productName,
        variantId: priceId,
        amount,
        currency,
        createdAt: new Date().toISOString(),
      };

      // Send confirmation email
      try {
        await sendPaddleConfirmationEmail(order, txId);
      } catch (emailErr) {
        console.error("[paddle-order] Email send failed:", emailErr);
      }

      // Notify CEO via Telegram
      try {
        await notifyPurchaseTelegram(order, txId);
      } catch (notifyErr) {
        console.error("[paddle-order] Telegram notify failed:", notifyErr);
      }

      return NextResponse.json({ received: true, orderId: order.id });
    }

    // transaction.payment_failed: 결제 실패 로깅
    if (eventType === "transaction.payment_failed") {
      const tx = event.data;
      console.warn(
        `[paddle-webhook] Payment failed: txn=${tx?.id}, customer=${tx?.customer_id}`
      );
      return NextResponse.json({ received: true });
    }

    // 기타 이벤트는 무시
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[paddle-webhook] Error processing webhook:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

/**
 * Paddle 구매 확인 이메일 발송 (Brevo)
 *
 * Paddle은 자체 영수증을 발송하지만,
 * 추가 확인 이메일 + PDF 다운로드 안내를 별도 발송한다.
 */
async function sendPaddleConfirmationEmail(
  order: Order,
  paddleTransactionId: string
): Promise<void> {
  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) {
    return;
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";

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
            <p style="margin: 0 0 10px 0;"><strong>Transaction ID:</strong> ${paddleTransactionId}</p>
            <p style="margin: 0;"><strong>Amount:</strong> $${(order.amount / 100).toFixed(2)} ${order.currency}</p>
          </div>
          <p>You can access your receipt and download your PDF from the Paddle customer portal:</p>
          <a href="https://customer.paddle.com" style="display: inline-block; background: #d4a574; color: #1a1a2e; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Access My Purchase
          </a>
          <p style="margin-top: 20px;">
            Or visit our thank-you page:
            <a href="${siteUrl}/thank-you" style="color: #d4a574;">${siteUrl}/thank-you</a>
          </p>
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

/**
 * CEO 텔레그램 알림 — 결제 완료 시 즉시 통보
 */
async function notifyPurchaseTelegram(
  order: Order,
  paddleTransactionId: string
): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;

  const message = [
    `New Purchase!`,
    `Product: ${order.productName}`,
    `Amount: $${(order.amount / 100).toFixed(2)} ${order.currency}`,
    `Customer: ${order.customerEmail}`,
    `Transaction: ${paddleTransactionId}`,
  ].join("\n");

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });
  } catch (err) {
    console.error("[paddle-webhook] Telegram notification failed:", err);
  }
}
