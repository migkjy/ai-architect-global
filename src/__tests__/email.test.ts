/**
 * Email utility tests (src/lib/email.ts)
 *
 * Tests cover:
 * - sendPurchaseConfirmationEmail
 * - sendPaymentFailureEmail
 * - buildConfirmationEmailHtml
 * - Missing env vars / empty email
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// We need to mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

import {
  sendPurchaseConfirmationEmail,
  sendPaymentFailureEmail,
  buildConfirmationEmailHtml,
} from "@/lib/email";

import type { Order } from "@/lib/orders";

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: "ord_001",
    paddleTransactionId: "txn_001",
    customerEmail: "buyer@example.com",
    customerName: "Test Buyer",
    productId: "pro_vol1",
    productName: "AI Native Playbook Vol.1",
    variantId: "pri_vol1",
    amount: 2900,
    currency: "USD",
    createdAt: "2026-03-10T00:00:00Z",
    ...overrides,
  };
}

describe("Email Utilities", () => {
  beforeEach(() => {
    vi.stubEnv("BREVO_API_KEY", "test-brevo-key");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://test.example.com");
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // ─── sendPurchaseConfirmationEmail ───

  describe("sendPurchaseConfirmationEmail", () => {
    it("should send email via Brevo API and return success", async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ messageId: "msg-abc" }), { status: 201 })
      );

      const result = await sendPurchaseConfirmationEmail(makeOrder(), "txn_001");

      expect(result.success).toBe(true);
      expect(result.messageId).toBe("msg-abc");
      expect(mockFetch).toHaveBeenCalledTimes(1);

      const call = mockFetch.mock.calls[0];
      expect(call[0]).toBe("https://api.brevo.com/v3/smtp/email");
      const body = JSON.parse(call[1].body);
      expect(body.to[0].email).toBe("buyer@example.com");
      expect(body.subject).toContain("AI Native Playbook Vol.1");
    });

    it("should return error when BREVO_API_KEY is not set", async () => {
      vi.stubEnv("BREVO_API_KEY", "");

      const result = await sendPurchaseConfirmationEmail(makeOrder(), "txn_001");

      expect(result.success).toBe(false);
      expect(result.error).toContain("BREVO_API_KEY");
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should return error when customer email is empty", async () => {
      const result = await sendPurchaseConfirmationEmail(
        makeOrder({ customerEmail: "" }),
        "txn_001"
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("email is empty");
    });

    it("should handle Brevo API error gracefully", async () => {
      mockFetch.mockResolvedValueOnce(
        new Response("Rate limit exceeded", { status: 429 })
      );

      const result = await sendPurchaseConfirmationEmail(makeOrder(), "txn_001");

      expect(result.success).toBe(false);
      expect(result.error).toContain("429");
    });
  });

  // ─── sendPaymentFailureEmail ───

  describe("sendPaymentFailureEmail", () => {
    it("should send failure notification email", async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ messageId: "msg-fail" }), { status: 201 })
      );

      const result = await sendPaymentFailureEmail(
        "buyer@example.com",
        "Test Buyer",
        "AI Native Playbook Vol.1"
      );

      expect(result.success).toBe(true);
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.subject).toContain("Payment issue");
    });

    it("should return error when BREVO_API_KEY is not set", async () => {
      vi.stubEnv("BREVO_API_KEY", "");

      const result = await sendPaymentFailureEmail(
        "buyer@example.com",
        "Test Buyer",
        "Product"
      );

      expect(result.success).toBe(false);
    });

    it("should return error when email is empty", async () => {
      const result = await sendPaymentFailureEmail("", "Name", "Product");

      expect(result.success).toBe(false);
      expect(result.error).toContain("email is empty");
    });
  });

  // ─── buildConfirmationEmailHtml ───

  describe("buildConfirmationEmailHtml", () => {
    it("should include product name and transaction ID", () => {
      const html = buildConfirmationEmailHtml(
        makeOrder(),
        "txn_001",
        "https://example.com"
      );

      expect(html).toContain("AI Native Playbook Vol.1");
      expect(html).toContain("txn_001");
      expect(html).toContain("$29.00");
      expect(html).toContain("USD");
    });

    it("should use fallback greeting when name is empty", () => {
      const html = buildConfirmationEmailHtml(
        makeOrder({ customerName: "" }),
        "txn_001",
        "https://example.com"
      );

      expect(html).toContain("Hi there");
    });

    it("should include thank-you page link", () => {
      const html = buildConfirmationEmailHtml(
        makeOrder(),
        "txn_001",
        "https://mysite.com"
      );

      expect(html).toContain("https://mysite.com/thank-you");
    });
  });
});
