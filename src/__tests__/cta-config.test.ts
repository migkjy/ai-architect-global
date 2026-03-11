import { describe, it, expect } from "vitest";
import { CTA_VARIANTS } from "@/lib/cta-config";

describe("CTA Config", () => {
  it("pricingPage variants exist for A and B", () => {
    expect(CTA_VARIANTS.pricingPage).toBeDefined();
    expect(CTA_VARIANTS.pricingPage.A).toBeDefined();
    expect(CTA_VARIANTS.pricingPage.B).toBeDefined();
  });

  it("pricingPage variant A has all required CTA texts", () => {
    const a = CTA_VARIANTS.pricingPage.A;
    expect(a.bundleCta).toBeTruthy();
    expect(a.volumeCta).toBeTruthy();
    expect(a.enterpriseCta).toBeTruthy();
    expect(a.bundleBadge).toBeTruthy();
    expect(a.popularBadge).toBeTruthy();
  });

  it("pricingPage variant B has all required CTA texts", () => {
    const b = CTA_VARIANTS.pricingPage.B;
    expect(b.bundleCta).toBeTruthy();
    expect(b.volumeCta).toBeTruthy();
    expect(b.enterpriseCta).toBeTruthy();
    expect(b.bundleBadge).toBeTruthy();
    expect(b.popularBadge).toBeTruthy();
  });

  it("A and B variants have different CTA texts", () => {
    const a = CTA_VARIANTS.pricingPage.A;
    const b = CTA_VARIANTS.pricingPage.B;
    expect(a.bundleCta).not.toBe(b.bundleCta);
    expect(a.volumeCta).not.toBe(b.volumeCta);
  });

  it("all CTA variant sections exist", () => {
    expect(CTA_VARIANTS.emailCapture).toBeDefined();
    expect(CTA_VARIANTS.scrollBanner).toBeDefined();
    expect(CTA_VARIANTS.exitIntent).toBeDefined();
    expect(CTA_VARIANTS.pricingPage).toBeDefined();
  });
});
