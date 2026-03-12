import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";

function urlEntry(loc: string, lastmod: string): string {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
}

export function GET() {
  const posts = getAllPosts();

  const entries = posts
    .map((post) => {
      const lastmod = post.date
        ? new Date(post.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      return urlEntry(`${BASE_URL}/en/blog/${post.slug}`, lastmod);
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
