import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";

describe("Sitemap", () => {
  it("canonical sitemap (id=0) includes pricing page", () => {
    const entries = sitemap({ id: 0 });
    const pricingEntry = entries.find((e) => e.url.endsWith("/pricing"));
    expect(pricingEntry).toBeDefined();
    expect(pricingEntry!.priority).toBeGreaterThanOrEqual(0.8);
  });

  it("en sitemap (id=1) includes /en/pricing", () => {
    const entries = sitemap({ id: 1 });
    const enPricing = entries.find((e) => e.url.includes("/en/pricing"));
    expect(enPricing).toBeDefined();
  });

  it("no /ja/ URLs in any sitemap", () => {
    const canonical = sitemap({ id: 0 });
    const en = sitemap({ id: 1 });
    const allEntries = [...canonical, ...en];
    const jaEntries = allEntries.filter((e) => e.url.includes("/ja/"));
    expect(jaEntries).toHaveLength(0);
  });

  it("no /ko/ URLs in any sitemap", () => {
    const canonical = sitemap({ id: 0 });
    const en = sitemap({ id: 1 });
    const allEntries = [...canonical, ...en];
    const koEntries = allEntries.filter((e) => e.url.includes("/ko/"));
    expect(koEntries).toHaveLength(0);
  });
});
