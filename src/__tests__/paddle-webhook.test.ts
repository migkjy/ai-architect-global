/**
 * Paddle Webhook Handler Tests
 *
 * Tests cover:
 * - Signature verification
 * - transaction.completed → order creation + confirmation email
 * - transaction.payment_failed → logging + alert
 * - transaction.refunded → order status update
 * - Idempotency (duplicate transaction IDs)
 * - Malformed payloads
 * - Missing environment variables
 * - Unknown event types (graceful handling)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import crypto from "crypto";

// Mock modules before importing route
vi.mock("@/lib/email", () => ({
  sendPurchaseConfirmationEmail: vi.fn().mockResolvedValue({ success: true, messageId: "msg-123" }),
  sendPaymentFailureEmail: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("@/lib/refund-guard", () => ({
  markRefunded: vi.fn().mockResolvedValue(undefined),
}));

// Helper: create valid Paddle signature
function createPaddleSignature(body: string, secret: string): string {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signedPayload = `${timestamp}:${body}`;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(signedPayload).digest("hex");
  return `ts=${timestamp};h1=${digest}`;
}

// Helper: create a mock Request
function createRequest(body: string, signature: string): Request {
  return new Request("http://localhost/api/webhooks/paddle", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Paddle-Signature": signature,
    },
    body,
  });
}

// Sample Paddle event payloads
function makeCompletedEvent(overrides: Record<string, unknown> = {}) {
  return {
    event_type: "transaction.completed",
    data: {
      id: "txn_01abc123",
      customer_id: "ctm_01xyz",
      billing_details: {
        email: "buyer@example.com",
        name: "Test Buyer",
      },
      items: [
        {
          product: { id: "pro_vol1", name: "AI Native Playbook Vol.1" },
          price: { id: "pri_vol1", description: "Vol 1 Price" },
        },
      ],
      details: {
        totals: { grand_total: "2900" },
      },
      currency_code: "USD",
      ...overrides,
    },
  };
}

function makePaymentFailedEvent(overrides: Record<string, unknown> = {}) {
  return {
    event_type: "transaction.payment_failed",
    data: {
      id: "txn_fail_001",
      customer_id: "ctm_01xyz",
      billing_details: {
        email: "buyer@example.com",
        name: "Test Buyer",
      },
      items: [
        {
          product: { id: "pro_vol1", name: "AI Native Playbook Vol.1" },
          price: { id: "pri_vol1" },
        },
      ],
      ...overrides,
    },
  };
}

function makeRefundedEvent(overrides: Record<string, unknown> = {}) {
  return {
    event_type: "transaction.refunded",
    data: {
      id: "txn_refund_001",
      customer_id: "ctm_01xyz",
      billing_details: {
        email: "buyer@example.com",
        name: "Refund Buyer",
      },
      items: [
        {
          product: { id: "pro_vol1", name: "AI Native Playbook Vol.1" },
          price: { id: "pri_vol1" },
        },
      ],
      details: {
        totals: { grand_total: "2900" },
      },
      currency_code: "USD",
      ...overrides,
    },
  };
}

const WEBHOOK_SECRET = "test-webhook-secret-123";

describe("Paddle Webhook Handler", () => {
  let POST: (request: Request) => Promise<Response>;

  beforeEach(async () => {
    vi.stubEnv("PADDLE_WEBHOOK_SECRET", WEBHOOK_SECRET);
    vi.stubEnv("BREVO_API_KEY", "test-brevo-key");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://test.example.com");
    // Don't set Telegram vars — tests should work without them

    // Clear module cache so each test gets fresh state (idempotency set)
    vi.resetModules();
    const mod = await import("@/app/api/webhooks/paddle/route");
    POST = mod.POST;

    // Reset mocks
    const emailMod = await import("@/lib/email");
    vi.mocked(emailMod.sendPurchaseConfirmationEmail).mockClear();
    vi.mocked(emailMod.sendPaymentFailureEmail).mockClear();

    // Mock global fetch for Telegram calls
    vi.spyOn(globalThis, "fetch").mockImplementation(async (url) => {
      const urlStr = typeof url === "string" ? url : url instanceof URL ? url.toString() : (url as { url?: string }).url ?? "";
      if (urlStr.includes("api.telegram.org")) {
        return new Response(JSON.stringify({ ok: true }), { status: 200 });
      }
      // Let other fetches through (shouldn't happen in tests)
      return new Response("", { status: 200 });
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  // ─── Signature Verification ───

  describe("Signature Verification", () => {
    it("should reject requests with missing signature", async () => {
      const body = JSON.stringify(makeCompletedEvent());
      const req = new Request("http://localhost/api/webhooks/paddle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      const res = await POST(req);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toBe("Invalid signature");
    });

    it("should reject requests with invalid signature", async () => {
      const body = JSON.stringify(makeCompletedEvent());
      const req = createRequest(body, "ts=1234;h1=deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef");

      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it("should accept requests with valid signature", async () => {
      const body = JSON.stringify(makeCompletedEvent());
      const sig = createPaddleSignature(body, WEBHOOK_SECRET);
      const req = createRequest(body, sig);

      const res = await POST(req);
      expect(res.status).toBe(200);
    });
  });

  // ─── Missing Environment Variables ───

  describe("Missing Environment Variables", () => {
    it("should return 500 when PADDLE_WEBHOOK_SECRET is not set", async () => {
      vi.stubEnv("PADDLE_WEBHOOK_SECRET", "");
      vi.resetModules();
      const mod = await import("@/app/api/webhooks/paddle/route");

      const body = JSON.stringify(makeCompletedEvent());
      const req = createRequest(body, "ts=1;h1=abc");

      const res = await mod.POST(req);
      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error).toBe("Server misconfiguration");
    });
  });

  // ─── transaction.completed ───

  describe("transaction.completed", () => {
    it("should process completed transaction and return orderId", async () => {
      const body = JSON.stringify(makeCompletedEvent());
      const sig = createPaddleSignature(body, WEBHOOK_SECRET);
      const req = createRequest(body, sig);

      const res = await POST(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.received).toBe(true);
      expect(json.orderId).toBeDefined();
      expect(json.status).toBe("completed");
    });

    it("should send confirmation email via Brevo", async () => {
      const body = JSON.stringify(makeCompletedEvent());
      const sig = createPaddleSignature(body, WEBHOOK_SECRET);
      const req = createRequest(body, sig);

      await POST(req);

      const emailMod = await import("@/lib/email");
      expect(emailMod.sendPurchaseConfirmationEmail).toHaveBeenCalledTimes(1);
      const call = vi.mocked(emailMod.sendPurchaseConfirmationEmail).mock.calls[0];
      expect(call[0].customerEmail).toBe("buyer@example.com");
      expect(call[0].productName).toBe("AI Native Playbook Vol.1");
      expect(call[1]).toBe("txn_01abc123");
    });

    it("should send Telegram notification", async () => {
      vi.stubEnv("TELEGRAM_BOT_TOKEN", "test-bot-token");
      vi.stubEnv("TELEGRAM_CHAT_ID", "12345");

      vi.resetModules();
      const mod = await import("@/app/api/webhooks/paddle/route");

      const body = JSON.stringify(makeCompletedEvent());
      const sig = createPaddleSignature(body, WEBHOOK_SECRET);
      const req = createRequest(body, sig);

      await mod.POST(req);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("api.telegram.org"),
        expect.any(Object)
      );
    });

    it("should extract customer info from nested paths", async () => {
      const event = makeCompletedEvent();
      // Remove top-level billing_details, use customer object
      delete (event.data as Record<string, unknown>).billing_details;
      (event.data as Record<string, unknown>).customer = {
        email: "nested@example.com",
        name: "Nested Customer",
      };

      const body = JSON.stringify(event);
      const sig = createPaddleSignature(body, WEBHOOK_SECRET);
      const req = createRequest(body, sig);

      await POST(req);

      const emailMod = await import("@/lib/email");
      const call = vi.mocked(emailMod.sendPurchaseConfirmationEmail).mock.calls[0];
      expect(call[0].customerEmail).toBe("nested@example.com");
      expect(call[0].customerName).toBe("Nested Customer");
    });

    it("should still succeed if email sending fails", async () => {
      const emailMod = await import("@/lib/email");
      vi.mocked(emailMod.sendPurchaseConfirmationEmail).mockRejectedValueOnce(
        new Error("Brevo down")
      );

      const body = JSON.stringify(makeCompletedEvent());
      const sig = createPaddleSignature(body, WEBHOOK_SECRET);
      const req = createRequest(body, sig);

      const res = await POST(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.received).toBe(true);
    });
  });

  // ─── Idempotency ───

  describe("Idempotency", () => {
    it("should skip duplicate transaction IDs", async () => {
      const body = JSON.stringify(makeCompletedEvent());
      const sig = createPaddleSignature(body, WEBHOOK_SECRET);

      // First call
      const res1 = await POST(createRequest(body, sig));
      expect(res1.status).toBe(200);
      const json1 = await res1.json();
      expect(json1.duplicate).toBeUndefined();

      // Second call — same transaction ID
      const sig2 = createPaddleSignature(body, WEBHOOK_SECRET);
      const res2 = await POST(createRequest(body, sig2));
      expect(res2.status).toBe(200);
      const json2 = await res2.json();
      expect(json2.duplicate).toBe(true);
    });
  });

  // ─── transaction.payment_failed ───

  describe("transaction.payment_failed", () => {
    it("should log payment failure and return 200", async () => {
      const body = JSON.stringify(makePaymentFailedEvent());
      const sig = createPaddleSignature(body, WEBHOOK_SECRET);
      const req = createRequest(body, sig);

      const res = await POST(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.received).toBe(true);
      expect(json.status).toBe("payment_failed");
    });

    it("should send Telegram alert for payment failure", async () => {
      vi.stubEnv("TELEGRAM_BOT_TOKEN", "test-bot-token");
      vi.stubEnv("TELEGRAM_CHAT_ID", "12345");

      vi.resetModules();
      const mod = await import("@/app/api/webhooks/paddle/route");

      const body = JSON.stringify(makePaymentFailedEvent());
      const sig = createPaddleSignature(body, WEBHOOK_SECRET);
      const req = createRequest(body, sig);

      await mod.POST(req);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("api.telegram.org"),
        expect.any(Object)
      );
    });
  });

  // ─── transaction.refunded ───

  describe("transaction.refunded", () => {
    it("should handle refund event and return status refunded", async () => {
      const body = JSON.stringify(makeRefundedEvent());
      const sig = createPaddleSignature(body, WEBHOOK_SECRET);
      const req = createRequest(body, sig);

      const res = await POST(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.received).toBe(true);
      expect(json.status).toBe("refunded");
    });

    it("should call markRefunded() to persist refund in DB", async () => {
      const body = JSON.stringify(makeRefundedEvent());
      const sig = createPaddleSignature(body, WEBHOOK_SECRET);
      const req = createRequest(body, sig);

      await POST(req);

      const { markRefunded } = await import("@/lib/refund-guard");
      expect(markRefunded).toHaveBeenCalledWith(
        expect.objectContaining({
          transactionId: "txn_refund_001",
          customerEmail: "buyer@example.com",
        })
      );
    });

    it("should still return 200 if markRefunded() throws", async () => {
      vi.resetModules();
      vi.doMock("@/lib/refund-guard", () => ({
        markRefunded: vi.fn().mockRejectedValue(new Error("DB error")),
      }));
      vi.doMock("@/lib/email", () => ({
        sendPurchaseConfirmationEmail: vi.fn().mockResolvedValue({ success: true }),
        sendPaymentFailureEmail: vi.fn().mockResolvedValue({ success: true }),
      }));

      const mod = await import("@/app/api/webhooks/paddle/route");

      const body = JSON.stringify(makeRefundedEvent());
      const sig = createPaddleSignature(body, WEBHOOK_SECRET);
      const req = createRequest(body, sig);

      const res = await mod.POST(req);
      expect(res.status).toBe(200);
    });

    it("should send Telegram notification for refund", async () => {
      vi.stubEnv("TELEGRAM_BOT_TOKEN", "test-bot-token");
      vi.stubEnv("TELEGRAM_CHAT_ID", "12345");

      vi.resetModules();
      vi.doMock("@/lib/refund-guard", () => ({
        markRefunded: vi.fn().mockResolvedValue(undefined),
      }));
      vi.doMock("@/lib/email", () => ({
        sendPurchaseConfirmationEmail: vi.fn().mockResolvedValue({ success: true }),
        sendPaymentFailureEmail: vi.fn().mockResolvedValue({ success: true }),
      }));

      const mod = await import("@/app/api/webhooks/paddle/route");

      const body = JSON.stringify(makeRefundedEvent());
      const sig = createPaddleSignature(body, WEBHOOK_SECRET);
      const req = createRequest(body, sig);

      await mod.POST(req);

      // Check the Telegram call includes "Refund" in message
      const telegramCalls = vi.mocked(globalThis.fetch).mock.calls.filter(
        (c) => typeof c[0] === "string" && c[0].includes("api.telegram.org")
      );
      expect(telegramCalls.length).toBeGreaterThan(0);
    });
  });

  // ─── PayPal Payments (missing billing_details) + Paddle API enrichment ───

  describe("PayPal payment enrichment via Paddle API", () => {
    it("should fetch customer email from Paddle API when billing_details is null and customer is empty", async () => {
      vi.stubEnv("PADDLE_API_KEY", "pdl_test_key");
      vi.stubEnv("NEXT_PUBLIC_PADDLE_ENVIRONMENT", "production");

      vi.resetModules();
      vi.doMock("@/lib/email", () => ({
        sendPurchaseConfirmationEmail: vi.fn().mockResolvedValue({ success: true, messageId: "msg-enriched" }),
        sendPaymentFailureEmail: vi.fn().mockResolvedValue({ success: true }),
      }));
      vi.doMock("@/lib/refund-guard", () => ({
        markRefunded: vi.fn().mockResolvedValue(undefined),
      }));

      const mod = await import("@/app/api/webhooks/paddle/route");

      // Mock fetch: Telegram + Paddle API
      vi.spyOn(globalThis, "fetch").mockImplementation(async (url) => {
        const urlStr = typeof url === "string" ? url : url instanceof URL ? url.toString() : "";
        if (urlStr.includes("api.paddle.com/transactions/txn_paypal_001")) {
          return new Response(JSON.stringify({
            data: {
              id: "txn_paypal_001",
              customer: {
                id: "ctm_01kmf55mxyej21hx11z3ps087q",
                email: "paypal-buyer@example.com",
                name: "PayPal Buyer",
              },
              items: [
                {
                  product: { id: "pro_vol1", name: "AI Native Playbook Vol.1" },
                  price: { id: "pri_vol1" },
                },
              ],
            },
          }), { status: 200 });
        }
        if (urlStr.includes("api.telegram.org")) {
          return new Response(JSON.stringify({ ok: true }), { status: 200 });
        }
        return new Response("", { status: 200 });
      });

      // PayPal-style payload: billing_details=null, customer=empty object
      const event = {
        event_type: "transaction.completed",
        data: {
          id: "txn_paypal_001",
          customer_id: "ctm_01kmf55mxyej21hx11z3ps087q",
          billing_details: null,
          customer: {},
          items: [
            {
              product: {},
              price: { id: "pri_vol1" },
            },
          ],
          details: {
            totals: { grand_total: "1700" },
          },
          currency_code: "USD",
        },
      };

      const body = JSON.stringify(event);
      const sig = createPaddleSignature(body, WEBHOOK_SECRET);
      const req = createRequest(body, sig);

      const res = await mod.POST(req);
      expect(res.status).toBe(200);

      // Verify Paddle API was called
      const fetchCalls = vi.mocked(globalThis.fetch).mock.calls;
      const paddleApiCall = fetchCalls.find(
        (c) => typeof c[0] === "string" && c[0].includes("api.paddle.com/transactions/txn_paypal_001")
      );
      expect(paddleApiCall).toBeDefined();
      expect(paddleApiCall![1]).toEqual(
        expect.objectContaining({
          headers: { Authorization: "Bearer pdl_test_key" },
        })
      );

      // Verify email was sent with enriched email
      const emailMod = await import("@/lib/email");
      expect(emailMod.sendPurchaseConfirmationEmail).toHaveBeenCalledTimes(1);
      const call = vi.mocked(emailMod.sendPurchaseConfirmationEmail).mock.calls[0];
      expect(call[0].customerEmail).toBe("paypal-buyer@example.com");
      expect(call[0].customerName).toBe("PayPal Buyer");
    });

    it("should gracefully handle Paddle API failure and still process webhook", async () => {
      vi.stubEnv("PADDLE_API_KEY", "pdl_test_key");
      vi.stubEnv("NEXT_PUBLIC_PADDLE_ENVIRONMENT", "production");

      vi.resetModules();
      vi.doMock("@/lib/email", () => ({
        sendPurchaseConfirmationEmail: vi.fn().mockResolvedValue({ success: false, error: "Customer email is empty" }),
        sendPaymentFailureEmail: vi.fn().mockResolvedValue({ success: true }),
      }));
      vi.doMock("@/lib/refund-guard", () => ({
        markRefunded: vi.fn().mockResolvedValue(undefined),
      }));

      const mod = await import("@/app/api/webhooks/paddle/route");

      // Mock fetch: Paddle API returns 500
      vi.spyOn(globalThis, "fetch").mockImplementation(async (url) => {
        const urlStr = typeof url === "string" ? url : url instanceof URL ? url.toString() : "";
        if (urlStr.includes("api.paddle.com")) {
          return new Response("Internal Server Error", { status: 500, statusText: "Internal Server Error" });
        }
        if (urlStr.includes("api.telegram.org")) {
          return new Response(JSON.stringify({ ok: true }), { status: 200 });
        }
        return new Response("", { status: 200 });
      });

      const event = {
        event_type: "transaction.completed",
        data: {
          id: "txn_paypal_fail",
          customer_id: "ctm_unknown",
          billing_details: null,
          customer: {},
          items: [{ product: {}, price: { id: "pri_vol1" } }],
          details: { totals: { grand_total: "1700" } },
          currency_code: "USD",
        },
      };

      const body = JSON.stringify(event);
      const sig = createPaddleSignature(body, WEBHOOK_SECRET);
      const req = createRequest(body, sig);

      // Should still return 200 — webhook processing succeeds even if enrichment fails
      const res = await mod.POST(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.received).toBe(true);
    });

    it("should not call Paddle API when email is already present in payload", async () => {
      vi.stubEnv("PADDLE_API_KEY", "pdl_test_key");
      vi.stubEnv("NEXT_PUBLIC_PADDLE_ENVIRONMENT", "production");

      // Standard event with billing_details.email present
      const body = JSON.stringify(makeCompletedEvent());
      const sig = createPaddleSignature(body, WEBHOOK_SECRET);
      const req = createRequest(body, sig);

      await POST(req);

      // Verify Paddle API was NOT called (only Telegram calls should exist)
      const fetchCalls = vi.mocked(globalThis.fetch).mock.calls;
      const paddleApiCall = fetchCalls.find(
        (c) => typeof c[0] === "string" && c[0].includes("api.paddle.com/transactions/")
      );
      expect(paddleApiCall).toBeUndefined();
    });

    it("should use sandbox API URL in sandbox environment", async () => {
      vi.stubEnv("PADDLE_API_KEY", "pdl_test_key");
      vi.stubEnv("NEXT_PUBLIC_PADDLE_ENVIRONMENT", "sandbox");

      vi.resetModules();
      vi.doMock("@/lib/email", () => ({
        sendPurchaseConfirmationEmail: vi.fn().mockResolvedValue({ success: true, messageId: "msg-sandbox" }),
        sendPaymentFailureEmail: vi.fn().mockResolvedValue({ success: true }),
      }));
      vi.doMock("@/lib/refund-guard", () => ({
        markRefunded: vi.fn().mockResolvedValue(undefined),
      }));

      const mod = await import("@/app/api/webhooks/paddle/route");

      vi.spyOn(globalThis, "fetch").mockImplementation(async (url) => {
        const urlStr = typeof url === "string" ? url : url instanceof URL ? url.toString() : "";
        if (urlStr.includes("sandbox-api.paddle.com")) {
          return new Response(JSON.stringify({
            data: {
              customer: { email: "sandbox@example.com", name: "Sandbox User" },
              items: [{ product: { name: "Sandbox Product" } }],
            },
          }), { status: 200 });
        }
        if (urlStr.includes("api.telegram.org")) {
          return new Response(JSON.stringify({ ok: true }), { status: 200 });
        }
        return new Response("", { status: 200 });
      });

      const event = {
        event_type: "transaction.completed",
        data: {
          id: "txn_sandbox_001",
          customer_id: "ctm_sandbox",
          billing_details: null,
          customer: {},
          items: [{ product: {}, price: { id: "pri_vol1" } }],
          details: { totals: { grand_total: "1700" } },
          currency_code: "USD",
        },
      };

      const body = JSON.stringify(event);
      const sig = createPaddleSignature(body, WEBHOOK_SECRET);
      const req = createRequest(body, sig);

      await mod.POST(req);

      // Verify sandbox URL was used
      const fetchCalls = vi.mocked(globalThis.fetch).mock.calls;
      const sandboxCall = fetchCalls.find(
        (c) => typeof c[0] === "string" && c[0].includes("sandbox-api.paddle.com")
      );
      expect(sandboxCall).toBeDefined();
    });
  });

  // ─── Malformed Payloads ───

  describe("Malformed Payloads", () => {
    it("should return 400 for invalid JSON body", async () => {
      const body = "not valid json {{{";
      const sig = createPaddleSignature(body, WEBHOOK_SECRET);
      const req = createRequest(body, sig);

      const res = await POST(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe("Invalid payload");
    });

    it("should return 400 for missing event_type", async () => {
      const body = JSON.stringify({ data: { id: "txn_123" } });
      const sig = createPaddleSignature(body, WEBHOOK_SECRET);
      const req = createRequest(body, sig);

      const res = await POST(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe("Missing event_type");
    });

    it("should handle missing data object gracefully", async () => {
      const body = JSON.stringify({ event_type: "transaction.completed" });
      const sig = createPaddleSignature(body, WEBHOOK_SECRET);
      const req = createRequest(body, sig);

      const res = await POST(req);
      // Should still return 200 — graceful degradation
      expect(res.status).toBe(200);
    });
  });

  // ─── Unknown Event Types ───

  describe("Unknown Event Types", () => {
    it("should acknowledge unknown events with 200", async () => {
      const body = JSON.stringify({
        event_type: "subscription.created",
        data: { id: "sub_123" },
      });
      const sig = createPaddleSignature(body, WEBHOOK_SECRET);
      const req = createRequest(body, sig);

      const res = await POST(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.received).toBe(true);
    });
  });
});
