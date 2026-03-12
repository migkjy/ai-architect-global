import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  readingTime: string;
  content: string;
}

export function getAllPosts(): Omit<BlogPost, "content">[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { data } = matter(raw);
      const stats = readingTime(raw);
      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        date: data.date ?? "",
        tags: data.tags ?? [],
        category: data.category ?? "General",
        readingTime: stats.text,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(raw);
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? "",
    tags: data.tags ?? [],
    category: data.category ?? "General",
    readingTime: stats.text,
    content,
  };
}

export function getPostsByCategory(category: string): Omit<BlogPost, "content">[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = Array.from(new Set(posts.map((p) => p.category)));
  return categories.sort();
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagCounts: Record<string, number> = {};
  for (const post of posts) {
    for (const tag of post.tags) {
      tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
    }
  }
  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);
}

export function getPostsByTag(tag: string): Omit<BlogPost, "content">[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}

/**
 * Returns related posts using category+tag composite scoring.
 * Priority: same category AND shares tags > same category only > shares tags only.
 * Falls back to any other posts if no match found.
 */
export function getRelatedPosts(
  slug: string,
  category: string,
  tags: string[],
  limit: number = 3
): Omit<BlogPost, "content">[] {
  const all = getAllPosts().filter((p) => p.slug !== slug);

  const scored = all.map((post) => {
    const sameCategory = post.category === category;
    const sharedTagCount = post.tags.filter((t) => tags.includes(t)).length;
    // Scoring: same category = 10pts, each shared tag = 2pts
    const score = (sameCategory ? 10 : 0) + sharedTagCount * 2;
    return { post, score };
  });

  // Sort by score descending, then date descending
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
  });

  const matched = scored.filter((s) => s.score > 0).map((s) => s.post);

  if (matched.length >= limit) {
    return matched.slice(0, limit);
  }

  // Fallback: include recent posts if not enough matches
  const matchedSlugs = new Set(matched.map((p) => p.slug));
  const fallback = all.filter((p) => !matchedSlugs.has(p.slug)).slice(0, limit - matched.length);
  return [...matched, ...fallback].slice(0, limit);
}
