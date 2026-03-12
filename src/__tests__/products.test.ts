import { describe, it, expect, vi } from "vitest";
import {
  books,
  bundle,
  getBookBySlug,
  getBundleUrl,
  getProductUrl,
  getBundlePaddlePriceId,
  getBookPaddlePriceId,
  BUNDLE_PADDLE_PRICE_ENV_KEY,
} from "@/lib/products";

describe("Products — books catalog", () => {
  it("books array has 6 volumes", () => {
    expect(books).toHaveLength(6);
  });

  it("every book has required fields", () => {
    for (const book of books) {
      expect(book.id).toBeTruthy();
      expect(book.slug).toBeTruthy();
      expect(book.vol).toBeGreaterThanOrEqual(1);
      expect(book.title).toBeTruthy();
      expect(book.subtitle).toBeTruthy();
      expect(book.tagline).toBeTruthy();
      expect(book.shortDescription).toBeTruthy();
      expect(book.framework).toBeTruthy();
      expect(book.sourceBook).toBeTruthy();
      expect(book.icon).toBeTruthy();
      expect(book.color).toBeTruthy();
      expect(book.envKey).toBeTruthy();
      expect(book.paddlePriceEnvKey).toBeTruthy();
      expect(book.highlights.length).toBeGreaterThan(0);
      expect(book.caseStudy.result).toBeTruthy();
      expect(book.caseStudy.detail).toBeTruthy();
      expect(book.frameworks.length).toBeGreaterThan(0);
      expect(book.whatsInside.length).toBeGreaterThan(0);
    }
  });

  it("all slugs are unique", () => {
    const slugs = books.map((b) => b.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("getBookBySlug finds existing book", () => {
    const book = getBookBySlug("ai-marketing-architect");
    expect(book).toBeDefined();
    expect(book!.vol).toBe(1);
  });

  it("getBookBySlug returns undefined for invalid slug", () => {
    expect(getBookBySlug("nonexistent-book")).toBeUndefined();
  });
});

describe("Products — bundle", () => {
  it("bundle has correct structure", () => {
    expect(bundle.title).toBeTruthy();
    expect(bundle.subtitle).toBeTruthy();
    expect(bundle.price).toBeGreaterThan(0);
    expect(bundle.originalPrice).toBeGreaterThan(bundle.price);
    expect(bundle.discount).toBeGreaterThan(0);
    expect(bundle.envKey).toBeTruthy();
  });
});

describe("Products — URL helpers", () => {
  it("getBundleUrl returns '#' when env is unset", () => {
    const url = getBundleUrl();
    expect(url).toBe("#");
  });

  it("getProductUrl returns '#' when env is unset", () => {
    const url = getProductUrl("NEXT_PUBLIC_LS_PRODUCT_1_URL");
    expect(url).toBe("#");
  });

  it("getProductUrl builds redirect URL when env is set", () => {
    vi.stubEnv("NEXT_PUBLIC_LS_PRODUCT_1_URL", "https://store.example.com/buy/1");
    const url = getProductUrl("NEXT_PUBLIC_LS_PRODUCT_1_URL");
    expect(url).toContain("https://store.example.com/buy/1");
    expect(url).toContain("checkout[custom][redirect_url]");
    expect(url).toContain("thank-you");
    vi.unstubAllEnvs();
  });

  it("getBundleUrl builds redirect URL when env is set", () => {
    vi.stubEnv("NEXT_PUBLIC_LS_BUNDLE_URL", "https://store.example.com/buy/bundle");
    const url = getBundleUrl();
    expect(url).toContain("https://store.example.com/buy/bundle");
    expect(url).toContain("checkout[custom][redirect_url]");
    vi.unstubAllEnvs();
  });
});

describe("Products — Paddle helpers", () => {
  it("getBundlePaddlePriceId returns undefined when env is unset", () => {
    expect(getBundlePaddlePriceId()).toBeUndefined();
  });

  it("getBundlePaddlePriceId returns value when env is set", () => {
    vi.stubEnv(BUNDLE_PADDLE_PRICE_ENV_KEY, "pri_test_123");
    expect(getBundlePaddlePriceId()).toBe("pri_test_123");
    vi.unstubAllEnvs();
  });

  it("getBookPaddlePriceId returns value from env", () => {
    vi.stubEnv("PADDLE_PRICE_ID_VOL1", "pri_vol1_test");
    expect(getBookPaddlePriceId("PADDLE_PRICE_ID_VOL1")).toBe("pri_vol1_test");
    vi.unstubAllEnvs();
  });
});
