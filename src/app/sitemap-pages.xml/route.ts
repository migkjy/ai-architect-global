import { NextResponse } from "next/server";
import { patterns } from "@/lib/patterns";

const BASE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com").trim();

// Freshness signal: pages are rebuilt every deploy, so lastmod tracks the
// deploy date instead of frozen hardcoded dates (which stalled the signal).
const BUILD_DATE = new Date().toISOString().split("T")[0];

// Static page paths (en prefix canonical). lastmod is derived from BUILD_DATE.
const STATIC_PAGES: string[] = [
  "",
  // English pages
  "en",
  "en/products",
  "en/pricing",
  "en/bundle",
  "en/about",
  "en/faq",
  "en/blog",
  "en/patterns",
  "en/free-guide",
  "en/score",
  "ja/score",
  "en/getting-started",
  "ja/getting-started",
  "en/skill-guide",
  "ja/skill-guide",
  "en/terms",
  "en/privacy",
  "en/refund",
  // Japanese pages
  "ja",
  "ja/pricing",
  "ja/about",
  "ja/faq",
  "ja/blog",
  "ja/free-guide",
  "ja/patterns",
  "ja/products",
  "ja/bundle",
  "ja/terms",
  "ja/privacy",
  "ja/refund",
];

function buildUrl(path: string): string {
  return path ? `${BASE_URL}/${path}` : BASE_URL;
}

function urlEntry(loc: string, lastmod: string): string {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
}

export function GET() {
  const enPatternEntries = patterns.map((p) =>
    urlEntry(buildUrl(`en/patterns/${p.slug}`), BUILD_DATE)
  );

  const jaPatternEntries = patterns.map((p) =>
    urlEntry(buildUrl(`ja/patterns/${p.slug}`), BUILD_DATE)
  );

  const staticEntries = STATIC_PAGES.map((path) =>
    urlEntry(buildUrl(path), BUILD_DATE)
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
