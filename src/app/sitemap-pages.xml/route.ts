import { NextResponse } from "next/server";
import { patterns } from "@/lib/patterns";

const BASE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com").trim();

// Static pages with their last-modified dates (en prefix canonical)
const STATIC_PAGES: Array<{ path: string; lastmod: string }> = [
  { path: "", lastmod: "2026-03-08" },
  // English pages
  { path: "en", lastmod: "2026-03-08" },
  { path: "en/products", lastmod: "2026-03-08" },
  { path: "en/pricing", lastmod: "2026-03-11" },
  { path: "en/bundle", lastmod: "2026-03-08" },
  { path: "en/about", lastmod: "2026-03-01" },
  { path: "en/faq", lastmod: "2026-03-01" },
  { path: "en/blog", lastmod: "2026-03-10" },
  { path: "en/patterns", lastmod: "2026-03-11" },
  { path: "en/free-guide", lastmod: "2026-03-12" },
  { path: "en/score", lastmod: "2026-03-25" },
  { path: "ja/score", lastmod: "2026-03-25" },
  { path: "en/getting-started", lastmod: "2026-03-08" },
  { path: "ja/getting-started", lastmod: "2026-03-26" },
  { path: "en/skill-guide", lastmod: "2026-03-08" },
  { path: "ja/skill-guide", lastmod: "2026-03-26" },
  { path: "en/terms", lastmod: "2025-01-01" },
  { path: "en/privacy", lastmod: "2025-01-01" },
  { path: "en/refund", lastmod: "2025-01-01" },
  // Japanese pages
  { path: "ja", lastmod: "2026-03-26" },
  { path: "ja/pricing", lastmod: "2026-03-26" },
  { path: "ja/about", lastmod: "2026-03-26" },
  { path: "ja/faq", lastmod: "2026-03-26" },
  { path: "ja/blog", lastmod: "2026-03-26" },
  { path: "ja/free-guide", lastmod: "2026-03-26" },
  { path: "ja/patterns", lastmod: "2026-03-26" },
  { path: "ja/products", lastmod: "2026-03-26" },
  { path: "ja/bundle", lastmod: "2026-03-26" },
  { path: "ja/terms", lastmod: "2026-03-26" },
  { path: "ja/privacy", lastmod: "2026-03-26" },
  { path: "ja/refund", lastmod: "2026-03-26" },
];

function buildUrl(path: string): string {
  return path ? `${BASE_URL}/${path}` : BASE_URL;
}

function urlEntry(loc: string, lastmod: string): string {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
}

export function GET() {
  const enPatternEntries = patterns.map((p) =>
    urlEntry(buildUrl(`en/patterns/${p.slug}`), "2026-03-11")
  );

  const jaPatternEntries = patterns.map((p) =>
    urlEntry(buildUrl(`ja/patterns/${p.slug}`), "2026-03-26")
  );

  const staticEntries = STATIC_PAGES.map((page) =>
    urlEntry(buildUrl(page.path), page.lastmod)
  );

  const allEntries = [...staticEntries, ...enPatternEntries, ...jaPatternEntries].join("\n");

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
