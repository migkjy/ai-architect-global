import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl = locale === "en" ? `${SITE_URL}/blog` : `${SITE_URL}/${locale}/blog`;
  return {
    title: "AI Business Blog | AI Architect Series",
    description: "Discover practical AI tools, marketing automation strategies, and business growth tactics. Free guides for entrepreneurs who want to scale with AI frameworks.",
    keywords: [
      "AI business blog",
      "AI marketing automation",
      "business growth strategies",
      "AI tools for entrepreneurs",
      "sales funnel automation",
      "AI Architect Series blog",
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/blog`,
        ko: `${SITE_URL}/ko/blog`,
        ja: `${SITE_URL}/ja/blog`,
      },
    },
    openGraph: {
      title: "AI Business Blog | AI Architect Series",
      description: "Free AI tools, marketing automation guides, and business growth strategies for entrepreneurs who want to scale smarter.",
      type: "website",
      url: canonicalUrl,
      siteName: "AI Architect Series",
      locale: locale === "ko" ? "ko_KR" : locale === "ja" ? "ja_JP" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: "AI Business Blog | AI Architect Series",
      description: "Practical AI tools, marketing automation, and business growth strategies for entrepreneurs and small business owners.",
    },
  };
}

function escapeJsonLd(json: string): string {
  return json.replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("blog");
  const posts = getAllPosts();
  const canonicalUrl = locale === "en" ? `${SITE_URL}/blog` : `${SITE_URL}/${locale}/blog`;
  const dateLocale = locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en-US";

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI Business Blog | AI Architect Series",
    description: "Practical AI tools, marketing automation, and business growth strategies for entrepreneurs and small business owners.",
    url: canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: "AI Architect Series",
      url: SITE_URL,
    },
    hasPart: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      url: `${SITE_URL}/blog/${post.slug}`,
      author: {
        "@type": "Organization",
        name: "AI Architect Series",
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "AI Architect Series", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(collectionPageJsonLd)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(breadcrumbJsonLd)) }}
      />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-lg text-text-secondary">{t("subtitle")}</p>
        </div>
        <div className="grid gap-8">
          {posts.map((post) => (
            <article key={post.slug} className="border border-white/10 rounded-xl p-6 hover:border-gold/40 transition-colors">
              <div className="flex items-center gap-3 text-sm text-text-secondary mb-3">
                <time dateTime={post.date}>{new Date(post.date).toLocaleDateString(dateLocale, { year: "numeric", month: "long", day: "numeric" })}</time>
                <span>&middot;</span>
                <span>{post.readingTime}</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/blog/${post.slug}`} className="hover:text-gold transition-colors">{post.title}</Link>
              </h2>
              <p className="text-text-secondary mb-4">{post.description}</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs bg-gold/10 text-gold px-2 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-text-secondary mb-2">{t("weeklyFrameworks")}</p>
          <p className="text-xs text-text-muted">{t("subscriberCount")}</p>
        </div>
      </main>
    </>
  );
}
