import { NextResponse } from "next/server";
import { getAllPosts, getAllCategories, getAllTags } from "@/lib/blog";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";

function urlEntry(
  loc: string,
  lastmod: string,
  changefreq: string,
  priority: string
): string {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export function GET() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const tags = getAllTags();

  const today = new Date().toISOString().split("T")[0];

  // Blog index entry
  const indexEntry = urlEntry(`${BASE_URL}/en/blog`, today, "daily", "0.9");

  // Individual blog post entries
  const postEntries = posts
    .map((post) => {
      const lastmod = post.date
        ? new Date(post.date).toISOString().split("T")[0]
        : today;
      return urlEntry(
        `${BASE_URL}/en/blog/${post.slug}`,
        lastmod,
        "weekly",
        "0.8"
      );
    })
    .join("\n");

  // Category page entries
  const categoryEntries = categories
    .map((cat) => {
      const slug = encodeURIComponent(cat.toLowerCase().replace(/\s+/g, "-"));
      return urlEntry(
        `${BASE_URL}/en/blog/category/${slug}`,
        today,
        "weekly",
        "0.7"
      );
    })
    .join("\n");

  // Tag page entries
  const tagEntries = tags
    .map((tag) => {
      const slug = encodeURIComponent(tag.toLowerCase().replace(/\s+/g, "-"));
      return urlEntry(
        `${BASE_URL}/en/blog/tag/${slug}`,
        today,
        "weekly",
        "0.6"
      );
    })
    .join("\n");

  // Japanese locale entries for Japanese posts (/ja/blog/{slug})
  const japanesePosts = posts.filter(p => p.slug.includes('japanese-guide'));
  const japaneseEntries = japanesePosts
    .map((post) => {
      const lastmod = post.date
        ? new Date(post.date).toISOString().split("T")[0]
        : today;
      return urlEntry(
        `${BASE_URL}/ja/blog/${post.slug}`,
        lastmod,
        "weekly",
        "0.7"
      );
    })
    .join("\n");

  const allEntries = [indexEntry, postEntries, japaneseEntries, categoryEntries, tagEntries]
    .filter(Boolean)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
