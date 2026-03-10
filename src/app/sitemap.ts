import type { MetadataRoute } from "next";
import { books } from "@/lib/products";
import { getAllPosts } from "@/lib/blog";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";
const SITE_LAST_MODIFIED = new Date("2026-03-10");

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
    ja: localizedUrl("ja", path),
    "x-default": canonicalUrl(path),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const enBlogPosts = getAllPosts("en");
  const jaBlogPosts = getAllPosts("ja");

  type RouteEntry = {
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
    lastModified?: Date;
  };

  const staticRoutes: RouteEntry[] = [
    { path: "", changeFrequency: "weekly", priority: 1, lastModified: SITE_LAST_MODIFIED },
    { path: "products", changeFrequency: "weekly", priority: 0.9, lastModified: SITE_LAST_MODIFIED },
    { path: "bundle", changeFrequency: "weekly", priority: 0.9, lastModified: SITE_LAST_MODIFIED },
    { path: "about", changeFrequency: "monthly", priority: 0.6, lastModified: SITE_LAST_MODIFIED },
    { path: "faq", changeFrequency: "monthly", priority: 0.7, lastModified: SITE_LAST_MODIFIED },
    { path: "blog", changeFrequency: "weekly", priority: 0.8, lastModified: SITE_LAST_MODIFIED },
    { path: "terms", changeFrequency: "yearly", priority: 0.3, lastModified: SITE_LAST_MODIFIED },
    { path: "privacy", changeFrequency: "yearly", priority: 0.3, lastModified: SITE_LAST_MODIFIED },
    { path: "refund", changeFrequency: "yearly", priority: 0.3, lastModified: SITE_LAST_MODIFIED },
  ];

  const productRoutes: RouteEntry[] = books.map((book) => ({
    path: `products/${book.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
    lastModified: SITE_LAST_MODIFIED,
  }));

  const enBlogRoutes: RouteEntry[] = enBlogPosts.map((post) => ({
    path: `blog/${post.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    lastModified: new Date(post.date),
  }));

  const jaBlogRoutes: RouteEntry[] = jaBlogPosts.map((post) => ({
    path: `blog/${post.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    lastModified: new Date(post.date),
  }));

  const sharedRoutes = [...staticRoutes, ...productRoutes];
  const result: MetadataRoute.Sitemap = [];

  // 1. prefix 없는 영어 canonical URL (hreflang alternates 포함)
  for (const route of [...sharedRoutes, ...enBlogRoutes]) {
    result.push({
      url: canonicalUrl(route.path),
      lastModified: route.lastModified ?? SITE_LAST_MODIFIED,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: buildAlternates(route.path),
      },
    });
  }

  // 2. /en/ prefix URL — 영어 블로그만
  for (const route of [...sharedRoutes, ...enBlogRoutes]) {
    result.push({
      url: localizedUrl("en", route.path),
      lastModified: route.lastModified ?? SITE_LAST_MODIFIED,
      changeFrequency: route.changeFrequency,
      priority: Math.max(route.priority - 0.1, 0.1),
    });
  }

  // 3. /ja/ prefix URL — 일본어 블로그만
  for (const route of [...sharedRoutes, ...jaBlogRoutes]) {
    result.push({
      url: localizedUrl("ja", route.path),
      lastModified: route.lastModified ?? SITE_LAST_MODIFIED,
      changeFrequency: route.changeFrequency,
      priority: Math.max(route.priority - 0.1, 0.1),
    });
  }

  return result;
}
