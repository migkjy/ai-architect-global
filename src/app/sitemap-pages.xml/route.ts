import { NextResponse } from "next/server";
import { patterns } from "@/lib/patterns";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";

// Static pages with their last-modified dates (en prefix canonical)
const STATIC_PAGES: Array<{ path: string; lastmod: string }> = [
  { path: "", lastmod: "2026-03-08" },
  { path: "en", lastmod: "2026-03-08" },
  { path: "en/products", lastmod: "2026-03-08" },
  { path: "en/pricing", lastmod: "2026-03-11" },
  { path: "en/bundle", lastmod: "2026-03-08" },
  { path: "en/about", lastmod: "2026-03-01" },
  { path: "en/faq", lastmod: "2026-03-01" },
  { path: "en/blog", lastmod: "2026-03-10" },
  { path: "en/patterns", lastmod: "2026-03-11" },
  { path: "en/free-guide", lastmod: "2026-03-12" },
  { path: "en/terms", lastmod: "2025-01-01" },
  { path: "en/privacy", lastmod: "2025-01-01" },
  { path: "en/refund", lastmod: "2025-01-01" },
];

function buildUrl(path: string): string {
  return path ? `${BASE_URL}/${path}` : BASE_URL;
}

function urlEntry(loc: string, lastmod: string): string {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
}

export function GET() {
  const patternEntries = patterns.map((p) =>
    urlEntry(buildUrl(`en/patterns/${p.slug}`), "2026-03-11")
  );

  const staticEntries = STATIC_PAGES.map((page) =>
    urlEntry(buildUrl(page.path), page.lastmod)
  );

  const allEntries = [...staticEntries, ...patternEntries].join("\n");

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
