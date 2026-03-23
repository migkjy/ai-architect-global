import { NextResponse } from "next/server";

const BASE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com").trim();

const BUILD_DATE = new Date().toISOString();

const SUB_SITEMAPS = [
  `${BASE_URL}/sitemap-pages.xml`,
  `${BASE_URL}/sitemap-blog.xml`,
  `${BASE_URL}/sitemap-products.xml`,
];

export function GET() {
  const entries = SUB_SITEMAPS.map(
    (loc) =>
      `  <sitemap>\n    <loc>${loc}</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n  </sitemap>`
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
