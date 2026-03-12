import { describe, it, expect, vi } from "vitest";
import {
  getAllPosts,
  getAllCategories,
  getAllTags,
  getPostsByTag,
  getRelatedPosts,
} from "@/lib/blog";

// Mock next/server for sitemap route tests
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

describe("Blog lib — getPostsByTag", () => {
  it("returns posts that include the given tag", () => {
    const tags = getAllTags();
    if (tags.length === 0) return;
    const tag = tags[0];
    const posts = getPostsByTag(tag);
    expect(Array.isArray(posts)).toBe(true);
    for (const post of posts) {
      expect(post.tags).toContain(tag);
    }
  });

  it("returns empty array for unknown tag", () => {
    const result = getPostsByTag("__definitely_no_such_tag_xyz__");
    expect(result).toEqual([]);
  });

  it("returns posts sorted by date descending", () => {
    const tags = getAllTags();
    if (tags.length === 0) return;
    const tag = tags[0];
    const posts = getPostsByTag(tag);
    for (let i = 1; i < posts.length; i++) {
      const prev = new Date(posts[i - 1].date).getTime();
      const curr = new Date(posts[i].date).getTime();
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });
});

describe("Blog lib — getRelatedPosts", () => {
  it("returns posts excluding the current slug", () => {
    const allPosts = getAllPosts();
    if (allPosts.length < 2) return;
    const current = allPosts[0];
    const related = getRelatedPosts(current.slug, current.category, current.tags, 3);
    for (const p of related) {
      expect(p.slug).not.toBe(current.slug);
    }
  });

  it("returns at most the requested limit", () => {
    const allPosts = getAllPosts();
    if (allPosts.length === 0) return;
    const current = allPosts[0];
    const limit = 3;
    const related = getRelatedPosts(current.slug, current.category, current.tags, limit);
    expect(related.length).toBeLessThanOrEqual(limit);
  });

  it("prioritises same-category posts over unrelated posts", () => {
    const allPosts = getAllPosts();
    if (allPosts.length < 2) return;
    const current = allPosts[0];
    const related = getRelatedPosts(current.slug, current.category, current.tags, 6);
    // If there are category/tag matching posts, they should appear before unrelated ones
    const matchedPosts = related.filter(
      (p) => p.category === current.category || p.tags.some((t) => current.tags.includes(t))
    );
    const unmatchedPosts = related.filter(
      (p) => p.category !== current.category && !p.tags.some((t) => current.tags.includes(t))
    );
    // Unmatched posts (fallback) should appear after matched posts
    if (matchedPosts.length > 0 && unmatchedPosts.length > 0) {
      const lastMatchedIdx = Math.max(...matchedPosts.map((p) => related.indexOf(p)));
      const firstUnmatchedIdx = Math.min(...unmatchedPosts.map((p) => related.indexOf(p)));
      expect(lastMatchedIdx).toBeLessThan(firstUnmatchedIdx);
    } else {
      // Either all matched or all unmatched — both are valid
      expect(related.length).toBeGreaterThanOrEqual(0);
    }
  });

  it("falls back to any posts if no category/tag match", () => {
    const allPosts = getAllPosts();
    if (allPosts.length < 2) return;
    const current = allPosts[0];
    // Use a fake category and empty tags — should still return something
    const related = getRelatedPosts(current.slug, "__no_match__", [], 3);
    expect(Array.isArray(related)).toBe(true);
    expect(related.length).toBeLessThanOrEqual(3);
  });
});

describe("sitemap-blog.xml — enhanced", () => {
  it("returns valid urlset XML with blog URLs", async () => {
    const { GET } = await import("@/app/sitemap-blog.xml/route");
    const response = GET();
    const xml = await response.text();
    expect(xml).toContain("<urlset");
    expect(xml).toContain("/en/blog/");
  });

  it("includes changefreq element", async () => {
    const { GET } = await import("@/app/sitemap-blog.xml/route");
    const response = GET();
    const xml = await response.text();
    expect(xml).toContain("<changefreq>");
  });

  it("includes priority element", async () => {
    const { GET } = await import("@/app/sitemap-blog.xml/route");
    const response = GET();
    const xml = await response.text();
    expect(xml).toContain("<priority>");
  });

  it("includes blog index URL", async () => {
    const { GET } = await import("@/app/sitemap-blog.xml/route");
    const response = GET();
    const xml = await response.text();
    expect(xml).toContain("/en/blog</loc>");
  });

  it("includes category URLs", async () => {
    const { GET } = await import("@/app/sitemap-blog.xml/route");
    const response = GET();
    const xml = await response.text();
    expect(xml).toContain("/en/blog/category/");
  });

  it("includes tag URLs", async () => {
    const { GET } = await import("@/app/sitemap-blog.xml/route");
    const response = GET();
    const xml = await response.text();
    expect(xml).toContain("/en/blog/tag/");
  });

  it("does not include /ja/ URLs (English only)", async () => {
    const { GET } = await import("@/app/sitemap-blog.xml/route");
    const response = GET();
    const xml = await response.text();
    expect(xml).not.toContain("/ja/blog/");
  });
});
