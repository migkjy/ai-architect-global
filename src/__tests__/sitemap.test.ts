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

describe("sitemap.xml (index)", () => {
  it("returns valid sitemapindex XML with sub-sitemaps", async () => {
    const { GET } = await import("@/app/sitemap.xml/route");
    const response = GET();
    const xml = await response.text();

    expect(xml).toContain('<?xml version="1.0"');
    expect(xml).toContain("<sitemapindex");
    expect(xml).toContain("sitemap-pages.xml");
    expect(xml).toContain("sitemap-blog.xml");
    expect(xml).toContain("sitemap-products.xml");
  });

  it("sets correct content-type header", async () => {
    const { GET } = await import("@/app/sitemap.xml/route");
    const response = GET();
    expect(response.headers.get("Content-Type")).toBe(
      "application/xml; charset=utf-8"
    );
  });
});

describe("sitemap-pages.xml", () => {
  it("includes /en/pricing page", async () => {
    const { GET } = await import("@/app/sitemap-pages.xml/route");
    const response = GET();
    const xml = await response.text();

    expect(xml).toContain("<urlset");
    expect(xml).toContain("/en/pricing");
  });

  it("includes /en/free-guide page", async () => {
    const { GET } = await import("@/app/sitemap-pages.xml/route");
    const response = GET();
    const xml = await response.text();

    expect(xml).toContain("/en/free-guide");
  });

  it("includes /ja/ URLs", async () => {
    const { GET } = await import("@/app/sitemap-pages.xml/route");
    const response = GET();
    const xml = await response.text();

    expect(xml).toContain("/ja/pricing");
    expect(xml).toContain("/ja/about");
    expect(xml).toContain("/ja/faq");
    expect(xml).toContain("/ja/blog");
    expect(xml).toContain("/ja/free-guide");
  });

  it("does not include /ko/ URLs", async () => {
    const { GET } = await import("@/app/sitemap-pages.xml/route");
    const response = GET();
    const xml = await response.text();

    expect(xml).not.toContain("/ko/");
  });
});

describe("sitemap-products.xml", () => {
  it("returns valid urlset XML with product URLs", async () => {
    const { GET } = await import("@/app/sitemap-products.xml/route");
    const response = GET();
    const xml = await response.text();

    expect(xml).toContain("<urlset");
    expect(xml).toContain("/en/products/");
  });
});

describe("sitemap-blog.xml", () => {
  it("returns valid urlset XML with blog URLs", async () => {
    const { GET } = await import("@/app/sitemap-blog.xml/route");
    const response = GET();
    const xml = await response.text();

    expect(xml).toContain("<urlset");
    expect(xml).toContain("/en/blog/");
  });
});
