import { NextResponse } from "next/server";
import { verifyPaddleWebhook } from "@/lib/paddle";
import type { Order } from "@/lib/orders";
import { sendPurchaseConfirmationEmail } from "@/lib/email";
import {
  generateDownloadToken,
  getAllDownloadLinks,
  detectProductType,
} from "@/lib/download";
import { markRefunded } from "@/lib/refund-guard";
import crypto from "crypto";

// Simple in-memory dedup for serverless (best-effort)
// Prevents duplicate processing when Paddle retries webhooks
const processedTransactions = new Set<string>();
const MAX_PROCESSED = 1000;

/**
 * GET handler — simple health check for the webhook endpoint.
 * Returns 200 so we can verify the route is reachable.
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "/api/webhooks/paddle",
    method: "POST required",
    timestamp: new Date().toISOString(),
  });
}

/**
 * Paddle Webhook Handler
 *
 * Handled events:
 * - transaction.completed  → save order + send confirmation email + CEO Telegram
 * - transaction.payment_failed → log + Telegram alert
 * - transaction.refunded   → update order status + Telegram alert
 *
 * Verification: Paddle-Signature header (HMAC-SHA256)
 * Ref: https://developer.paddle.com/webhooks/overview
 */
export async function POST(request: Request) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[paddle-webhook] PADDLE_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json(
      { error: "Could not read request body" },
      { status: 400 }
    );
  }

  const signatureHeader = request.headers.get("Paddle-Signature") ?? "";

  if (!verifyPaddleWebhook(rawBody, signatureHeader, secret)) {
    console.error("[paddle-webhook] Invalid signature");
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 401 }
    );
  }

  // Parse JSON — return 400 for malformed payloads
  let event: Record<string, unknown>;
  try {
    event = JSON.parse(rawBody);
  } catch {
    console.error("[paddle-webhook] Invalid JSON payload");
    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400 }
    );
  }

  const eventType: string =
    typeof event.event_type === "string" ? event.event_type : "";

  if (!eventType) {
    console.warn("[paddle-webhook] Missing event_type in payload");
    return NextResponse.json(
      { error: "Missing event_type" },
      { status: 400 }
    );
  }

  // ─── transaction.completed ───
  if (eventType === "transaction.completed") {
    return handleTransactionCompleted(event);
  }

  // ─── transaction.payment_failed ───
  if (eventType === "transaction.payment_failed") {
    return handleTransactionPaymentFailed(event);
  }

  // ─── transaction.refunded ───
  if (eventType === "transaction.refunded") {
    return handleTransactionRefunded(event);
  }

  // Unknown events — acknowledge to prevent Paddle retries
  console.log(`[paddle-webhook] Unhandled event type: ${eventType}`);
  return NextResponse.json({ received: true });
}

// ─────────────────────────────────────────
// Event Handlers
// ─────────────────────────────────────────

