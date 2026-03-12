import { getAllTags, getPostsByTag } from "@/lib/blog";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";

function slugToTag(slug: string): string {
  return decodeURIComponent(slug).replace(/-/g, " ");
}

export function generateStaticParams() {
  const tags = getAllTags();
  return routing.locales.flatMap((locale) =>
    tags.map((tag) => ({
      locale,
      tag: encodeURIComponent(tag.toLowerCase().replace(/\s+/g, "-")),
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}): Promise<Metadata> {
  const { locale, tag: tagSlug } = await params;
  const tagName = slugToTag(tagSlug);
  const allTags = getAllTags();
  const matched = allTags.find(
    (t) => t.toLowerCase() === tagName.toLowerCase()
  );
  if (!matched) return {};

  const canonicalUrl = `${SITE_URL}/en/blog/tag/${tagSlug}`;

  return {
    title: `${matched} Articles | AI Native Playbook Series Blog`,
    description: `Browse all AI business articles tagged with "${matched}". Practical guides and frameworks for entrepreneurs scaling with AI.`,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/blog/tag/${tagSlug}`,
        "x-default": `${SITE_URL}/en/blog/tag/${tagSlug}`,
      },
    },
    openGraph: {
      title: `${matched} Articles | AI Native Playbook Series Blog`,
      description: `Browse all articles tagged "${matched}".`,
      type: "website",
      url: canonicalUrl,
      siteName: "AI Native Playbook Series",
      locale: locale === "ko" ? "ko_KR" : locale === "ja" ? "ja_JP" : "en_US",
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
  return json
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}) {
  const { locale, tag: tagSlug } = await params;
  setRequestLocale(locale);

  const tagName = slugToTag(tagSlug);
  const allTags = getAllTags();
  const matched = allTags.find(
    (t) => t.toLowerCase() === tagName.toLowerCase()
  );

  if (!matched) notFound();

  const posts = getPostsByTag(matched);

  const canonicalUrl = `${SITE_URL}/en/blog/tag/${tagSlug}`;

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${matched} Articles | AI Native Playbook Series`,
    description: `All articles tagged with "${matched}".`,
    url: canonicalUrl,
    inLanguage: locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en-US",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    hasPart: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      url: `${SITE_URL}/en/blog/${post.slug}`,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "AI Native Playbook Series",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/en/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: matched,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: escapeJsonLd(JSON.stringify(collectionPageJsonLd)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: escapeJsonLd(JSON.stringify(breadcrumbJsonLd)),
        }}
      />
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-text-secondary" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/blog" className="text-gold hover:underline">
                Blog
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-text-primary">#{matched}</li>
          </ol>
        </nav>

        <header className="mb-12">
          <p className="text-sm text-gold uppercase tracking-wider mb-2">Tag</p>
          <h1 className="text-4xl font-bold mb-4">#{matched}</h1>
          <p className="text-lg text-text-secondary">
            {posts.length} {posts.length === 1 ? "article" : "articles"} with
            this tag
          </p>
        </header>

        {/* All tags nav */}
        <nav className="mb-10" aria-label="All tags">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-3">
            Browse tags
          </p>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => {
              const slug = encodeURIComponent(
                tag.toLowerCase().replace(/\s+/g, "-")
              );
              const isActive = tag === matched;
              return (
                <Link
                  key={tag}
                  href={`/blog/tag/${slug}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                    isActive
                      ? "bg-gold/20 text-gold border border-gold/40"
                      : "bg-gold/5 text-text-secondary hover:bg-gold/10 hover:text-gold border border-white/5"
                  }`}
                >
                  {tag}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Post list */}
        <div className="grid gap-8">
          {posts.length === 0 ? (
            <div className="text-center py-16 text-text-muted">
              No articles found with this tag.
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.slug}
                className="border border-white/10 rounded-xl p-6 hover:border-gold/40 transition-colors group"
              >
                <div className="flex items-center gap-3 text-sm text-text-secondary mb-3 flex-wrap">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span>&middot;</span>
                  <span>{post.readingTime}</span>
                  <span>&middot;</span>
                  <Link
                    href={`/blog/category/${encodeURIComponent(
                      post.category.toLowerCase().replace(/\s+/g, "-")
                    )}`}
                    className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full hover:bg-gold/20 transition-colors"
                  >
                    {post.category}
                  </Link>
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-gold transition-colors group-hover:text-gold/90"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-text-secondary mb-4 line-clamp-2">
                  {post.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => {
                    const tSlug = encodeURIComponent(
                      tag.toLowerCase().replace(/\s+/g, "-")
                    );
                    const isCurrentTag = tag === matched;
                    return (
                      <Link
                        key={tag}
                        href={`/blog/tag/${tSlug}`}
                        aria-current={isCurrentTag ? "page" : undefined}
                        className={`text-xs px-2 py-1 rounded-full transition-colors border ${
                          isCurrentTag
                            ? "bg-gold/20 text-gold border-gold/40"
                            : "bg-gold/5 text-gold/70 hover:bg-gold/10 hover:text-gold border-white/5"
                        }`}
                      >
                        {tag}
                      </Link>
                    );
                  })}
                </div>
              </article>
            ))
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <Link href="/blog" className="text-gold hover:underline text-sm">
            ← Back to all articles
          </Link>
        </div>
      </div>
    </>
  );
}
