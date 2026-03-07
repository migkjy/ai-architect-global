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
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const post = getPostBySlug(slug);
  if (!post) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
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
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${slug}`,
    },
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
            <time>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <p className="text-lg text-text-secondary">{post.description}</p>
        </header>
        <div className="prose prose-invert prose-gold max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>
      </article>
      <div className="mt-16 pt-8 border-t border-white/10 text-center">
        <p className="text-text-secondary mb-4">Ready to apply AI to your business?</p>
        <Link href="/bundle" className="inline-block bg-gold text-navy-dark px-6 py-3 rounded-lg hover:bg-gold-light transition-colors font-bold">
          Get the AI Architect Series →
        </Link>
      </div>

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