async function handleTransactionCompleted(
  event: Record<string, unknown>
): Promise<NextResponse> {
  const tx = (event.data ?? {}) as Record<string, unknown>;
  const txId: string = (tx.id as string) ?? "";

  // Idempotency: skip if already processed
  if (txId && processedTransactions.has(txId)) {
    console.log(`[paddle-webhook] Duplicate transaction ${txId}, skipping`);
    return NextResponse.json({ received: true, duplicate: true });
  }
  if (txId) {
    processedTransactions.add(txId);
    if (processedTransactions.size > MAX_PROCESSED) {
      const first = processedTransactions.values().next().value;
      if (first) processedTransactions.delete(first);
    }
  }

  const order = extractOrder(tx, txId);

  // ── Enrich missing customer/product data via Paddle API ──
  // PayPal payments often have billing_details=null and customer={}
  // so we fall back to the Paddle Transactions API with ?include=customer
  if (!order.customerEmail || !order.productName || order.productName === "AI Native Playbook") {
    console.log(
      `[paddle-webhook] Enrichment needed: txn=${txId}, email="${order.customerEmail || "(empty)"}", product="${order.productName || "(empty)"}". Calling Paddle API...`
    );
    const enriched = await fetchPaddleTransactionDetails(txId);
    if (enriched) {
      console.log(
        `[paddle-webhook] Paddle API enrichment result: email="${enriched.customerEmail || "(empty)"}", name="${enriched.customerName || "(empty)"}", product="${enriched.productName || "(empty)"}"`
      );
      if (!order.customerEmail && enriched.customerEmail) {
        order.customerEmail = enriched.customerEmail;
        console.log(`[paddle-webhook] Enriched email from API: ${enriched.customerEmail}`);
      }
      if (!order.customerName && enriched.customerName) {
        order.customerName = enriched.customerName;
        console.log(`[paddle-webhook] Enriched name from API: ${enriched.customerName}`);
      }
      if (enriched.productName && order.productName === "AI Native Playbook") {
        order.productName = enriched.productName;
        console.log(`[paddle-webhook] Enriched product from API: ${enriched.productName}`);
      }
    } else {
      console.warn(
        `[paddle-webhook] Paddle API enrichment returned null for txn=${txId}. Customer email may still be empty.`
      );
    }
  }

  // Generate download token and links
  const downloadToken = generateDownloadToken(txId);
  const siteUrl =
    (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com").trim();
  const productType = detectProductType(order.productName);
  const downloadLinks = getAllDownloadLinks(txId, downloadToken, productType, siteUrl);

  console.log(
    `[paddle-webhook] transaction.completed: txn=${txId}, email=${order.customerEmail}, product=${order.productName}, amount=${order.amount}, links=${Object.keys(downloadLinks).length}`
  );

  // Send confirmation email with download links
  let emailResult: { success: boolean; error?: string; messageId?: string } = {
    success: false,
    error: "not attempted",
  };
  console.log(
    `[paddle-webhook] Sending confirmation email via Resend: txn=${txId}, to="${order.customerEmail || "(empty)"}", sender=noreply@apppro.kr, downloadLinks=${Object.keys(downloadLinks).join(",")}`
  );
  try {
    emailResult = await sendPurchaseConfirmationEmail(order, txId, downloadLinks);
    if (!emailResult.success) {
      console.error(
        `[paddle-webhook] Email send failed: txn=${txId}, error="${emailResult.error}"`
      );
    } else {
      console.log(
        `[paddle-webhook] Email sent successfully: txn=${txId}, messageId=${emailResult.messageId}`
      );
    }
  } catch (emailErr) {
    console.error("[paddle-webhook] Email send threw exception:", emailErr);
    emailResult = {
      success: false,
      error: emailErr instanceof Error ? emailErr.message : String(emailErr),
    };
  }

  // Notify CEO via Telegram
  await notifyTelegram([
    `New Purchase!`,
    `Product: ${order.productName}`,
    `Amount: $${(order.amount / 100).toFixed(2)} ${order.currency}`,
    `Customer: ${order.customerEmail}`,
    `Transaction: ${txId}`,
    `Email: ${emailResult.success ? "Sent" : `FAILED - ${emailResult.error}`}`,
  ]);

  return NextResponse.json({
    received: true,
    orderId: order.id,
    status: "completed",
  });
}

async function handleTransactionPaymentFailed(
  event: Record<string, unknown>
): Promise<NextResponse> {
  const tx = (event.data ?? {}) as Record<string, unknown>;
  const txId = (tx.id as string) ?? "unknown";
  const customerId = (tx.customer_id as string) ?? "unknown";

  console.warn(
    `[paddle-webhook] Payment failed: txn=${txId}, customer=${customerId}`
  );

  // Extract customer info for notification
  const customerEmail = extractCustomerEmail(tx);
  const productName = extractProductName(tx);

  await notifyTelegram([
    `Payment Failed`,
    `Transaction: ${txId}`,
    `Customer: ${customerEmail || customerId}`,
    `Product: ${productName}`,
  ]);

  return NextResponse.json({ received: true, status: "payment_failed" });
}

async function handleTransactionRefunded(
  event: Record<string, unknown>
): Promise<NextResponse> {
  const tx = (event.data ?? {}) as Record<string, unknown>;
  const txId = (tx.id as string) ?? "unknown";

  const order = extractOrder(tx, txId);

  console.warn(
    `[paddle-webhook] Refund processed: txn=${txId}, product=${order.productName}, amount=$${(order.amount / 100).toFixed(2)}`
  );

  // Persist refund status to block future downloads
  try {
    await markRefunded({
      transactionId: txId,
      customerEmail: order.customerEmail,
      productName: order.productName,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    // Non-fatal: log and continue so webhook still returns 200
    console.error("[paddle-webhook] markRefunded failed:", err);
  }

  await notifyTelegram([
    `Refund Processed`,
    `Transaction: ${txId}`,
    `Product: ${order.productName}`,
    `Amount: $${(order.amount / 100).toFixed(2)} ${order.currency}`,
    `Customer: ${order.customerEmail}`,
  ]);

  return NextResponse.json({
    received: true,
    status: "refunded",
    transactionId: txId,
  });
}

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────

/**
 * Extract order details from Paddle transaction data.
 * Handles multiple Paddle API response shapes gracefully.
 */
function extractOrder(
  tx: Record<string, unknown>,
  txId: string
): Order {
  const customerEmail = extractCustomerEmail(tx);
  const customerName = extractCustomerName(tx);
  const productName = extractProductName(tx);

  const firstItem =
    getNestedArray(tx, "items")?.[0] ??
    getNestedArray(tx, "details.line_items")?.[0];
  const productId: string =
    (firstItem as Record<string, unknown>)?.product &&
    typeof ((firstItem as Record<string, unknown>).product as Record<string, unknown>)?.id === "string"
      ? (((firstItem as Record<string, unknown>).product as Record<string, unknown>).id as string)
      : "";
  const priceId: string =
    (firstItem as Record<string, unknown>)?.price &&
    typeof ((firstItem as Record<string, unknown>).price as Record<string, unknown>)?.id === "string"
      ? (((firstItem as Record<string, unknown>).price as Record<string, unknown>).id as string)
      : "";

  // Amount: Paddle sends as string in cents
  const totals = getNestedValue(tx, "details.totals") as Record<string, unknown> | undefined;
  const rawTotal = totals?.grand_total;
  const amount: number =
    typeof rawTotal === "string"
      ? parseInt(rawTotal, 10)
      : typeof rawTotal === "number"
        ? rawTotal
        : 0;
  const currency: string = (tx.currency_code as string) ?? "USD";

  return {
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
}

function extractCustomerEmail(tx: Record<string, unknown>): string {
  // Paddle Billing V2 sends customer email in multiple possible locations:
  // - billing_details.email (card payments)
  // - customer.email (PayPal and other methods where billing_details may be null)
  // - checkout.customer_email (overlay checkout)
  // - address.email (some regions)
  const email =
    getNestedString(tx, "billing_details.email") ??
    getNestedString(tx, "customer.email") ??
    getNestedString(tx, "details.billing_details.email") ??
    getNestedString(tx, "checkout.customer_email") ??
    getNestedString(tx, "customer_email") ??
    "";

  if (!email) {
    console.warn(
      `[paddle-webhook] Could not extract customer email. Available keys: ${Object.keys(tx).join(", ")}. ` +
      `billing_details=${JSON.stringify(tx.billing_details)}, customer=${JSON.stringify(tx.customer)}, ` +
      `checkout=${JSON.stringify(tx.checkout)}, customer_email=${JSON.stringify(tx.customer_email)}`
    );
  } else {
    console.log(`[paddle-webhook] Customer email extracted: "${email}"`);
  }
  return email;
}

function extractCustomerName(tx: Record<string, unknown>): string {
  return (
    getNestedString(tx, "billing_details.name") ??
    getNestedString(tx, "customer.name") ??
    [
      getNestedString(tx, "details.billing_details.first_name") ?? "",
      getNestedString(tx, "details.billing_details.last_name") ?? "",
    ]
      .join(" ")
      .trim()
  );
}

function extractProductName(tx: Record<string, unknown>): string {
  const firstItem =
    getNestedArray(tx, "items")?.[0] ??
    getNestedArray(tx, "details.line_items")?.[0];
  if (!firstItem) return "AI Native Playbook";

  const item = firstItem as Record<string, unknown>;
  return (
    getNestedString(item, "product.name") ??
    getNestedString(item, "price.description") ??
    "AI Native Playbook"
  );
}

/** Safely get a nested string value using dot-notation path */
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

/** Safely get a nested value */
function getNestedValue(
  obj: Record<string, unknown>,
  path: string
): unknown {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

/** Safely get a nested array */
function getNestedArray(
  obj: Record<string, unknown>,
  path: string
): unknown[] | undefined {
  const val = getNestedValue(obj, path);
  return Array.isArray(val) ? val : undefined;
}

/**
 * Fetch transaction details from Paddle API to enrich missing data.
 * Used when webhook payload lacks customer email or product name
 * (common with PayPal payments where billing_details is null).
 *
 * Uses GET /transactions/{txId}?include=customer to retrieve
 * customer email and product info in a single API call.
 */
interface PaddleEnrichedData {
  customerEmail: string;
  customerName: string;
  productName: string;
}

async function fetchPaddleTransactionDetails(
  txId: string
): Promise<PaddleEnrichedData | null> {
  const paddleApiKey = process.env.PADDLE_API_KEY;
  if (!paddleApiKey || !txId) return null;

  const env = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT ?? "sandbox";
  const baseUrl =
    env === "production"
      ? "https://api.paddle.com"
      : "https://sandbox-api.paddle.com";

  try {
    const res = await fetch(
      `${baseUrl}/transactions/${txId}?include=customer`,
      {
        headers: { Authorization: `Bearer ${paddleApiKey}` },
      }
    );

    if (!res.ok) {
      console.error(
        `[paddle-webhook] Paddle API lookup failed: ${res.status} ${res.statusText}`
      );
      return null;
    }

    const json = await res.json();
    const data = json.data as Record<string, unknown> | undefined;
    if (!data) return null;

    // Extract customer email from included customer object
    const customer = data.customer as Record<string, unknown> | undefined;
    const customerEmail =
      typeof customer?.email === "string" ? customer.email : "";
    const customerName =
      typeof customer?.name === "string" ? customer.name : "";

    // Extract product name from items[0].product.name
    const items = Array.isArray(data.items) ? data.items : [];
    const firstItem = items[0] as Record<string, unknown> | undefined;
    const product = firstItem?.product as Record<string, unknown> | undefined;
    const productName =
      typeof product?.name === "string" ? product.name : "";

    console.log(
      `[paddle-webhook] API enrichment: email=${customerEmail}, product=${productName}`
    );

    return { customerEmail, customerName, productName };
  } catch (err) {
    console.error("[paddle-webhook] Paddle API lookup exception:", err);
    return null;
  }
}

/**
 * Send Telegram notification to CEO.
 * Fails silently — webhook processing continues regardless.
 */
async function notifyTelegram(lines: string[]): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) {
    console.warn(
      `[paddle-webhook] Telegram notification skipped: ${!botToken ? "TELEGRAM_BOT_TOKEN" : ""} ${!chatId ? "TELEGRAM_CHAT_ID" : ""} not configured in environment variables`
    );
    return;
  }

  const message = lines.join("\n");

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
