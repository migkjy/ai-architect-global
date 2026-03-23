/**
 * Paddle Billing API 클라이언트
 *
 * Sandbox: sandbox-api.paddle.com
 * Live:    api.paddle.com
 *
 * 인증: Bearer token (PADDLE_API_KEY)
 * 웹훅 검증: PADDLE_WEBHOOK_SECRET (HMAC-SHA256)
 */

import crypto from "crypto";

export type PaddleEnvironment = "sandbox" | "production";

function getPaddleBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT ?? "sandbox";
  return env === "production"
    ? "https://api.paddle.com"
    : "https://sandbox-api.paddle.com";
}

function getPaddleApiKey(): string {
  return process.env.PADDLE_API_KEY ?? "";
}

// ─────────────────────────────────────────
// 체크아웃 생성 (POST /transactions)
// ─────────────────────────────────────────

export interface PaddleCheckoutItem {
  priceId: string;    // PADDLE_PRICE_ID_xxx
  quantity: number;
}

export interface PaddleCreateTransactionOptions {
  items: PaddleCheckoutItem[];
  customData?: Record<string, string>;
  successUrl?: string;
}

export interface PaddleTransaction {
  id: string;
  status: string;
  checkout: {
    url: string;
  } | null;
}

export async function createPaddleTransaction(
  options: PaddleCreateTransactionOptions
): Promise<PaddleTransaction> {
  const apiKey = getPaddleApiKey();
  if (!apiKey) {
    throw new Error("PADDLE_API_KEY not configured");
  }

  const siteUrl =
    (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com").trim();

  const body: Record<string, unknown> = {
    items: options.items.map((item) => ({
      price_id: item.priceId,
      quantity: item.quantity,
    })),
    collection_mode: "automatic",
    custom_data: options.customData ?? {},
  };

  if (options.successUrl) {
    body.checkout = { url: options.successUrl };
  } else {
    body.checkout = { url: `${siteUrl}/thank-you` };
  }

  const res = await fetch(`${getPaddleBaseUrl()}/transactions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Paddle API error: ${res.status} ${errText}`);
  }

  const data = await res.json();
  return data.data as PaddleTransaction;
}

// ─────────────────────────────────────────
// 웹훅 시그니처 검증
// Paddle 웹훅: Paddle-Signature 헤더 사용
// 형식: ts=<timestamp>;h1=<hmac>
// ─────────────────────────────────────────

export function verifyPaddleWebhook(
  rawBody: string,
  signatureHeader: string,
  secret: string
): boolean {
  try {
    // 헤더 파싱: "ts=1234567890;h1=abc..."
    const parts = signatureHeader.split(";");
    const tsPart = parts.find((p) => p.startsWith("ts="));
    const h1Part = parts.find((p) => p.startsWith("h1="));

    if (!tsPart || !h1Part) return false;

    const timestamp = tsPart.slice(3);
    const signature = h1Part.slice(3);

    // HMAC-SHA256: "{timestamp}:{rawBody}"
    const signedPayload = `${timestamp}:${rawBody}`;
    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(signedPayload).digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(digest, "hex")
    );
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────
// 상품 ID → Paddle Price ID 매핑
// 환경변수: PADDLE_PRICE_ID_{PRODUCT_KEY}
// 예: PADDLE_PRICE_ID_BUNDLE, PADDLE_PRICE_ID_VOL1, ...
// ─────────────────────────────────────────

export function getPaddlePriceId(productKey: string): string | undefined {
  return process.env[`PADDLE_PRICE_ID_${productKey}`] as string | undefined;
}

// ─────────────────────────────────────────
// Paddle.js Checkout (클라이언트 사이드)
// Paddle.Checkout.open() 호출에 필요한 설정
// ─────────────────────────────────────────

export interface PaddleCheckoutConfig {
  priceId: string;
  quantity?: number;
  successUrl?: string;
  customData?: Record<string, string>;
}
