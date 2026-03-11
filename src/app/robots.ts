import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/admin/",
          "/thank-you",
          "/og-image",
          "/ko",
          "/ko/",
        ],
      },
      {
        // AhrefsBot crawl budget — limit to avoid heavy crawling
        userAgent: "AhrefsBot",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/sitemap/0.xml`,
      `${SITE_URL}/sitemap/1.xml`,
      `${SITE_URL}/sitemap/2.xml`,
    ],
    host: SITE_URL,
  };
}
