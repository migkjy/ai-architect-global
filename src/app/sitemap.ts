import type { MetadataRoute } from "next";
import { books } from "@/lib/products";
import { getAllPosts } from "@/lib/blog";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";

// 로캘 prefix 없는 영어 canonical URL
function canonicalUrl(path: string): string {
  return path ? `${BASE_URL}/${path}` : BASE_URL;
}

// 로캘 prefix URL (en 포함)
function localizedUrl(locale: string, path: string): string {
  return path ? `${BASE_URL}/${locale}/${path}` : `${BASE_URL}/${locale}`;
}

// hreflang alternates — 영어는 prefix 없는 canonical + /en/ 둘 다 포함
function buildAlternates(path: string): Record<string, string> {
  return {
    en: localizedUrl("en", path),
    ko: localizedUrl("ko", path),
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
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "products", changeFrequency: "weekly", priority: 0.9 },
    { path: "bundle", changeFrequency: "weekly", priority: 0.9 },
    { path: "about", changeFrequency: "monthly", priority: 0.6 },
    { path: "faq", changeFrequency: "monthly", priority: 0.7 },
    { path: "blog", changeFrequency: "weekly", priority: 0.8 },
    { path: "terms", changeFrequency: "yearly", priority: 0.3 },
    { path: "privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "refund", changeFrequency: "yearly", priority: 0.3 },
  ];

  const productRoutes: RouteEntry[] = books.map((book) => ({
    path: `products/${book.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogRoutes: RouteEntry[] = blogPosts.map((post) => ({
    path: `blog/${post.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    lastModified: new Date(post.date),
  }));

  const allRoutes = [...staticRoutes, ...productRoutes, ...blogRoutes];
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

  // 2. /en/, /ko/, /ja/ 로캘 prefix URL
  for (const locale of ["en", "ko", "ja"] as const) {
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
