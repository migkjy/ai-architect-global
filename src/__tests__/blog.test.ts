import { describe, it, expect } from "vitest";
import {
  getAllPosts,
  getPostBySlug,
  getPostsByCategory,
  getAllCategories,
  getAllTags,
} from "@/lib/blog";

describe("Blog", () => {
  it("getAllPosts returns an array", () => {
    const posts = getAllPosts();
    expect(Array.isArray(posts)).toBe(true);
  });

  it("getAllPosts returns non-empty array (content/blog has .md files)", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
  });

  it("posts are sorted by date descending", () => {
    const posts = getAllPosts();
    for (let i = 1; i < posts.length; i++) {
      const prev = new Date(posts[i - 1].date).getTime();
      const curr = new Date(posts[i].date).getTime();
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });

  it("all posts have required fields", () => {
    const posts = getAllPosts();
    for (const post of posts) {
      expect(post.slug).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(typeof post.description).toBe("string");
      expect(typeof post.date).toBe("string");
      expect(Array.isArray(post.tags)).toBe(true);
      expect(typeof post.category).toBe("string");
      expect(typeof post.readingTime).toBe("string");
    }
  });

  it("getPostBySlug finds a known post", () => {
    const posts = getAllPosts();
    if (posts.length === 0) return;
    const slug = posts[0].slug;
    const post = getPostBySlug(slug);
    expect(post).not.toBeNull();
    expect(post!.slug).toBe(slug);
    expect(typeof post!.content).toBe("string");
    expect(post!.content.length).toBeGreaterThan(0);
  });

  it("getPostBySlug returns null for invalid slug", () => {
    const post = getPostBySlug("this-slug-definitely-does-not-exist-xyz");
    expect(post).toBeNull();
  });

  it("getPostBySlug returns content field (not in getAllPosts)", () => {
    const posts = getAllPosts();
    if (posts.length === 0) return;
    const full = getPostBySlug(posts[0].slug);
    expect(full).toHaveProperty("content");
    // getAllPosts omits content
    expect(posts[0]).not.toHaveProperty("content");
  });

  it("getAllCategories returns sorted array of strings", () => {
    const categories = getAllCategories();
    expect(Array.isArray(categories)).toBe(true);
    for (const cat of categories) {
      expect(typeof cat).toBe("string");
    }
    const sorted = [...categories].sort();
    expect(categories).toEqual(sorted);
  });

  it("getAllTags returns at most 10 tags", () => {
    const tags = getAllTags();
    expect(Array.isArray(tags)).toBe(true);
    expect(tags.length).toBeLessThanOrEqual(10);
    for (const tag of tags) {
      expect(typeof tag).toBe("string");
    }
  });

  it("getPostsByCategory filters correctly", () => {
    const categories = getAllCategories();
    if (categories.length === 0) return;
    const cat = categories[0];
    const filtered = getPostsByCategory(cat);
    expect(filtered.length).toBeGreaterThan(0);
    for (const post of filtered) {
      expect(post.category).toBe(cat);
    }
  });

  it("getPostsByCategory returns empty array for unknown category", () => {
    const filtered = getPostsByCategory("__nonexistent_category__");
    expect(filtered).toEqual([]);
  });
});
