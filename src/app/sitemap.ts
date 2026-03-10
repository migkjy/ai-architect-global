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

export default function sitemap(): MetadataRoute.Sitemap {
  const blogPosts = getAllPosts();

  type RouteEntry = {
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
    lastModified?: Date;
  };

  const staticRoutes: RouteEntry[] = [
    { path: "", changeFrequency: "monthly", priority: 1, lastModified: new Date("2026-03-08") },
    { path: "products", changeFrequency: "monthly", priority: 0.9, lastModified: new Date("2026-03-08") },
    { path: "bundle", changeFrequency: "monthly", priority: 0.9, lastModified: new Date("2026-03-08") },
    { path: "about", changeFrequency: "monthly", priority: 0.6, lastModified: new Date("2026-03-01") },
    { path: "faq", changeFrequency: "monthly", priority: 0.7, lastModified: new Date("2026-03-01") },
    { path: "blog", changeFrequency: "weekly", priority: 0.8, lastModified: new Date("2026-03-10") },
    { path: "patterns", changeFrequency: "monthly", priority: 0.8, lastModified: new Date("2026-03-11") },
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

  const allRoutes = [...staticRoutes, ...productRoutes, ...blogRoutes, ...patternRoutes];
  const result: MetadataRoute.Sitemap = [];

  // 1. prefix 없는 영어 canonical URL (hreflang alternates 포함)
  for (const route of allRoutes) {
    result.push({
      url: canonicalUrl(route.path),
      lastModified: route.lastModified ?? new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: buildAlternates(route.path),
      },
    });
  }

  // 2. /en/, /ja/ 로캘 prefix URL (/ko 제외 — 301 리다이렉트 차단)
  for (const locale of ["en", "ja"] as const) {
    for (const route of allRoutes) {
      result.push({
        url: localizedUrl(locale, route.path),
        lastModified: route.lastModified ?? new Date(),
        changeFrequency: route.changeFrequency,
        // 로캘 prefix URL은 canonical보다 낮은 priority
        priority: Math.max(route.priority - 0.1, 0.1),
      });
    }
  }

  return result;
}
