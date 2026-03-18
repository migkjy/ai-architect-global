import { describe, it, expect } from "vitest";
import robots from "@/app/robots";

describe("Robots", () => {
  const config = robots();
  const rules = config.rules as Array<{
    userAgent: string;
    allow?: string | string[];
    disallow?: string | string[];
  }>;

  it("has rules array", () => {
    expect(Array.isArray(config.rules)).toBe(true);
    expect((config.rules as unknown[]).length).toBeGreaterThan(0);
  });

  it("default rule allows / and disallows /api/", () => {
    const defaultRule = rules.find((r) => r.userAgent === "*");
    expect(defaultRule).toBeDefined();
    expect(defaultRule!.allow).toBe("/");
    expect(defaultRule!.disallow).toContain("/api/");
  });

  it("allows AI crawlers explicitly (AEO)", () => {
    const aiAllowBots = [
      "GPTBot",
      "OAI-SearchBot",
      "ChatGPT-User",
      "ClaudeBot",
      "Claude-SearchBot",
      "anthropic-ai",
      "PerplexityBot",
      "Google-Extended",
      "Applebot-Extended",
      "CCBot",
      "cohere-ai",
    ];
    for (const bot of aiAllowBots) {
      const rule = rules.find((r) => r.userAgent === bot);
      expect(rule, `Rule for ${bot} should exist`).toBeDefined();
      expect(rule!.allow, `${bot} should have allow: "/"`).toBe("/");
      expect(rule!.disallow, `${bot} should NOT have disallow`).toBeUndefined();
    }
  });

  it("blocks Bytespider", () => {
    const rule = rules.find((r) => r.userAgent === "Bytespider");
    expect(rule).toBeDefined();
    expect(rule!.disallow).toBe("/");
  });

  it("disallows /ko and /ko/ paths", () => {
    const defaultRule = rules.find((r) => r.userAgent === "*");
    expect(defaultRule!.disallow).toContain("/ko");
    expect(defaultRule!.disallow).toContain("/ko/");
  });

  it("includes 4 sitemap URLs", () => {
    expect(config.sitemap).toBeDefined();
    const sitemaps = config.sitemap as string[];
    expect(sitemaps).toHaveLength(4);
    expect(sitemaps.some((s) => s.includes("sitemap.xml"))).toBe(true);
  });
});
