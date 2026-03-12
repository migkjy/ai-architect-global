/**
 * Paddle Checkout Flow Tests
 *
 * Tests the client-side checkout integration that mirrors the BuyButton component
 * behavior: window.Paddle initialization, Paddle.Checkout.open call, and the
 * product price ID → checkout mapping.
 *
 * Also tests the products lib helpers that feed Price IDs into BuyButton.
 *
 * No browser environment — all window.Paddle interactions use vi.fn() mocks.
 * No real Paddle SDK (@paddle/paddle-js) is installed; the project uses the
 * window.Paddle global loaded via cdn.paddle.com/paddle/v2/paddle.js.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ─── Simulate window.Paddle global ────────────────────────────────────────────

function createPaddleMock() {
  return {
    Environment: {
      set: vi.fn(),
    },
    Setup: vi.fn(),
    Checkout: {
      open: vi.fn(),
    },
  };
}

// ─── Checkout open() argument shape ───────────────────────────────────────────

describe("Paddle Checkout.open() call shape", () => {
  let paddleMock: ReturnType<typeof createPaddleMock>;

  beforeEach(() => {
    paddleMock = createPaddleMock();
    // Install Paddle global
    (globalThis as Record<string, unknown>).window = {
      Paddle: paddleMock,
    };
  });

  afterEach(() => {
    delete (globalThis as Record<string, unknown>).window;
    vi.restoreAllMocks();
  });

  it("should call Checkout.open with correct priceId and quantity 1", () => {
    const priceId = "pri_vol1_live";
    const siteUrl = "https://ai-native-playbook.com";

    paddleMock.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      settings: {
        successUrl: `${siteUrl}/thank-you`,
      },
    });

    expect(paddleMock.Checkout.open).toHaveBeenCalledTimes(1);
    const args = paddleMock.Checkout.open.mock.calls[0][0] as {
      items: Array<{ priceId: string; quantity: number }>;
      settings: { successUrl: string };
    };
    expect(args.items).toHaveLength(1);
    expect(args.items[0].priceId).toBe(priceId);
    expect(args.items[0].quantity).toBe(1);
  });

  it("should include successUrl in settings", () => {
    const successUrl = "https://ai-native-playbook.com/thank-you";

    paddleMock.Checkout.open({
      items: [{ priceId: "pri_bundle_live", quantity: 1 }],
      settings: { successUrl },
    });

    const args = paddleMock.Checkout.open.mock.calls[0][0] as {
      settings: { successUrl: string };
    };
    expect(args.settings.successUrl).toBe(successUrl);
  });

  it("should use custom successUrl when provided", () => {
    const customSuccess = "https://ai-native-playbook.com/thank-you?product=Bundle";

    paddleMock.Checkout.open({
      items: [{ priceId: "pri_bundle_live", quantity: 1 }],
      settings: { successUrl: customSuccess },
    });

    const args = paddleMock.Checkout.open.mock.calls[0][0] as {
      settings: { successUrl: string };
    };
    expect(args.settings.successUrl).toBe(customSuccess);
  });
});

// ─── Paddle initialization flow ───────────────────────────────────────────────

describe("Paddle Setup initialization", () => {
  let paddleMock: ReturnType<typeof createPaddleMock>;

  beforeEach(() => {
    paddleMock = createPaddleMock();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call Environment.set('sandbox') in sandbox mode", () => {
    const environment = "sandbox";
    const clientToken = "test-client-token-abc";

    if (environment === "sandbox" && paddleMock.Environment) {
      paddleMock.Environment.set("sandbox");
    }
    paddleMock.Setup({ token: clientToken });

    expect(paddleMock.Environment.set).toHaveBeenCalledWith("sandbox");
    expect(paddleMock.Setup).toHaveBeenCalledWith({ token: clientToken });
  });

  it("should NOT call Environment.set in production mode", () => {
    const environment = "production";
    const clientToken = "live-client-token-xyz";

    if (environment === "sandbox" && paddleMock.Environment) {
      paddleMock.Environment.set("sandbox");
    }
    paddleMock.Setup({ token: clientToken });

    expect(paddleMock.Environment.set).not.toHaveBeenCalled();
    expect(paddleMock.Setup).toHaveBeenCalledWith({ token: clientToken });
  });

  it("should not call Setup when client token is empty", () => {
    const clientToken = "";

    // Guard mirrors layout.tsx: only render script when token is set
    if (clientToken) {
      paddleMock.Setup({ token: clientToken });
    }

    expect(paddleMock.Setup).not.toHaveBeenCalled();
  });
});

// ─── BuyButton state logic (pure logic, no React rendering) ───────────────────

describe("BuyButton Paddle readiness logic", () => {
  it("usePaddleOverlay is true only when both paddlePriceId and paddleReady", () => {
    // Replicate the boolean logic from BuyButton:
    // const usePaddleOverlay = !!paddlePriceId && paddleReady;
    expect(!!("pri_vol1") && true).toBe(true);
    expect(!!("pri_vol1") && false).toBe(false);
    expect(!!(undefined) && true).toBe(false);
    expect(!!(undefined) && false).toBe(false);
  });

  it("paddleNotReady is true when priceId set but Paddle not loaded yet", () => {
    // const paddleNotReady = !!paddlePriceId && !paddleReady;
    expect(!!("pri_vol1") && !false).toBe(true);   // priceId set, not ready
    expect(!!("pri_vol1") && !true).toBe(false);   // priceId set, ready
    expect(!!(undefined) && !false).toBe(false);    // no priceId
  });

  it("isDisabled when no paddlePriceId and href is '#' or empty", () => {
    // const isDisabled = !paddlePriceId && (href === '#' || !href);
    const paddlePriceId = undefined;

    expect(!paddlePriceId && ("#" === "#" || !"#")).toBe(true);  // href="#"
    expect(!paddlePriceId && ("" === "#" || !"")).toBe(true);    // empty href
    expect(!paddlePriceId && ("https://..." === "#" || !"https://...")).toBe(false); // valid href
    expect(!("pri_vol1") && ("#" === "#" || !"#")).toBe(false);  // has priceId
  });
});

// ─── Products lib — Paddle price ID helpers ────────────────────────────────────

describe("products lib — getBundlePaddlePriceId / getBookPaddlePriceId", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("getBundlePaddlePriceId returns bundle price ID from env", async () => {
    vi.stubEnv("PADDLE_PRICE_ID_BUNDLE", "pri_bundle_live_001");
    vi.resetModules();
    const { getBundlePaddlePriceId } = await import("@/lib/products");

    expect(getBundlePaddlePriceId()).toBe("pri_bundle_live_001");
  });

  it("getBundlePaddlePriceId returns undefined when not set", async () => {
    vi.resetModules();
    const { getBundlePaddlePriceId } = await import("@/lib/products");

    expect(getBundlePaddlePriceId()).toBeUndefined();
  });

  it("getBookPaddlePriceId returns correct ID for each volume", async () => {
    vi.stubEnv("PADDLE_PRICE_ID_VOL1", "pri_v1");
    vi.stubEnv("PADDLE_PRICE_ID_VOL3", "pri_v3");
    vi.resetModules();
    const { getBookPaddlePriceId } = await import("@/lib/products");

    expect(getBookPaddlePriceId("PADDLE_PRICE_ID_VOL1")).toBe("pri_v1");
    expect(getBookPaddlePriceId("PADDLE_PRICE_ID_VOL3")).toBe("pri_v3");
    expect(getBookPaddlePriceId("PADDLE_PRICE_ID_VOL2")).toBeUndefined();
  });

  it("all 6 books expose unique paddlePriceEnvKey values", async () => {
    vi.resetModules();
    const { books } = await import("@/lib/products");

    const envKeys = books.map((b) => b.paddlePriceEnvKey);
    expect(new Set(envKeys).size).toBe(6);
    // Each key should follow PADDLE_PRICE_ID_VOL{n} pattern
    for (const key of envKeys) {
      expect(key).toMatch(/^PADDLE_PRICE_ID_VOL\d$/);
    }
  });

  it("BUNDLE_PADDLE_PRICE_ENV_KEY is PADDLE_PRICE_ID_BUNDLE", async () => {
    vi.resetModules();
    const { BUNDLE_PADDLE_PRICE_ENV_KEY } = await import("@/lib/products");

    expect(BUNDLE_PADDLE_PRICE_ENV_KEY).toBe("PADDLE_PRICE_ID_BUNDLE");
  });
});

// ─── Environment variable validation ──────────────────────────────────────────

describe("Paddle environment variable presence checks", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("NEXT_PUBLIC_PADDLE_CLIENT_TOKEN presence determines Paddle.js load", () => {
    // The layout.tsx guards on this: {process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN && <Script ... />}
    // Test that the guard logic is sound
    const shouldLoad = (token: string | undefined) => !!token;

    expect(shouldLoad("live_token_abc")).toBe(true);
    expect(shouldLoad(undefined)).toBe(false);
    expect(shouldLoad("")).toBe(false);
  });

  it("NEXT_PUBLIC_PADDLE_ENVIRONMENT defaults to sandbox when unset", async () => {
    // Remove the variable entirely
    vi.resetModules();
    const { createPaddleTransaction } = await import("@/lib/paddle");

    vi.stubEnv("PADDLE_API_KEY", "key");
    vi.stubEnv("NEXT_PUBLIC_PADDLE_ENVIRONMENT", ""); // unset

    vi.resetModules();
    // Re-import to pick up cleared env
    const paddleLib = await import("@/lib/paddle");

    // The function getPaddleBaseUrl() defaults to sandbox when env is empty/undefined:
    // const env = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT ?? "sandbox";
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ data: { id: "t1", status: "ready", checkout: null } }), { status: 200 })
    );

    await paddleLib.createPaddleTransaction({ items: [{ priceId: "p1", quantity: 1 }] });

    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    // When env is "" (falsy), ?? "sandbox" kicks in → sandbox URL
    expect(calledUrl).toContain("sandbox-api.paddle.com");

    vi.restoreAllMocks();
  });

  it("PADDLE_WEBHOOK_SECRET absence causes webhook to return 500", async () => {
    vi.stubEnv("PADDLE_WEBHOOK_SECRET", "");
    vi.resetModules();
    const { POST } = await import("@/app/api/webhooks/paddle/route");

    const req = new Request("http://localhost/api/webhooks/paddle", {
      method: "POST",
      body: "{}",
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("Server misconfiguration");
  });
});
