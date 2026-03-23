import { getAllPosts, getAllCategories, getAllTags, getPostsByLocale } from "@/lib/blog";
import Link from "next/link";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import BlogFilterClient from "@/components/blog/BlogFilterClient";

export const revalidate = 60; // 60초마다 재검증 — 예약 시각 도래 시 목록 자동 갱신

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com").trim();

const blogMeta: Record<string, { title: string; description: string; ogDescription: string }> = {
  en: {
    title: "AI Business Automation Blog | AI Native Playbook Series",
    description: "AI business automation guides, marketing playbook strategies, and prompt frameworks. Free resources for entrepreneurs building AI-native businesses. Read.",
    ogDescription: "Free AI business automation guides, marketing playbook strategies, and prompt frameworks for entrepreneurs scaling with AI-powered systems.",
  },
  ko: {
    title: "AI 비즈니스 블로그 | AI Native Playbook Series",
    description: "실용적인 AI 도구, 마케팅 자동화 전략, 비즈니스 성장 전술을 확인하세요. AI 프레임워크로 확장하려는 기업가를 위한 무료 가이드.",
    ogDescription: "기업가를 위한 무료 AI 도구, 마케팅 자동화 가이드, 비즈니스 성장 전략.",
  },
  ja: {
    title: "AIビジネスブログ | AI Native Playbook Series",
    description: "実践的なAIツール、マーケティング自動化戦略、ビジネス成長戦術をご紹介。AIフレームワークで事業を拡大したい起業家のための無料ガイド。",
    ogDescription: "起業家のための無料AIツール、マーケティング自動化ガイド、ビジネス成長戦略。",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const meta = blogMeta[locale] ?? blogMeta.en;
  const canonicalUrl = locale === "en" ? `${SITE_URL}/en/blog` : `${SITE_URL}/${locale}/blog`;
  return {
    title: meta.title,
    description: meta.description,
    keywords: [
      "AI native playbook blog",
      "AI architecture patterns",
      "AI architect",
      "AI business automation blog",
      "AI marketing playbook",
      "AI native business guide",
      "business automation with AI",
      "AI agent skills",
      "AI powered marketing framework",
      "AI marketing automation",
      "business growth strategies with AI",
      "AI tools for entrepreneurs",
      "AI sales funnel automation",
      "AI Native Playbook Series blog",
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/blog`,
        ja: `${SITE_URL}/ja/blog`,
        "x-default": `${SITE_URL}/en/blog`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.ogDescription,
      type: "website",
      url: canonicalUrl,
      siteName: "AI Native Playbook Series",
      locale: locale === "ko" ? "ko_KR" : locale === "ja" ? "ja_JP" : "en_US",
      images: [
        {
          url: locale === "en"
            ? `${SITE_URL}/blog/opengraph-image`
            : `${SITE_URL}/${locale}/blog/opengraph-image`,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.ogDescription,
      images: [
        locale === "en"
          ? `${SITE_URL}/blog/opengraph-image`
          : `${SITE_URL}/${locale}/blog/opengraph-image`,
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large" as const,
        "max-snippet": -1,
      },
    },
  };
}

function escapeJsonLd(json: string): string {
  return json.replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; tag?: string }>;
}) {
  const { locale } = await params;
  const { category: activeCategory = "", tag: activeTag = "" } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations("blog");
  // locale에 맞는 포스트만 표시 (일본어 포스트는 /ja/blog에서만, 영어 포스트는 /en/blog에서만)
  const posts = getPostsByLocale(locale);
  const categories = Array.from(new Set(posts.map((p) => p.category))).sort();
  const topTags = getAllTags();

  const canonicalUrl = locale === "en" ? `${SITE_URL}/en/blog` : `${SITE_URL}/${locale}/blog`;
  const dateLocale = locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en-US";

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": ["CollectionPage", "Blog"],
    name: "AI Business Blog | AI Native Playbook Series",
    description: "Practical AI tools, marketing automation, and business growth strategies for entrepreneurs and small business owners.",
    url: canonicalUrl,
    inLanguage: locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en-US",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: {
      "@type": "Organization",
      name: "AI Native Playbook Series",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
      },
    },
    hasPart: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      url: `${SITE_URL}/${locale}/blog/${post.slug}`,
      keywords: post.tags.join(", "),
      author: {
        "@type": "Organization",
        name: "AI Native Playbook Series",
        url: SITE_URL,
      },
      publisher: {
        "@type": "Organization",
        name: "AI Native Playbook Series",
        url: SITE_URL,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "AI Native Playbook Series", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/${locale}/blog` },
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
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-lg text-text-secondary">{t("subtitle")}</p>
        </div>

        <Suspense fallback={<div className="animate-pulse h-24 bg-white/5 rounded-xl mb-8" />}>
          <BlogFilterClient
            posts={posts}
            categories={categories}
            topTags={topTags}
            activeCategory={activeCategory}
            activeTag={activeTag}
            dateLocale={dateLocale}
          />
        </Suspense>

        {/* Product CTA */}
        <div className="mt-16 p-6 bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/20 rounded-2xl text-center">
          <h2 className="text-lg font-bold mb-2">Turn These Strategies into AI-Powered Action</h2>
          <p className="text-text-secondary text-sm mb-4">
            Get ready-to-use AI architecture patterns and system prompts that execute proven business frameworks automatically.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/bundle"
              className="inline-flex items-center justify-center px-6 py-3 bg-gold text-navy-dark rounded-xl font-bold text-sm hover:bg-gold-light transition-colors"
            >
              Get the Complete Bundle
            </Link>
            <Link
              href="/patterns"
              className="inline-flex items-center justify-center px-6 py-3 border border-white/10 rounded-xl font-semibold text-sm text-text-secondary hover:border-gold/30 hover:text-gold transition-all"
            >
              Explore AI Architecture Patterns
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-text-secondary mb-2">{t("weeklyFrameworks")}</p>
          <p className="text-xs text-text-muted">{t("subscriberCount")}</p>
        </div>

        {/* Category navigation for crawlers */}
        {categories.length > 0 && (
          <nav className="mt-8 pt-6 border-t border-white/10" aria-label="Blog categories">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-3 text-center">Browse by category</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => {
                const slug = encodeURIComponent(cat.toLowerCase().replace(/\s+/g, "-"));
                return (
                  <Link
                    key={cat}
                    href={`/blog/category/${slug}`}
                    className="px-4 py-2 rounded-full text-sm bg-white/5 text-text-secondary hover:bg-white/10 hover:text-white border border-white/10 transition-colors"
                  >
                    {cat}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}

        {/* Related pages */}
        <nav className="mt-8 pt-6 border-t border-white/10" aria-label="Related pages">
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/patterns" className="text-sm text-gold hover:text-gold-light transition-colors">AI Architecture Patterns</Link>
            <Link href="/products" className="text-sm text-gold hover:text-gold-light transition-colors">Products</Link>
            <Link href="/bundle" className="text-sm text-gold hover:text-gold-light transition-colors">Bundle</Link>
            <Link href="/free-guide" className="text-sm text-gold hover:text-gold-light transition-colors">Free Guide</Link>
            <Link href="/about" className="text-sm text-gold hover:text-gold-light transition-colors">About</Link>
            <Link href="/faq" className="text-sm text-gold hover:text-gold-light transition-colors">FAQ</Link>
          </div>
        </nav>
      </div>
    </>
  );
}
