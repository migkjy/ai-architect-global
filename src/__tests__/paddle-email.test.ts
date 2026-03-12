/**
 * Tests for email utilities used in Paddle payment flow
 *
 * Covers:
 * - buildConfirmationEmailHtml: content correctness, amount formatting
 * - sendPurchaseConfirmationEmail: missing BREVO_API_KEY, missing email, success, API error
 * - sendPaymentFailureEmail: missing BREVO_API_KEY, success
 * - generateDownloadToken: format, uniqueness
 *
 * All Brevo API calls are mocked — no real HTTP requests made.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Order } from "@/lib/orders";
import {
  buildConfirmationEmailHtml,
  sendPurchaseConfirmationEmail,
  sendPaymentFailureEmail,
} from "@/lib/email";
import { generateDownloadToken } from "@/lib/orders";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: "ord_test_001",
    paddleTransactionId: "txn_test_001",
    customerEmail: "buyer@example.com",
    customerName: "Test Buyer",
    productId: "pro_vol1",
    productName: "AI Marketing Architect",
    variantId: "pri_vol1",
    amount: 1700,       // cents → $17.00
    currency: "USD",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function mockBrevoSuccess() {
  return vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
    new Response(JSON.stringify({ messageId: "<brevo-msg-abc@smtp.brevo.com>" }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  );
}

function mockBrevoError(status: number, body: string) {
  return vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
    new Response(body, { status })
  );
}

// ─── buildConfirmationEmailHtml ───────────────────────────────────────────────

describe("buildConfirmationEmailHtml", () => {
  it("should include the product name", () => {
    const html = buildConfirmationEmailHtml(makeOrder(), "txn_test_001", "https://site.com");
    expect(html).toContain("AI Marketing Architect");
  });

  it("should include the transaction ID", () => {
    const html = buildConfirmationEmailHtml(makeOrder(), "txn_test_001", "https://site.com");
    expect(html).toContain("txn_test_001");
  });

  it("should include customer name in greeting", () => {
    const html = buildConfirmationEmailHtml(makeOrder({ customerName: "Alice" }), "txn", "https://site.com");
    expect(html).toContain("Alice");
  });

  it("should use 'there' when customer name is empty", () => {
    const html = buildConfirmationEmailHtml(makeOrder({ customerName: "" }), "txn", "https://site.com");
    expect(html).toContain("Hi there");
  });

  it("should format amounts >= 100 as dollars with cents (cents input)", () => {
    // amount=1700 → $17.00
    const html = buildConfirmationEmailHtml(makeOrder({ amount: 1700 }), "txn", "https://site.com");
    expect(html).toContain("$17.00");
  });

  it("should format amounts < 100 as dollars directly (dollar input)", () => {
    // amount=47 → interpreted as $47 (not cents)
    const html = buildConfirmationEmailHtml(makeOrder({ amount: 47 }), "txn", "https://site.com");
    expect(html).toContain("$47.00");
  });

  it("should include currency code in display", () => {
    const html = buildConfirmationEmailHtml(makeOrder({ currency: "USD" }), "txn", "https://site.com");
    expect(html).toContain("USD");
  });

  it("should include the thank-you page link", () => {
    const html = buildConfirmationEmailHtml(makeOrder(), "txn", "https://site.example.com");
    expect(html).toContain("https://site.example.com/thank-you");
  });

  it("should contain a link to Paddle customer portal", () => {
    const html = buildConfirmationEmailHtml(makeOrder(), "txn", "https://site.com");
    expect(html).toContain("customer.paddle.com");
  });

  it("should be valid HTML (contain doctype and body tags)", () => {
    const html = buildConfirmationEmailHtml(makeOrder(), "txn", "https://site.com");
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<body");
    expect(html).toContain("</body>");
  });
});

// ─── sendPurchaseConfirmationEmail ────────────────────────────────────────────

describe("sendPurchaseConfirmationEmail", () => {
  beforeEach(() => {
    vi.stubEnv("BREVO_API_KEY", "test-brevo-api-key");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://test.example.com");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("should return failure result when BREVO_API_KEY is not set", async () => {
    vi.stubEnv("BREVO_API_KEY", "");

    const result = await sendPurchaseConfirmationEmail(makeOrder(), "txn_001");

    expect(result.success).toBe(false);
    expect(result.error).toContain("BREVO_API_KEY");
  });

  it("should return failure result when customerEmail is empty", async () => {
    const result = await sendPurchaseConfirmationEmail(
      makeOrder({ customerEmail: "" }),
      "txn_001"
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain("email");
  });

  it("should call Brevo API with correct endpoint", async () => {
    const fetchSpy = mockBrevoSuccess();

    await sendPurchaseConfirmationEmail(makeOrder(), "txn_001");

    expect(fetchSpy).toHaveBeenCalledWith(
      "https://api.brevo.com/v3/smtp/email",
      expect.any(Object)
    );
  });

  it("should send api-key header with BREVO_API_KEY value", async () => {
    const fetchSpy = mockBrevoSuccess();

    await sendPurchaseConfirmationEmail(makeOrder(), "txn_001");

    const requestInit = fetchSpy.mock.calls[0][1] as RequestInit;
    const headers = requestInit.headers as Record<string, string>;
    expect(headers["api-key"]).toBe("test-brevo-api-key");
  });

  it("should address email to the customer's address", async () => {
    const fetchSpy = mockBrevoSuccess();

    await sendPurchaseConfirmationEmail(makeOrder({ customerEmail: "alice@test.com" }), "txn_001");

    const requestInit = fetchSpy.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(requestInit.body as string);
    expect(body.to[0].email).toBe("alice@test.com");
  });

  it("should include product name in email subject", async () => {
    const fetchSpy = mockBrevoSuccess();

    await sendPurchaseConfirmationEmail(
      makeOrder({ productName: "AI Bundle Complete" }),
      "txn_001"
    );

    const requestInit = fetchSpy.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(requestInit.body as string);
    expect(body.subject).toContain("AI Bundle Complete");
  });

  it("should return success with messageId when Brevo responds 201", async () => {
    mockBrevoSuccess();

    const result = await sendPurchaseConfirmationEmail(makeOrder(), "txn_001");

    expect(result.success).toBe(true);
    expect(result.messageId).toBeDefined();
  });

  it("should return failure result when Brevo returns non-2xx", async () => {
    mockBrevoError(429, "Too Many Requests");

    const result = await sendPurchaseConfirmationEmail(makeOrder(), "txn_001");

    expect(result.success).toBe(false);
    expect(result.error).toContain("Brevo API error: 429");
  });
});

// ─── sendPaymentFailureEmail ──────────────────────────────────────────────────

describe("sendPaymentFailureEmail", () => {
  beforeEach(() => {
    vi.stubEnv("BREVO_API_KEY", "test-brevo-api-key");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://test.example.com");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("should return failure when BREVO_API_KEY is not set", async () => {
    vi.stubEnv("BREVO_API_KEY", "");

    const result = await sendPaymentFailureEmail("buyer@test.com", "Test Buyer", "AI Bundle");

    expect(result.success).toBe(false);
    expect(result.error).toContain("BREVO_API_KEY");
  });

  it("should return failure when customerEmail is empty", async () => {
    const result = await sendPaymentFailureEmail("", "Test", "AI Bundle");

    expect(result.success).toBe(false);
    expect(result.error).toContain("email");
  });

  it("should call Brevo API and return success on 2xx", async () => {
    mockBrevoSuccess();

    const result = await sendPaymentFailureEmail("buyer@test.com", "Test Buyer", "AI Bundle");

    expect(result.success).toBe(true);
  });

  it("should include product name in subject line for failure email", async () => {
    const fetchSpy = mockBrevoSuccess();

    await sendPaymentFailureEmail("buyer@test.com", "Test Buyer", "AI Marketing Architect");

    const requestInit = fetchSpy.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(requestInit.body as string);
    expect(body.subject).toContain("AI Marketing Architect");
  });

  it("should return failure result when Brevo returns error", async () => {
    mockBrevoError(500, "Internal Server Error");

    const result = await sendPaymentFailureEmail("buyer@test.com", "Test", "Product");

    expect(result.success).toBe(false);
    expect(result.error).toContain("Brevo API error: 500");
  });
});

// ─── generateDownloadToken (orders lib) ───────────────────────────────────────

describe("generateDownloadToken", () => {
  it("should return a 64-character hex string", () => {
    const token = generateDownloadToken();
    expect(token).toMatch(/^[a-f0-9]{64}$/);
  });

  it("should return a different token on each call", () => {
    const tokens = new Set(Array.from({ length: 10 }, () => generateDownloadToken()));
    expect(tokens.size).toBe(10);
  });

  it("should be URL-safe (no special characters)", () => {
    const token = generateDownloadToken();
    // hex chars only — safe in URL paths/query params without encoding
    expect(token).not.toMatch(/[^a-f0-9]/);
  });
});
