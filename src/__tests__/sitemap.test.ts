import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";

describe("Sitemap", () => {
  it("includes pricing page", () => {
    const entries = sitemap();
    const pricingEntry = entries.find((e) => e.url.endsWith("/pricing"));
    expect(pricingEntry).toBeDefined();
    expect(pricingEntry!.priority).toBeGreaterThanOrEqual(0.8);
  });

  it("includes pricing page with locale prefixes", () => {
    const entries = sitemap();
    const enPricing = entries.find((e) => e.url.includes("/en/pricing"));
    const jaPricing = entries.find((e) => e.url.includes("/ja/pricing"));
    expect(enPricing).toBeDefined();
    expect(jaPricing).toBeDefined();
  });
});
