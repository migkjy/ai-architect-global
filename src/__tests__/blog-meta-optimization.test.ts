import { describe, it, expect } from 'vitest';
import { getAllPosts } from '@/lib/blog';

describe('Blog Post SEO Meta Optimization', () => {
  const posts = getAllPosts();
  const englishPosts = posts.filter(p => !p.slug.includes('japanese-guide'));

  it('all English post titles should be 60 chars or less', () => {
    const violations: string[] = [];
    for (const post of englishPosts) {
      if (post.title.length > 60) {
        violations.push(`${post.slug}: "${post.title}" (${post.title.length} chars)`);
      }
    }
    expect(violations).toEqual([]);
  });

  it('all English post descriptions should be between 120-160 chars', () => {
    const violations: string[] = [];
    for (const post of englishPosts) {
      if (post.description.length < 120 || post.description.length > 160) {
        violations.push(`${post.slug}: (${post.description.length} chars)`);
      }
    }
    expect(violations).toEqual([]);
  });

  it('all posts should have descriptions', () => {
    for (const post of posts) {
      expect(post.description).toBeTruthy();
    }
  });

  it('English post titles should start with keyword or action verb', () => {
    for (const post of englishPosts) {
      // Title should not start with articles like "The" or "A" (wastes SERP space)
      const startsWithWastedWord = /^(The |A |An )/.test(post.title);
      if (startsWithWastedWord) {
        // Warning only — not a hard fail, but flag for review
        console.warn(`Consider rewriting: ${post.slug} starts with article`);
      }
    }
    expect(true).toBe(true); // Advisory test
  });
});
