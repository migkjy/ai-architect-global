/**
 * Download utility tests for AI Native Playbook (EN)
 *
 * Covers:
 * - EN PDF Vol1-6 product file mapping
 * - Bundle mapping
 * - Skills/Agents/Notion mapping
 * - Token generation and verification (round-trip)
 * - Expired/invalid token rejection
 * - getAllDownloadLinks for bundle vs individual purchases
 * - isValidProductType validation
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

describe("ainp download utilities", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("R2_PUBLIC_URL", "https://files.ai-native-playbook.com");
    vi.stubEnv("DOWNLOAD_SECRET", "ainp-test-secret-2026");
  });

  // ─── Product File Mapping ───

  describe("getProductFile()", () => {
    it("maps EN PDF Vol1 correctly", async () => {
      const { getProductFile } = await import("@/lib/download");
      const vol1 = getProductFile("pdf-vol1");
      expect(vol1).not.toBeNull();
      expect(vol1!.url).toContain("en/pdf/ai-marketing-playbook.pdf");
      expect(vol1!.filename).toBe("AI-Marketing-Playbook.pdf");
    });

    it("maps all 6 EN PDF volumes", async () => {
      const { getProductFile } = await import("@/lib/download");
      for (let i = 1; i <= 6; i++) {
        const vol = getProductFile(`pdf-vol${i}`);
        expect(vol).not.toBeNull();
        expect(vol!.url).toContain("en/pdf/");
        expect(vol!.filename).toBeTruthy();
      }
    });

    it("maps EN bundle correctly", async () => {
      const { getProductFile } = await import("@/lib/download");
      const bundle = getProductFile("bundle");
      expect(bundle).not.toBeNull();
      expect(bundle!.url).toContain("en/bundles/ai-native-playbook-bundle.zip");
      expect(bundle!.filename).toBe("AI-Native-Playbook-Bundle.zip");
    });

    it("maps skills, agents, notion products", async () => {
      const { getProductFile } = await import("@/lib/download");
      expect(getProductFile("skills")).not.toBeNull();
      expect(getProductFile("agents")).not.toBeNull();
      expect(getProductFile("notion")).not.toBeNull();
    });

    it("returns null for unknown product type", async () => {
      const { getProductFile } = await import("@/lib/download");
      expect(getProductFile("unknown-product")).toBeNull();
    });
  });

  // ─── Token Generation & Verification ───

  describe("generateDownloadToken() + verifyDownloadToken()", () => {
    it("round-trip: generate then verify returns valid + orderId", async () => {
      const { generateDownloadToken, verifyDownloadToken } = await import(
        "@/lib/download"
      );
      const token = generateDownloadToken("txn_paddle_123");
      const result = verifyDownloadToken(token);
      expect(result.valid).toBe(true);
      expect(result.orderId).toBe("txn_paddle_123");
    });

    it("rejects invalid token string", async () => {
      const { verifyDownloadToken } = await import("@/lib/download");
      const result = verifyDownloadToken("invalid-garbage-token");
      expect(result.valid).toBe(false);
    });

    it("rejects tampered token", async () => {
      const { generateDownloadToken, verifyDownloadToken } = await import(
        "@/lib/download"
      );
      const token = generateDownloadToken("txn_123");
      // Tamper by changing a character
      const tampered = token.slice(0, -1) + (token.slice(-1) === "a" ? "b" : "a");
      const result = verifyDownloadToken(tampered);
      expect(result.valid).toBe(false);
    });
  });

  // ─── Download Links ───

  describe("getAllDownloadLinks()", () => {
    it("returns all products for bundle purchase", async () => {
      const { getAllDownloadLinks } = await import("@/lib/download");
      const links = getAllDownloadLinks(
        "txn_123",
        "token-abc",
        "bundle",
        "https://test.com"
      );
      expect(links).toHaveProperty("bundle");
      expect(links).toHaveProperty("pdf-vol1");
      expect(links).toHaveProperty("pdf-vol6");
      expect(links).toHaveProperty("skills");
      expect(links).toHaveProperty("agents");
      expect(links).toHaveProperty("notion");
      // All links should contain the token
      for (const url of Object.values(links)) {
        expect(url).toContain("token=token-abc");
      }
    });

    it("returns only purchased product for individual purchase", async () => {
      const { getAllDownloadLinks } = await import("@/lib/download");
      const links = getAllDownloadLinks(
        "txn_456",
        "token-def",
        "pdf-vol3",
        "https://test.com"
      );
      expect(links).toHaveProperty("pdf-vol3");
      expect(Object.keys(links)).toHaveLength(1);
    });
  });

  // ─── Validation ───

  describe("isValidProductType()", () => {
    it("accepts valid product types", async () => {
      const { isValidProductType } = await import("@/lib/download");
      expect(isValidProductType("pdf-vol1")).toBe(true);
      expect(isValidProductType("bundle")).toBe(true);
      expect(isValidProductType("skills")).toBe(true);
    });

    it("rejects invalid product types", async () => {
      const { isValidProductType } = await import("@/lib/download");
      expect(isValidProductType("invalid")).toBe(false);
      expect(isValidProductType("")).toBe(false);
    });
  });
});
