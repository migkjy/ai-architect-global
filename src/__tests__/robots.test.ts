import { describe, it, expect } from "vitest";
import robots from "@/app/robots";

describe("Robots", () => {
  const config = robots();

  it("has rules array", () => {
    expect(Array.isArray(config.rules)).toBe(true);
    expect((config.rules as unknown[]).length).toBeGreaterThan(0);
  });

  it("default rule allows / and disallows /api/", () => {
    const rules = config.rules as Array<{
      userAgent: string;
      allow?: string | string[];
      disallow?: string | string[];
    }>;
    const defaultRule = rules.find((r) => r.userAgent === "*");
    expect(defaultRule).toBeDefined();
    expect(defaultRule!.allow).toBe("/");
    expect(defaultRule!.disallow).toContain("/api/");
  });

  it("blocks AI crawlers", () => {
    const rules = config.rules as Array<{ userAgent: string; disallow?: string | string[] }>;
    const aiCrawlers = ["GPTBot", "ChatGPT-User", "anthropic-ai", "ClaudeBot", "CCBot"];
    for (const crawler of aiCrawlers) {
      const rule = rules.find((r) => r.userAgent === crawler);
      expect(rule, `Rule for ${crawler} should exist`).toBeDefined();
      expect(rule!.disallow).toBe("/");
    }
  });

  it("disallows /ko and /ko/ paths", () => {
    const rules = config.rules as Array<{ userAgent: string; disallow?: string | string[] }>;
    const defaultRule = rules.find((r) => r.userAgent === "*");
    expect(defaultRule!.disallow).toContain("/ko");
    expect(defaultRule!.disallow).toContain("/ko/");
  });

  it("includes sitemap URLs", () => {
    expect(config.sitemap).toBeDefined();
    const sitemaps = config.sitemap as string[];
    expect(sitemaps.length).toBeGreaterThanOrEqual(1);
    expect(sitemaps.some((s) => s.includes("sitemap.xml"))).toBe(true);
  });
});
