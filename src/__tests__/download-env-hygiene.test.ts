/**
 * Regression tests for env-value hygiene in the download system.
 *
 * Root cause (2026-06-23): production env values (DOWNLOAD_SECRET, R2_PUBLIC_URL,
 * TURSO_*) had a trailing "\n" accidentally saved into the Vercel dashboard.
 * - A newline in R2_PUBLIC_URL produced a redirect URL that could throw.
 * - A newline in DOWNLOAD_SECRET silently changes every HMAC.
 * These tests pin the .trim() guard so the regression cannot return.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";

describe("download env hygiene (trailing newline)", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("getProductFile trims a trailing newline in R2_PUBLIC_URL → redirect-safe URL", async () => {
    process.env.R2_PUBLIC_URL = "https://files.example.com\n";
    process.env.DOWNLOAD_SECRET = "test-secret";

    const { getProductFile } = await import("@/lib/download");
    const product = getProductFile("pdf-vol1");

    expect(product).not.toBeNull();
    const url = product!.url;
    // No stray control characters that would break URL/redirect handling
    expect(url).not.toContain("\n");
    expect(url).toBe(
      "https://files.example.com/en/vols/vol1-ai-marketing-architect.zip"
    );
    // The exact operation the download route performs must not throw
    expect(() => new URL(url)).not.toThrow();
    expect(() => Response.redirect(url, 307)).not.toThrow();
  });

  it("token round-trips even when DOWNLOAD_SECRET has a trailing newline", async () => {
    process.env.R2_PUBLIC_URL = "https://files.example.com";
    process.env.DOWNLOAD_SECRET = "polluted-secret\n";

    const { generateDownloadToken, verifyDownloadToken } = await import(
      "@/lib/download"
    );
    const token = generateDownloadToken("txn_abc123");
    const result = verifyDownloadToken(token);

    expect(result.valid).toBe(true);
    expect(result.orderId).toBe("txn_abc123");
  });

  it("a newline-polluted secret yields the SAME token bytes as the clean secret", async () => {
    // Pin the clock so the expiry component is identical across both tokens —
    // any difference then comes purely from the HMAC (i.e. from the secret).
    // If the .trim() guard were removed, the newline secret would change the
    // HMAC and this byte-for-byte equality would fail. That is the regression.
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-23T00:00:00Z"));

    process.env.DOWNLOAD_SECRET = "shared-secret\n";
    const polluted = await import("@/lib/download");
    const tokenPolluted = polluted.generateDownloadToken("txn_fixed");

    vi.resetModules();
    process.env.DOWNLOAD_SECRET = "shared-secret";
    const clean = await import("@/lib/download");
    const tokenClean = clean.generateDownloadToken("txn_fixed");

    expect(tokenPolluted).toBe(tokenClean);
    expect(clean.verifyDownloadToken(tokenPolluted).valid).toBe(true);

    vi.useRealTimers();
  });
});
