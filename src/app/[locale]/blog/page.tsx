import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";

const blogMeta: Record<string, { title: string; description: string; ogDescription: string }> = {
  en: {
    title: "AI Business Automation Blog | AI Native Playbook Series",
    description: "Practical guides on AI business automation, AI marketing playbook strategies, and AI agent skills. Free frameworks for entrepreneurs building AI-native businesses.",
    ogDescription: "Free AI business automation guides, AI marketing playbook strategies, and AI agent skills for entrepreneurs who want to scale with AI-powered frameworks.",
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
  const canonicalUrl = locale === "en" ? `${SITE_URL}/blog` : `${SITE_URL}/${locale}/blog`;
  return {
    title: meta.title,
    description: meta.description,
    keywords: [
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
        en: `${SITE_URL}/blog`,
        ja: `${SITE_URL}/ja/blog`,
        "x-default": `${SITE_URL}/blog`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.ogDescription,
      type: "website",
      url: canonicalUrl,
      siteName: "AI Native Playbook Series",
      locale: locale === "ko" ? "ko_KR" : locale === "ja" ? "ja_JP" : "en_US",
      images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.ogDescription,
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
  const posts = getAllPosts(locale);
  const canonicalUrl = locale === "en" ? `${SITE_URL}/blog` : `${SITE_URL}/${locale}/blog`;
  const dateLocale = locale === "ja" ? "ja-JP" : "en-US";

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
      url: `${SITE_URL}/blog/${post.slug}`,
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
        {/* Product CTA */}
        <div className="mt-16 p-6 bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/20 rounded-2xl text-center">
          <h2 className="text-lg font-bold mb-2">Turn These Strategies into AI-Powered Action</h2>
          <p className="text-text-secondary text-sm mb-4">
            Get ready-to-use AI system prompts that execute proven business frameworks automatically.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/bundle"
              className="inline-flex items-center justify-center px-6 py-3 bg-gold text-navy-dark rounded-xl font-bold text-sm hover:bg-gold-light transition-colors"
            >
              Get the Complete Bundle
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 border border-white/10 rounded-xl font-semibold text-sm text-text-secondary hover:border-gold/30 hover:text-gold transition-all"
            >
              Browse Individual Books
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-text-secondary mb-2">{t("weeklyFrameworks")}</p>
          <p className="text-xs text-text-muted">{t("subscriberCount")}</p>
        </div>

        {/* Related pages */}
        <nav className="mt-8 pt-6 border-t border-white/10" aria-label="Related pages">
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/products" className="text-sm text-gold hover:text-gold-light transition-colors">Products</Link>
            <Link href="/bundle" className="text-sm text-gold hover:text-gold-light transition-colors">Bundle</Link>
            <Link href="/about" className="text-sm text-gold hover:text-gold-light transition-colors">About</Link>
            <Link href="/faq" className="text-sm text-gold hover:text-gold-light transition-colors">FAQ</Link>
          </div>
        </nav>
      </main>
    </>
  );
}
