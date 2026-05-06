import { NextResponse } from "next/server";
import { books } from "@/lib/products";

const BASE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com").trim();

const PRODUCT_LASTMOD = "2026-03-08";

function urlEntry(loc: string, lastmod: string): string {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
}

export function GET() {
  const productEntries = books.flatMap((book) => [
    urlEntry(`${BASE_URL}/en/products/${book.slug}`, PRODUCT_LASTMOD),
    urlEntry(`${BASE_URL}/ja/products/${book.slug}`, PRODUCT_LASTMOD),
    urlEntry(`${BASE_URL}/en/products/${book.slug}/quick-start`, PRODUCT_LASTMOD),
    urlEntry(`${BASE_URL}/ja/products/${book.slug}/quick-start`, PRODUCT_LASTMOD),
  ]);

  const entries = productEntries.join("\n");

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
