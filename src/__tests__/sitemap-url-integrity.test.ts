import { describe, it, expect, vi } from "vitest";

// Mock next/server before importing route handlers
vi.mock("next/server", () => ({
  NextResponse: class {
    body: string;
    headers: Map<string, string>;
    constructor(body: string, init?: { headers?: Record<string, string> }) {
      this.body = body;
      this.headers = new Map(Object.entries(init?.headers ?? {}));
    }
    async text() {
      return this.body;
    }
  },
}));

describe("Sitemap URL Integrity", () => {
  it("SITE_URL constant should not contain newlines or whitespace", () => {
    const siteUrl = (
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com"
    ).trim();
    expect(siteUrl).not.toMatch(/\s/);
    expect(siteUrl).toMatch(/^https?:\/\//);
    expect(siteUrl).not.toMatch(/\/$/); // no trailing slash
  });

  it("sitemap.xml URLs must not contain newlines or whitespace", async () => {
    const { GET } = await import("@/app/sitemap.xml/route");
    const response = GET();
    const xml = await response.text();

    const locMatches = xml.match(/<loc>(.*?)<\/loc>/g) ?? [];
    expect(locMatches.length).toBeGreaterThan(0);

    for (const loc of locMatches) {
      const url = loc.replace(/<\/?loc>/g, "");
      expect(url, `URL "${url}" contains whitespace`).not.toMatch(/\s/);
      expect(url, `URL "${url}" must start with https://`).toMatch(
        /^https?:\/\//
      );
    }
  });

  it("sitemap-pages.xml URLs must not contain newlines or whitespace", async () => {
    const { GET } = await import("@/app/sitemap-pages.xml/route");
    const response = GET();
    const xml = await response.text();

    const locMatches = xml.match(/<loc>(.*?)<\/loc>/g) ?? [];
    expect(locMatches.length).toBeGreaterThan(0);

    for (const loc of locMatches) {
      const url = loc.replace(/<\/?loc>/g, "");
      expect(url, `URL "${url}" contains whitespace`).not.toMatch(/\s/);
      expect(url, `URL "${url}" must start with https://`).toMatch(
        /^https?:\/\//
      );
    }
  });

  it("sitemap-blog.xml URLs must not contain newlines or whitespace", async () => {
    const { GET } = await import("@/app/sitemap-blog.xml/route");
    const response = GET();
    const xml = await response.text();

    const locMatches = xml.match(/<loc>(.*?)<\/loc>/g) ?? [];
    expect(locMatches.length).toBeGreaterThan(0);

    for (const loc of locMatches) {
      const url = loc.replace(/<\/?loc>/g, "");
      expect(url, `URL "${url}" contains whitespace`).not.toMatch(/\s/);
      expect(url, `URL "${url}" must start with https://`).toMatch(
        /^https?:\/\//
      );
    }
  });

  it("sitemap-products.xml URLs must not contain newlines or whitespace", async () => {
    const { GET } = await import("@/app/sitemap-products.xml/route");
    const response = GET();
    const xml = await response.text();

    const locMatches = xml.match(/<loc>(.*?)<\/loc>/g) ?? [];
    expect(locMatches.length).toBeGreaterThan(0);

    for (const loc of locMatches) {
      const url = loc.replace(/<\/?loc>/g, "");
      expect(url, `URL "${url}" contains whitespace`).not.toMatch(/\s/);
      expect(url, `URL "${url}" must start with https://`).toMatch(
        /^https?:\/\//
      );
    }
  });

  it("robots.txt sitemap URLs must not contain newlines or whitespace", async () => {
    const { default: robots } = await import("@/app/robots");
    const config = robots();
    const sitemaps = config.sitemap as string[];

    expect(sitemaps.length).toBeGreaterThan(0);

    for (const url of sitemaps) {
      expect(url, `Sitemap URL "${url}" contains whitespace`).not.toMatch(
        /\s/
      );
      expect(url, `Sitemap URL "${url}" must start with https://`).toMatch(
        /^https?:\/\//
      );
    }
  });

  it("crawlDelay must be 1 or less for fast Google indexing", async () => {
    const { default: robots } = await import("@/app/robots");
    const config = robots();
    const rules = config.rules as Array<{
      userAgent: string;
      crawlDelay?: number;
    }>;
    const defaultRule = rules.find((r) => r.userAgent === "*");

    if (defaultRule?.crawlDelay !== undefined) {
      expect(
        defaultRule.crawlDelay,
        "crawlDelay should be <= 1 to allow fast crawling"
      ).toBeLessThanOrEqual(1);
    }
  });
});
