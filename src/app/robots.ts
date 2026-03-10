import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/ko/", "/thank-you"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
