import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";
  const canonicalUrl = `${siteUrl}/blog/${slug}`;

  return {
    title: post.title,
    description: post.description,
    keywords: [
      ...post.tags,
      "AI business framework",
      "AI Architect Series",
    ],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.date,
      url: canonicalUrl,
      locale: locale === "ko" ? "ko_KR" : locale === "ja" ? "ja_JP" : "en_US",
      siteName: "AI Architect Series",
      images: [
        {
          url: `${siteUrl}/og-image`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [`${siteUrl}/og-image`],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${siteUrl}/blog/${slug}`,
        ko: `${siteUrl}/ko/blog/${slug}`,
        ja: `${siteUrl}/ja/blog/${slug}`,
      },
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug)
    .filter((p) => p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 3);
  const otherPosts = relatedPosts.length > 0 ? relatedPosts : allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    image: `${siteUrl}/og-image`,
    url: `${siteUrl}/blog/${slug}`,
    inLanguage: locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en-US",
    author: {
      "@type": "Organization",
      name: "AI Architect Series",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "AI Architect Series",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/og-image`,
        width: 1200,
        height: 630,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${slug}`,
    },
    keywords: post.tags.join(", "),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "AI Architect Series", item: siteUrl },
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
    <main className="max-w-3xl mx-auto px-4 py-16">
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
        <div className="prose prose-invert prose-gold max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // eslint-disable-next-line @next/next/no-img-element
              img: ({ src, alt, ...props }) => {
                const srcStr = typeof src === 'string' ? src : '';
                const fallbackAlt = srcStr ? srcStr.split('/').pop()?.replace(/[-_]/g, ' ').replace(/\.\w+$/, '') || 'article image' : 'article image';
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={srcStr} alt={alt || fallbackAlt} loading="lazy" {...props} />
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
      {/* Product CTA */}
      <div className="mt-12 p-6 bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/20 rounded-2xl">
        <h3 className="text-lg font-bold mb-2">Ready to Execute These Frameworks with AI?</h3>
        <p className="text-text-secondary text-sm mb-4">
          The AI Architect Series gives you ready-to-use system prompts that turn these strategies into actionable AI workflows for your business.
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

      <div className="mt-8 pt-8 border-t border-white/10 text-center">
        <p className="text-text-secondary mb-2">Get weekly AI business frameworks — every Friday.</p>
        <p className="text-xs text-text-muted">500+ entrepreneurs subscribed · No spam · Unsubscribe anytime</p>
      </div>

      {/* Related Posts */}
      {otherPosts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">Related Articles</h2>
          <div className="grid gap-4">
            {otherPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="block border border-white/10 rounded-xl p-4 hover:border-gold/40 transition-colors"
              >
                <div className="text-xs text-text-secondary mb-1">
                  <time dateTime={related.date}>{new Date(related.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
                  <span className="mx-2">·</span>
                  <span>{related.readingTime}</span>
                </div>
                <h3 className="font-semibold text-text-primary hover:text-gold transition-colors mb-1">{related.title}</h3>
                <p className="text-xs text-text-secondary line-clamp-2">{related.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Korean ecosystem crosslink */}
      <div className="mt-8 p-5 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between gap-4">
        <div>
          <p className="text-text-secondary/60 text-xs mb-1">Korean readers</p>
          <p className="text-text-primary text-sm font-medium">AI business content in Korean</p>
          <p className="text-text-secondary text-xs">Richbukae — AI Architect guides for Korean entrepreneurs</p>
        </div>
        <a
          href="https://richbukae.com?utm_source=ai-architect&utm_medium=blog&utm_campaign=ecosystem"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 text-gold text-sm hover:text-gold-light transition-colors font-medium"
        >
          richbukae.com →
        </a>
      </div>
    </main>
    </>
  );
}
