import type { MetadataRoute } from "next";
import { books } from "@/lib/products";
import { getAllPosts } from "@/lib/blog";
import { patterns } from "@/lib/patterns";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";

// 로캘 prefix 없는 영어 canonical URL
function canonicalUrl(path: string): string {
  return path ? `${BASE_URL}/${path}` : BASE_URL;
}

// 로캘 prefix URL (en 포함)
function localizedUrl(locale: string, path: string): string {
  return path ? `${BASE_URL}/${locale}/${path}` : `${BASE_URL}/${locale}`;
}

// hreflang alternates — /ko 는 301 리다이렉트로 차단되어 있으므로 제외
// CEO 지시: richbukae 가격 충돌 방지를 위해 /ko 접근 차단 유지
function buildAlternates(path: string): Record<string, string> {
  return {
    en: localizedUrl("en", path),
    ja: localizedUrl("ja", path),
    "x-default": canonicalUrl(path),
  };
}

type RouteEntry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
  lastModified?: Date;
};

function getAllRoutes(): RouteEntry[] {
  const blogPosts = getAllPosts();

  const staticRoutes: RouteEntry[] = [
    { path: "", changeFrequency: "monthly", priority: 1, lastModified: new Date("2026-03-08") },
    { path: "products", changeFrequency: "monthly", priority: 0.9, lastModified: new Date("2026-03-08") },
    { path: "pricing", changeFrequency: "monthly", priority: 0.9, lastModified: new Date("2026-03-11") },
    { path: "bundle", changeFrequency: "monthly", priority: 0.9, lastModified: new Date("2026-03-08") },
    { path: "about", changeFrequency: "monthly", priority: 0.6, lastModified: new Date("2026-03-01") },
    { path: "faq", changeFrequency: "monthly", priority: 0.7, lastModified: new Date("2026-03-01") },
    { path: "blog", changeFrequency: "weekly", priority: 0.8, lastModified: new Date("2026-03-10") },
    { path: "patterns", changeFrequency: "monthly", priority: 0.8, lastModified: new Date("2026-03-11") },
    { path: "free-guide", changeFrequency: "monthly", priority: 0.7, lastModified: new Date("2026-03-12") },
    { path: "terms", changeFrequency: "yearly", priority: 0.3, lastModified: new Date("2025-01-01") },
    { path: "privacy", changeFrequency: "yearly", priority: 0.3, lastModified: new Date("2025-01-01") },
    { path: "refund", changeFrequency: "yearly", priority: 0.3, lastModified: new Date("2025-01-01") },
  ];

  const productRoutes: RouteEntry[] = books.map((book) => ({
    path: `products/${book.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
    lastModified: new Date("2026-03-08"),
  }));

  const blogRoutes: RouteEntry[] = blogPosts.map((post) => ({
    path: `blog/${post.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    lastModified: new Date(post.date),
  }));

  const patternRoutes: RouteEntry[] = patterns.map((p) => ({
    path: `patterns/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
    lastModified: new Date("2026-03-11"),
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes, ...patternRoutes];
}

// Next.js가 자동으로 /sitemap.xml을 sitemap index로 생성
// /sitemap/0.xml = canonical URLs (hreflang alternates 포함)
// /sitemap/1.xml = /en/ prefix URLs
// /sitemap/2.xml = /ja/ prefix URLs
export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }];
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const allRoutes = getAllRoutes();

  if (id === 0) {
    // Canonical URLs (prefix 없는 영어) + hreflang alternates
    return allRoutes.map((route) => ({
      url: canonicalUrl(route.path),
      lastModified: route.lastModified ?? new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: buildAlternates(route.path),
      },
    }));
  }

  // id 1 = en, id 2 = ja
  const locale = id === 1 ? "en" : "ja";
  return allRoutes.map((route) => ({
    url: localizedUrl(locale, route.path),
    lastModified: route.lastModified ?? new Date(),
    changeFrequency: route.changeFrequency,
    priority: Math.max(route.priority - 0.1, 0.1),
  }));
}
