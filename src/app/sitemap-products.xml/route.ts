import { NextResponse } from "next/server";
import { books } from "@/lib/products";

const BASE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com").trim();

const PRODUCT_LASTMOD = "2026-03-08";

function urlEntry(loc: string, lastmod: string): string {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
}

export function GET() {
  const entries = books
    .map((book) =>
      urlEntry(`${BASE_URL}/en/products/${book.slug}`, PRODUCT_LASTMOD)
    )
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
