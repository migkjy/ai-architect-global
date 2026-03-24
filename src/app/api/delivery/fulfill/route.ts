/**
 * Manual Delivery Fulfillment API
 *
 * POST /api/delivery/fulfill
 * Body: { transactionId: string }
 * Auth: Bearer PADDLE_API_KEY (server-side only)
 *
 * Looks up a Paddle transaction by ID, extracts customer info,
 * generates download links, and sends the confirmation email.
 *
 * Use case: When webhook fails and customer doesn't receive their download.
 */

import { NextRequest, NextResponse } from "next/server";
import { sendPurchaseConfirmationEmail } from "@/lib/email";
import {
  generateDownloadToken,
  getAllDownloadLinks,
  detectProductType,
} from "@/lib/download";
import type { Order } from "@/lib/orders";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  // Auth: require PADDLE_API_KEY as Bearer token
  const authHeader = request.headers.get("authorization") ?? "";
  const expectedKey = process.env.PADDLE_API_KEY;

  if (!expectedKey) {
    return NextResponse.json(
      { error: "PADDLE_API_KEY not configured" },
      { status: 500 }
    );
  }

  const providedToken = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!providedToken || providedToken !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { transactionId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const transactionId = body.transactionId;
  if (!transactionId) {
    return NextResponse.json(
      { error: "transactionId is required" },
      { status: 400 }
    );
  }

  // Look up transaction from Paddle API
  const paddleEnv = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT ?? "sandbox";
  const paddleBaseUrl =
    paddleEnv === "production"
      ? "https://api.paddle.com"
      : "https://sandbox-api.paddle.com";

  let txData: Record<string, unknown>;
  try {
    const res = await fetch(
      `${paddleBaseUrl}/transactions/${transactionId}?include=customer`,
      {
        headers: {
          Authorization: `Bearer ${expectedKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `Paddle API error: ${res.status} ${errText}` },
        { status: res.status }
      );
    }

    const json = await res.json();
    txData = (json.data ?? json) as Record<string, unknown>;
  } catch (err) {
    return NextResponse.json(
      {
        error: `Failed to fetch transaction: ${err instanceof Error ? err.message : String(err)}`,
      },
      { status: 502 }
    );
  }

  // Extract customer email from transaction data
  const customerEmail = extractEmail(txData);
  if (!customerEmail) {
    return NextResponse.json(
      {
        error: "Could not extract customer email from transaction",
        transactionKeys: Object.keys(txData),
        billingDetails: txData.billing_details ?? null,
        customer: txData.customer ?? null,
      },
      { status: 422 }
    );
  }

  // Extract product info
  const productName = extractProductName(txData);
  const productType = detectProductType(productName);

  // Build order
  const order: Order = {
    id: crypto.randomUUID(),
    paddleTransactionId: transactionId,
    customerEmail,
    customerName: extractName(txData),
    productId: "",
    productName,
    variantId: "",
    amount: extractAmount(txData),
    currency: (txData.currency_code as string) ?? "USD",
    createdAt: new Date().toISOString(),
  };

  // Generate download links
  const downloadToken = generateDownloadToken(transactionId);
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com"
  ).trim();
  const downloadLinks = getAllDownloadLinks(
    transactionId,
    downloadToken,
    productType,
    siteUrl
  );

  // Send email (with retry — max 3 attempts)
  const emailResult = await sendPurchaseConfirmationEmail(
    order,
    transactionId,
    downloadLinks,
    { maxRetries: 3 }
  );

  console.log(
    `[delivery/fulfill] Manual fulfillment: txn=${transactionId}, email=${customerEmail}, product=${productName}, emailSuccess=${emailResult.success}`
  );

  // Notify CEO via Telegram about manual fulfillment result
  await notifyTelegramFulfillment(
    transactionId,
    customerEmail,
    productName,
    emailResult.success,
    emailResult.error
  );

  return NextResponse.json({
    success: emailResult.success,
    transactionId,
    customerEmail,
    productName,
    productType,
    downloadLinksCount: Object.keys(downloadLinks).length,
    emailResult,
    thankYouUrl: `${siteUrl}/thank-you?token=${downloadToken}&type=${productType}&product=${encodeURIComponent(productName)}`,
  });
}

/**
 * Notify CEO via Telegram about manual fulfillment result.
 * Fails silently — fulfillment response is returned regardless.
 */
async function notifyTelegramFulfillment(
  transactionId: string,
  customerEmail: string,
  productName: string,
  emailSuccess: boolean,
  emailError?: string
): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;

  const lines = [
    `🔧 Manual Fulfillment ${emailSuccess ? "✅" : "❌"}`,
    `Transaction: ${transactionId}`,
    `Customer: ${customerEmail}`,
    `Product: ${productName}`,
    emailSuccess
      ? `Email: ✅ Sent successfully`
      : `Email: ❌ FAILED - ${emailError}`,
  ];

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: lines.join("\n") }),
    });
  } catch (err) {
    console.error("[delivery/fulfill] Telegram notification failed:", err);
  }
}

// ─── Helpers ───

function getNestedString(
  obj: Record<string, unknown>,
  path: string
): string | undefined {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : undefined;
}

function extractEmail(tx: Record<string, unknown>): string {
  return (
    getNestedString(tx, "billing_details.email") ??
    getNestedString(tx, "customer.email") ??
    getNestedString(tx, "details.billing_details.email") ??
    getNestedString(tx, "checkout.customer_email") ??
    getNestedString(tx, "customer_email") ??
    ""
  );
}

function extractName(tx: Record<string, unknown>): string {
  return (
    getNestedString(tx, "billing_details.name") ??
    getNestedString(tx, "customer.name") ??
    ""
  );
}

function extractProductName(tx: Record<string, unknown>): string {
  const items = tx.items;
  if (Array.isArray(items) && items.length > 0) {
    const item = items[0] as Record<string, unknown>;
    return (
      getNestedString(item, "product.name") ??
      getNestedString(item, "price.description") ??
      "AI Native Playbook"
    );
  }
  return "AI Native Playbook";
}

function extractAmount(tx: Record<string, unknown>): number {
  const details = tx.details as Record<string, unknown> | undefined;
  const totals = details?.totals as Record<string, unknown> | undefined;
  const rawTotal = totals?.grand_total;
  if (typeof rawTotal === "string") return parseInt(rawTotal, 10);
  if (typeof rawTotal === "number") return rawTotal;
  return 0;
}
