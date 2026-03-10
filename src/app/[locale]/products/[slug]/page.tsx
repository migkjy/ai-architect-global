import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { books, bundle, getBookBySlug, getBundleUrl, getBundlePaddlePriceId, getProductUrl } from "@/lib/products";
import { getAllPosts } from "@/lib/blog";
import dynamic from "next/dynamic";
const BuyButton = dynamic(() => import("@/components/BuyButton"));
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    books.map((b) => ({ locale, slug: b.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const book = getBookBySlug(slug);
  if (!book) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";
  const canonicalUrl = `${siteUrl}/products/${slug}`;
  return {
    title: `${book.title} — ${book.subtitle}`,
    description: book.shortDescription,
    keywords: [
      book.title,
      book.framework,
      `${book.framework} AI`,
      `${book.framework} automation`,
      "AI business automation",
      "AI marketing playbook",
      "AI native business guide",
      "business automation with AI",
      "AI agent skills",
      "AI powered marketing framework",
      "AI PDF guide",
      "AI Native Playbook Series",
      "digital download",
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${siteUrl}/products/${slug}`,
        ko: `${siteUrl}/ko/products/${slug}`,
        ja: `${siteUrl}/ja/products/${slug}`,
      },
    },
    openGraph: {
      title: `${book.title} — ${book.subtitle}`,
      description: book.shortDescription,
      type: "website",
      locale: locale === "ko" ? "ko_KR" : locale === "ja" ? "ja_JP" : "en_US",
      siteName: "AI Native Playbook Series",
      url: canonicalUrl,
      images: [
        {
          url: `${siteUrl}/og-image`,
          width: 1200,
          height: 630,
          alt: `${book.title} — AI Native Playbook Series`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${book.title} — ${book.subtitle}`,
      description: book.shortDescription,
      images: [`${siteUrl}/og-image`],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("products");
  const tc = await getTranslations("common");
  const tn = await getTranslations("nav");

  const book = getBookBySlug(slug);
  if (!book) notFound();

  const productUrl = getProductUrl(book.envKey);
  const bundleUrl = getBundleUrl();
  const bookPaddlePriceId =
    (process.env[book.paddlePriceEnvKey] as string | undefined) ?? undefined;
  const bundlePaddlePriceId = getBundlePaddlePriceId();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";
  const dateLocale = locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en-US";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: book.title,
    description: book.shortDescription,
    url: `${siteUrl}/products/${slug}`,
    sku: `AIA-VOL${book.vol}`,
    itemCondition: "https://schema.org/NewCondition",
    brand: { "@type": "Brand", name: "AI Native Playbook Series" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Individual",
        price: "17",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/products/${slug}`,
        priceValidUntil: "2026-12-31",
        seller: { "@type": "Organization", name: "NEWBIZSOFT", url: siteUrl },
      },
      {
        "@type": "Offer",
        name: "Complete Bundle (6 Books)",
        price: "47",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/bundle`,
        priceValidUntil: "2026-12-31",
        seller: { "@type": "Organization", name: "NEWBIZSOFT", url: siteUrl },
      },
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "AI Native Playbook Series", item: siteUrl },
      { "@type": "ListItem", position: 2, name: t("title"), item: `${siteUrl}/products` },
      { "@type": "ListItem", position: 3, name: book.title, item: `${siteUrl}/products/${slug}` },
    ],
  };

  function escapeJsonLd(json: string): string {
    return json.replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(jsonLd)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(breadcrumbJsonLd)) }} />

      <div className="min-h-screen pt-24 pb-20">
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto px-4 mb-8">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Link href="/" className="hover:text-gold transition-colors">{tn("home")}</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-gold transition-colors">{tn("products")}</Link>
            <span>/</span>
            <span className="text-text-secondary">{book.title}</span>
          </div>
        </div>

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 mb-16">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs text-gold/70 font-bold bg-gold/10 border border-gold/20 px-3 py-1 rounded-full">
                  Vol. {book.vol} of 6
                </span>
                <span className="text-xs text-text-muted">{t("basedOn", { framework: book.framework })}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                <span className="gradient-gold">{book.title}</span>
              </h1>
              <p className="text-xl text-text-secondary mb-4 italic">{book.tagline}</p>
              <p className="text-text-secondary leading-relaxed mb-6">{book.shortDescription}</p>

              <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 mb-6">
                <div className="text-gold font-bold mb-1">{book.caseStudy.result}</div>
                <div className="text-text-secondary text-sm">{book.caseStudy.detail}</div>
              </div>

              <div className="flex flex-wrap gap-3">
                <BuyButton
                  href={productUrl}
                  paddlePriceId={bookPaddlePriceId}
                  paddleSuccessUrl={`${siteUrl}/thank-you?product=${encodeURIComponent(book.title)}`}
                  className="text-lg px-8 py-4"
                >
                  {book.title} &mdash; $17
                </BuyButton>
                <BuyButton
                  href={bundleUrl}
                  paddlePriceId={bundlePaddlePriceId}
                  paddleSuccessUrl={`${siteUrl}/thank-you?product=Complete+Bundle`}
                  variant="secondary"
                  className="text-sm py-2"
                >
                  {tc("getAllBooks")} &mdash; $47
                </BuyButton>
              </div>

              <p className="text-xs text-text-muted mt-3">
                {tc("pdfDownload")} &middot; {tc("moneyBack")}
              </p>
            </div>

            <div className="md:w-64 shrink-0">
              <div className={`bg-gradient-to-br ${book.color} border border-white/10 rounded-2xl p-8 text-center`}>
                <div className="text-6xl mb-4">{book.icon}</div>
                <div className="text-xs text-gold/70 font-bold mb-1">Vol. {book.vol}</div>
                <div className="font-bold text-text-primary text-sm mb-2">{book.title}</div>
                <div className="text-xs text-text-secondary">{book.subtitle}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Frameworks Covered */}
        <section className="max-w-4xl mx-auto px-4 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gold rounded-full" />
            <h2 className="text-2xl font-bold">{t("frameworksCovered")}</h2>
          </div>
          <div className="space-y-3">
            {book.frameworks.map((f, i) => (
              <div key={i} className="flex gap-3 bg-surface/60 border border-white/5 rounded-xl p-4">
                <div className="w-6 h-6 bg-gold/10 border border-gold/20 rounded-md flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{f}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bundle Savings Banner */}
        <section className="max-w-4xl mx-auto px-4 mb-16">
          <Link
            href="/bundle"
            className="block bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/20 rounded-2xl p-5 hover:border-gold/40 transition-colors group"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gold/15 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {t("bundleSavings", { perBook: `$${Math.round(bundle.price / books.length)}` })}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {t("bundleSavingsDetail", { individual: "$17", save: `$${bundle.originalPrice - bundle.price}` })}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-xs bg-gold/15 text-gold px-4 py-2 rounded-lg font-semibold group-hover:bg-gold/25 transition-colors">
                ${bundle.price}
              </span>
            </div>
          </Link>
        </section>

        {/* What's Inside */}
        <section className="max-w-4xl mx-auto px-4 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gold rounded-full" />
            <h2 className="text-2xl font-bold">{t("whatsInside")}</h2>
          </div>
          <div className="bg-surface/60 border border-white/5 rounded-2xl p-6 md:p-8">
            <ul className="space-y-3">
              {book.whatsInside.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-gold rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-navy-dark" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="text-text-secondary text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-4">
          <div className="bg-surface/60 border border-gold/20 rounded-2xl p-8 text-center card-glow">
            <div className="inline-block bg-gold/10 border border-gold/20 text-gold text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
              {t("instantPdfDownload")}
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {t("readyToExecute", { framework: book.framework })}
            </h2>
            <p className="text-text-secondary mb-2">{t("worksWithStart")}</p>
            <p className="text-sm text-gold/80 mb-6">{t("entrepreneursUsing")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <BuyButton
                href={productUrl}
                paddlePriceId={bookPaddlePriceId}
                paddleSuccessUrl={`${siteUrl}/thank-you?product=${encodeURIComponent(book.title)}`}
                className="text-lg px-8 py-4"
              >
                {book.title} &mdash; $17
              </BuyButton>
              <BuyButton
                href={bundleUrl}
                paddlePriceId={bundlePaddlePriceId}
                paddleSuccessUrl={`${siteUrl}/thank-you?product=Complete+Bundle`}
                variant="secondary"
              >
                {tc("getAllBooks")} &mdash; $47
              </BuyButton>
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {tc("moneyBack")}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                {t("noAccount")}
              </span>
            </div>
          </div>
        </section>

        {/* Related Blog Articles */}
        {(() => {
          const blogPosts = getAllPosts().slice(0, 3);
          if (blogPosts.length === 0) return null;
          return (
            <div className="max-w-4xl mx-auto px-4 mt-16">
              <h2 className="text-xl font-bold mb-6">{t("relatedArticles")}</h2>
              <div className="grid gap-4">
                {blogPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="block border border-white/10 rounded-xl p-4 hover:border-gold/40 transition-colors"
                  >
                    <div className="text-xs text-text-muted mb-1">
                      <time dateTime={post.date}>{new Date(post.date).toLocaleDateString(dateLocale, { year: "numeric", month: "short", day: "numeric" })}</time>
                      <span className="mx-2">&middot;</span>
                      <span>{post.readingTime}</span>
                    </div>
                    <h3 className="font-semibold text-text-primary hover:text-gold transition-colors mb-1">{post.title}</h3>
                    <p className="text-xs text-text-secondary line-clamp-2">{post.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Related Books (prioritized) + Other Books */}
        <div className="max-w-4xl mx-auto px-4 mt-16">
          {/* Related recommendations */}
          {book.relatedSlugs && book.relatedSlugs.length > 0 && (() => {
            const related = book.relatedSlugs.map((s) => books.find((b) => b.slug === s)).filter(Boolean) as typeof books;
            if (related.length === 0) return null;
            return (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-2">{t("pairsWellWith")}</h2>
                <p className="text-sm text-text-secondary mb-4">{t("pairsWellDesc")}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {related.map((b) => (
                    <Link
                      key={b.id}
                      href={`/products/${b.slug}`}
                      className="bg-surface/60 border border-gold/10 rounded-xl p-5 hover:border-gold/30 transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl shrink-0">{b.icon}</div>
                        <div className="min-w-0">
                          <div className="text-xs text-gold/60 font-bold mb-1">Vol. {b.vol}</div>
                          <div className="text-sm font-bold text-text-primary group-hover:text-gold transition-colors mb-1">
                            {b.title}
                          </div>
                          <p className="text-xs text-text-secondary line-clamp-2">{b.tagline}</p>
                          <div className="mt-2 text-xs text-gold font-medium">$17 &rarr;</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })()}

          <h2 className="text-xl font-bold mb-6">{t("otherBooks")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {books
              .filter((b) => b.id !== book.id && !(book.relatedSlugs ?? []).includes(b.slug))
              .map((b) => (
                <Link
                  key={b.id}
                  href={`/products/${b.slug}`}
                  className="bg-surface/40 border border-white/5 rounded-xl p-4 hover:border-gold/20 transition-all group"
                >
                  <div className="text-2xl mb-2">{b.icon}</div>
                  <div className="text-xs text-gold/60 font-semibold mb-1">Vol. {b.vol}</div>
                  <div className="text-sm font-semibold text-text-primary group-hover:text-gold transition-colors leading-tight">
                    {b.title}
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
