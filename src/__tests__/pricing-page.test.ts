import { describe, it, expect } from "vitest";
import { books, bundle } from "@/lib/products";

describe("Pricing Page Data", () => {
  it("bundle price is cheaper than buying all volumes individually", () => {
    const individualTotal = books.length * 17; // $17 per volume
    expect(bundle.price).toBeLessThan(individualTotal);
  });

  it("bundle savings percentage is calculated correctly", () => {
    const savedAmount = bundle.originalPrice - bundle.price;
    const savePct = Math.round((savedAmount / bundle.originalPrice) * 100);
    expect(savePct).toBeGreaterThan(0);
    expect(savePct).toBeLessThanOrEqual(100);
    // Current: $102 - $47 = $55 saved = 54%
    expect(savePct).toBe(54);
  });

  it("all 6 volumes exist with required fields", () => {
    expect(books).toHaveLength(6);
    for (const book of books) {
      expect(book.id).toBeTruthy();
      expect(book.slug).toBeTruthy();
      expect(book.title).toBeTruthy();
      expect(book.vol).toBeGreaterThanOrEqual(1);
      expect(book.vol).toBeLessThanOrEqual(6);
      expect(book.icon).toBeTruthy();
      expect(book.paddlePriceEnvKey).toBeTruthy();
      expect(book.highlights.length).toBeGreaterThan(0);
    }
  });

  it("bundle has correct structure", () => {
    expect(bundle.title).toBeTruthy();
    expect(bundle.price).toBe(47);
    expect(bundle.originalPrice).toBe(102);
    expect(bundle.discount).toBe(54);
  });

  it("each volume has unique slug and id", () => {
    const slugs = books.map((b) => b.slug);
    const ids = books.map((b) => b.id);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
