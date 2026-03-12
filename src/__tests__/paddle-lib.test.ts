/**
 * Tests for src/lib/paddle.ts
 *
 * Covers:
 * - createPaddleTransaction: success, API error, missing PADDLE_API_KEY
 * - getPaddlePriceId: env var lookup, missing key
 * - Environment / base URL selection (sandbox vs production)
 * - Request shape sent to Paddle API (items, collection_mode, checkout URL)
 *
 * No real Paddle API calls are made — global fetch is mocked throughout.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type {
  PaddleCreateTransactionOptions,
  PaddleTransaction,
} from "@/lib/paddle";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeMockTransaction(overrides: Partial<PaddleTransaction> = {}): PaddleTransaction {
  return {
    id: "txn_mock_001",
    status: "ready",
    checkout: { url: "https://checkout.paddle.com/checkout/txn_mock_001" },
    ...overrides,
  };
}

function mockFetchSuccess(txn: PaddleTransaction) {
  return vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
    new Response(JSON.stringify({ data: txn }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  );
}

function mockFetchError(status: number, body: string) {
  return vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
    new Response(body, { status })
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("src/lib/paddle — createPaddleTransaction", () => {
  beforeEach(() => {
    vi.stubEnv("PADDLE_API_KEY", "test-api-key-abc");
    vi.stubEnv("NEXT_PUBLIC_PADDLE_ENVIRONMENT", "sandbox");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://test.example.com");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    // Reset module cache so env changes take effect
    vi.resetModules();
  });

  it("should throw when PADDLE_API_KEY is not set", async () => {
    vi.stubEnv("PADDLE_API_KEY", "");
    vi.resetModules();
    const { createPaddleTransaction } = await import("@/lib/paddle");

    const options: PaddleCreateTransactionOptions = {
      items: [{ priceId: "pri_vol1", quantity: 1 }],
    };

    await expect(createPaddleTransaction(options)).rejects.toThrow(
      "PADDLE_API_KEY not configured"
    );
  });

  it("should call sandbox API endpoint when environment is sandbox", async () => {
    vi.stubEnv("NEXT_PUBLIC_PADDLE_ENVIRONMENT", "sandbox");
    vi.resetModules();
    const { createPaddleTransaction } = await import("@/lib/paddle");

    const fetchSpy = mockFetchSuccess(makeMockTransaction());

    await createPaddleTransaction({
      items: [{ priceId: "pri_vol1", quantity: 1 }],
    });

    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    expect(calledUrl).toContain("sandbox-api.paddle.com");
    // Must be sandbox subdomain, not the live root domain
    expect(calledUrl).not.toMatch(/^https:\/\/api\.paddle\.com/);
  });

  it("should call live API endpoint when environment is production", async () => {
    vi.stubEnv("NEXT_PUBLIC_PADDLE_ENVIRONMENT", "production");
    vi.resetModules();
    const { createPaddleTransaction } = await import("@/lib/paddle");

    const fetchSpy = mockFetchSuccess(makeMockTransaction());

    await createPaddleTransaction({
      items: [{ priceId: "pri_vol1", quantity: 1 }],
    });

    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    // Should be live endpoint, not sandbox
    expect(calledUrl).toMatch(/^https:\/\/api\.paddle\.com\/transactions$/);
  });

  it("should send Authorization header with Bearer token", async () => {
    vi.resetModules();
    const { createPaddleTransaction } = await import("@/lib/paddle");

    const fetchSpy = mockFetchSuccess(makeMockTransaction());

    await createPaddleTransaction({
      items: [{ priceId: "pri_vol1", quantity: 1 }],
    });

    const requestInit = fetchSpy.mock.calls[0][1] as RequestInit;
    const headers = requestInit.headers as Record<string, string>;
    expect(headers["Authorization"]).toBe("Bearer test-api-key-abc");
  });

  it("should send correct items array in request body", async () => {
    vi.resetModules();
    const { createPaddleTransaction } = await import("@/lib/paddle");

    const fetchSpy = mockFetchSuccess(makeMockTransaction());

    await createPaddleTransaction({
      items: [
        { priceId: "pri_vol1", quantity: 1 },
        { priceId: "pri_vol2", quantity: 2 },
      ],
    });

    const requestInit = fetchSpy.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(requestInit.body as string);
    expect(body.items).toEqual([
      { price_id: "pri_vol1", quantity: 1 },
      { price_id: "pri_vol2", quantity: 2 },
    ]);
  });

  it("should set collection_mode to automatic", async () => {
    vi.resetModules();
    const { createPaddleTransaction } = await import("@/lib/paddle");

    const fetchSpy = mockFetchSuccess(makeMockTransaction());

    await createPaddleTransaction({
      items: [{ priceId: "pri_vol1", quantity: 1 }],
    });

    const requestInit = fetchSpy.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(requestInit.body as string);
    expect(body.collection_mode).toBe("automatic");
  });

  it("should use NEXT_PUBLIC_SITE_URL/thank-you as default checkout URL", async () => {
    vi.resetModules();
    const { createPaddleTransaction } = await import("@/lib/paddle");

    const fetchSpy = mockFetchSuccess(makeMockTransaction());

    await createPaddleTransaction({
      items: [{ priceId: "pri_vol1", quantity: 1 }],
    });

    const requestInit = fetchSpy.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(requestInit.body as string);
    expect(body.checkout.url).toBe("https://test.example.com/thank-you");
  });

  it("should use custom successUrl when provided", async () => {
    vi.resetModules();
    const { createPaddleTransaction } = await import("@/lib/paddle");

    const fetchSpy = mockFetchSuccess(makeMockTransaction());

    await createPaddleTransaction({
      items: [{ priceId: "pri_vol1", quantity: 1 }],
      successUrl: "https://test.example.com/custom-success",
    });

    const requestInit = fetchSpy.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(requestInit.body as string);
    expect(body.checkout.url).toBe("https://test.example.com/custom-success");
  });

  it("should include custom_data in request body", async () => {
    vi.resetModules();
    const { createPaddleTransaction } = await import("@/lib/paddle");

    const fetchSpy = mockFetchSuccess(makeMockTransaction());

    await createPaddleTransaction({
      items: [{ priceId: "pri_vol1", quantity: 1 }],
      customData: { userId: "usr_123", source: "pricing_page" },
    });

    const requestInit = fetchSpy.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(requestInit.body as string);
    expect(body.custom_data).toEqual({ userId: "usr_123", source: "pricing_page" });
  });

  it("should return the transaction data from API response", async () => {
    vi.resetModules();
    const { createPaddleTransaction } = await import("@/lib/paddle");

    const txn = makeMockTransaction({ id: "txn_returned_001", status: "ready" });
    mockFetchSuccess(txn);

    const result = await createPaddleTransaction({
      items: [{ priceId: "pri_vol1", quantity: 1 }],
    });

    expect(result.id).toBe("txn_returned_001");
    expect(result.status).toBe("ready");
    expect(result.checkout?.url).toBeDefined();
  });

  it("should throw with status code when Paddle API returns an error", async () => {
    vi.resetModules();
    const { createPaddleTransaction } = await import("@/lib/paddle");

    mockFetchError(422, JSON.stringify({ error: { type: "request_error", code: "invalid_price_id" } }));

    await expect(
      createPaddleTransaction({ items: [{ priceId: "pri_invalid", quantity: 1 }] })
    ).rejects.toThrow("Paddle API error: 422");
  });

  it("should throw when Paddle API returns 401 Unauthorized", async () => {
    vi.resetModules();
    const { createPaddleTransaction } = await import("@/lib/paddle");

    mockFetchError(401, "Unauthorized");

    await expect(
      createPaddleTransaction({ items: [{ priceId: "pri_vol1", quantity: 1 }] })
    ).rejects.toThrow("Paddle API error: 401");
  });
});

// ─── getPaddlePriceId ─────────────────────────────────────────────────────────

describe("src/lib/paddle — getPaddlePriceId", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("should return the price ID from environment variable", async () => {
    vi.stubEnv("PADDLE_PRICE_ID_VOL1", "pri_01aaabbb111");
    vi.resetModules();
    const { getPaddlePriceId } = await import("@/lib/paddle");

    expect(getPaddlePriceId("VOL1")).toBe("pri_01aaabbb111");
  });

  it("should return the bundle price ID", async () => {
    vi.stubEnv("PADDLE_PRICE_ID_BUNDLE", "pri_bundle_xyz");
    vi.resetModules();
    const { getPaddlePriceId } = await import("@/lib/paddle");

    expect(getPaddlePriceId("BUNDLE")).toBe("pri_bundle_xyz");
  });

  it("should return undefined when env var is not set", async () => {
    vi.resetModules();
    const { getPaddlePriceId } = await import("@/lib/paddle");

    expect(getPaddlePriceId("VOL99_NONEXISTENT")).toBeUndefined();
  });

  it("should handle all 6 volume keys independently", async () => {
    vi.stubEnv("PADDLE_PRICE_ID_VOL1", "pri_vol1");
    vi.stubEnv("PADDLE_PRICE_ID_VOL2", "pri_vol2");
    vi.stubEnv("PADDLE_PRICE_ID_VOL3", "pri_vol3");
    vi.stubEnv("PADDLE_PRICE_ID_VOL4", "pri_vol4");
    vi.stubEnv("PADDLE_PRICE_ID_VOL5", "pri_vol5");
    vi.stubEnv("PADDLE_PRICE_ID_VOL6", "pri_vol6");
    vi.resetModules();
    const { getPaddlePriceId } = await import("@/lib/paddle");

    for (let i = 1; i <= 6; i++) {
      expect(getPaddlePriceId(`VOL${i}`)).toBe(`pri_vol${i}`);
    }
  });
});
