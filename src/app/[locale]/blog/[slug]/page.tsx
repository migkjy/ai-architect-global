import { getPostBySlug, getAllPosts, getRelatedPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { books } from "@/lib/products";
import BlogInlineCTA from "@/components/BlogInlineCTA";
import { splitContentAtMidpoint } from "@/lib/blog-content-utils";

export function generateStaticParams() {
  const posts = getAllPosts();
  return routing.locales.flatMap((locale) =>
    posts.map((p) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com").trim();
  const canonicalUrl = `${siteUrl}/blog/${slug}`;

  return {
    title: post.title,
    description: post.description,
    keywords: [
      ...post.tags,
      "AI business automation",
      "AI marketing playbook",
      "AI native business guide",
      "business automation with AI",
      "AI Native Playbook Series",
    ],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.date,
      url: canonicalUrl,
      locale: locale === "ko" ? "ko_KR" : locale === "ja" ? "ja_JP" : "en_US",
      siteName: "AI Native Playbook Series",
      images: [
        {
          url: locale === "en"
            ? `${siteUrl}/blog/${slug}/opengraph-image`
            : `${siteUrl}/${locale}/blog/${slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${post.title} | AI Native Playbook Series`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [
        locale === "en"
          ? `${siteUrl}/blog/${slug}/opengraph-image`
          : `${siteUrl}/${locale}/blog/${slug}/opengraph-image`,
      ],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${siteUrl}/blog/${slug}`,
        ja: `${siteUrl}/ja/blog/${slug}`,
        "x-default": canonicalUrl,
      },
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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blogCta");

  const post = getPostBySlug(slug);
  if (!post) notFound();

  // Category + tag composite matching for related posts
  const otherPosts = getRelatedPosts(slug, post.category, post.tags, 3);

  const TAG_TO_PRODUCT_SLUG: Record<string, string> = {
    "Russell Brunson": "ai-marketing-architect",
    "DotCom Secrets": "ai-marketing-architect",
    "AI funnel": "ai-marketing-architect",
    "Expert Secrets": "ai-brand-architect",
    "Jeff Walker": "ai-launch-architect",
    "Product Launch Formula": "ai-launch-architect",
    "Jim Edwards": "ai-copywriting-architect",
    "Copywriting Secrets": "ai-copywriting-architect",
    "Nicolas Cole": "ai-content-architect",
    "online writing": "ai-content-architect",
    "AI marketing": "ai-marketing-architect",
    "marketing automation": "ai-marketing-architect",
    "email marketing": "ai-marketing-architect",
  };
  const matchedSlugs = new Set<string>();
  post.tags.forEach((tag) => {
    const productSlug = TAG_TO_PRODUCT_SLUG[tag];
    if (productSlug) matchedSlugs.add(productSlug);
  });
  const relatedProducts = books.filter((b) => matchedSlugs.has(b.slug)).slice(0, 2);

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com").trim();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    image: {
      "@type": "ImageObject",
      url: locale === "en"
        ? `${siteUrl}/blog/${slug}/opengraph-image`
        : `${siteUrl}/${locale}/blog/${slug}/opengraph-image`,
      width: 1200,
      height: 630,
    },
    url: `${siteUrl}/blog/${slug}`,
    inLanguage: locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en-US",
    author: {
      "@type": "Organization",
      name: "AI Native Playbook Series",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "AI Native Playbook Series",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${slug}`,
    },
    keywords: post.tags.join(", "),
    wordCount: Math.round(post.content.split(/\s+/).length),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "AI Native Playbook Series", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${siteUrl}/blog/${slug}` },
    ],
  };

  function escapeJsonLd(json: string): string {
    return json.replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(articleJsonLd)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(breadcrumbJsonLd)) }}
      />
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-8">
        <Link href="/blog" className="text-gold hover:underline text-sm">← Back to Blog</Link>
      </div>
      <article>
        <header className="mb-8">
          <div className="flex items-center gap-3 text-sm text-text-secondary mb-4">
            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <p className="text-lg text-text-secondary">{post.description}</p>
        </header>
        {(() => {
          const { before, after } = splitContentAtMidpoint(post.content);
          const markdownComponents: Components = {
            img: ({ src, alt }) => {
              const srcStr = typeof src === "string" ? src : "";
              const fallbackAlt = srcStr
                ? srcStr.split("/").pop()?.replace(/[-_]/g, " ").replace(/\.\w+$/, "") || "article image"
                : "article image";
              if (!srcStr) return null;
              return (
                <span className="block relative w-full my-6" style={{ aspectRatio: "16/9" }}>
                  <Image
                    src={srcStr}
                    alt={alt || fallbackAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 700px"
                    className="object-contain rounded-lg"
                    loading="lazy"
                  />
                </span>
              );
            },
          };

          return (
            <>
              <div className="prose prose-invert prose-gold max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {before}
                </ReactMarkdown>
              </div>

              {after && <BlogInlineCTA locale={locale} />}

              {after && (
                <div className="prose prose-invert prose-gold max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {after}
                  </ReactMarkdown>
                </div>
              )}
            </>
          );
        })()}
      </article>
      {/* Product CTA */}
      <div className="mt-12 p-6 bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/20 rounded-2xl">
        <h3 className="text-lg font-bold mb-2">Ready to Execute These Frameworks with AI?</h3>
        <p className="text-text-secondary text-sm mb-4">
          The AI Native Playbook Series gives you ready-to-use system prompts that turn these strategies into actionable AI workflows for your business.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/bundle"
            className="inline-flex items-center justify-center px-6 py-3 bg-gold text-navy-dark rounded-xl font-bold text-sm hover:bg-gold-light transition-colors"
          >
            Get All 6 Books — $47
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 border border-white/10 rounded-xl font-semibold text-sm text-text-secondary hover:border-gold/30 hover:text-gold transition-all"
          >
            View Individual Books
          </Link>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-6 space-y-3">
          <p className="text-xs text-text-secondary uppercase tracking-wider">Related in This Topic</p>
          {relatedProducts.map((book) => (
            <Link
              key={book.slug}
              href={`/products/${book.slug}`}
              className="block border border-white/10 rounded-xl p-4 hover:border-gold/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{book.icon}</span>
                <div>
                  <p className="font-semibold text-text-primary text-sm">{book.title}</p>
                  <p className="text-xs text-text-secondary line-clamp-1">{book.tagline}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Free Guide CTA — Hook-Story-Offer */}
      <div className="mt-6 bg-gradient-to-br from-gold/15 via-gold/8 to-transparent border border-gold/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" aria-hidden="true" />
        <div className="relative">
          <div className="flex items-start gap-3 mb-3">
            <div className="shrink-0 w-9 h-9 bg-gold/20 border border-gold/30 rounded-xl flex items-center justify-center mt-0.5">
              <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0-3-3m3 3 3-3m2 8H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gold leading-snug mb-1">{t("hook")}</p>
              <p className="text-xs text-text-secondary leading-relaxed mb-1">{t("story")}</p>
              <p className="text-xs text-text-secondary leading-relaxed">{t("offer")}</p>
            </div>
          </div>
          <Link
            href="/free-guide"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-navy-dark rounded-xl font-bold text-sm hover:bg-gold-light transition-colors w-full sm:w-auto justify-center sm:justify-start"
          >
            {t("ctaButton")}
          </Link>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-white/10 text-center">
        <p className="text-text-secondary mb-2">Get weekly AI business frameworks — every Friday.</p>
        <p className="text-xs text-text-muted">500+ entrepreneurs subscribed · No spam · Unsubscribe anytime</p>
      </div>

      {/* Related Posts */}
      {otherPosts.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">You Might Also Like</h2>
            <Link
              href={`/blog/category/${encodeURIComponent(post.category.toLowerCase().replace(/\s+/g, "-"))}`}
              className="text-xs text-gold hover:underline"
            >
              More in {post.category} →
            </Link>
          </div>
          <div className="grid gap-4">
            {otherPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="block border border-white/10 rounded-xl p-4 hover:border-gold/40 transition-colors"
              >
                <div className="text-xs text-text-secondary mb-1 flex items-center gap-2 flex-wrap">
                  <time dateTime={related.date}>{new Date(related.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
                  <span>·</span>
                  <span>{related.readingTime}</span>
                  <span>·</span>
                  <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full">{related.category}</span>
                </div>
                <h3 className="font-semibold text-text-primary hover:text-gold transition-colors mb-1">{related.title}</h3>
                <p className="text-xs text-text-secondary line-clamp-2">{related.description}</p>
              </Link>
            ))}
          </div>
          {/* Tag navigation */}
          {post.tags.length > 0 && (
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Browse by tag</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, "-"))}`}
                    className="text-xs px-3 py-1 rounded-full bg-gold/5 text-gold/70 hover:bg-gold/10 hover:text-gold border border-white/5 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
    </>
  );
}
