import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { books, getBookBySlug, getBundleUrl, getProductUrl } from "@/lib/products";
import BuyButton from "@/components/BuyButton";
import { setRequestLocale } from "next-intl/server";
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
      "AI business framework",
      "AI PDF guide",
      "business automation",
      "AI Architect Series",
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
      siteName: "AI Architect Series",
      url: canonicalUrl,
      images: [
        {
          url: `${siteUrl}/og-image`,
          width: 1200,
          height: 630,
          alt: `${book.title} — AI Architect Series`,
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

  const book = getBookBySlug(slug);

  if (!book) notFound();

  const productUrl = getProductUrl(book.envKey);
  const bundleUrl = getBundleUrl();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: book.title,
    description: book.shortDescription,
    url: `${siteUrl}/products/${slug}`,
    brand: { "@type": "Brand", name: "AI Architect Series" },
    offers: {
      "@type": "Offer",
      price: "17",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/products/${slug}`,
      seller: { "@type": "Organization", name: "AI Architect Series", url: siteUrl },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "AI Architect Series", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "All Books", item: `${siteUrl}/products` },
      { "@type": "ListItem", position: 3, name: book.title, item: `${siteUrl}/products/${slug}` },
    ],
  };

  function escapeJsonLd(json: string): string {
    return json.replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(jsonLd)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(breadcrumbJsonLd)) }}
      />

      <div className="min-h-screen pt-24 pb-20">
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto px-4 mb-8">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-gold transition-colors">All Books</Link>
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
                <span className="text-xs text-text-muted">Based on: {book.framework}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                <span className="gradient-gold">{book.title}</span>
              </h1>
              <p className="text-xl text-text-secondary mb-4 italic">{book.tagline}</p>
              <p className="text-text-secondary leading-relaxed mb-6">{book.shortDescription}</p>

              {/* Case Study */}
              <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 mb-6">
                <div className="text-gold font-bold mb-1">{book.caseStudy.result}</div>
                <div className="text-text-secondary text-sm">{book.caseStudy.detail}</div>
              </div>

              <div className="flex flex-wrap gap-3">
                <BuyButton href={productUrl} className="text-lg px-8 py-4">
                  Buy {book.title} — $17
                </BuyButton>
                <BuyButton href={bundleUrl} variant="secondary" className="text-sm py-2">
                  Or get all 6 for $47
                </BuyButton>
              </div>

              <p className="text-xs text-text-muted mt-3">
                Immediate PDF download · 7-day money-back guarantee
              </p>
            </div>

            {/* Book Card */}
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
            <h2 className="text-2xl font-bold">Frameworks Covered</h2>
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

        {/* What's Inside */}
        <section className="max-w-4xl mx-auto px-4 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gold rounded-full" />
            <h2 className="text-2xl font-bold">What&apos;s Inside</h2>
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
            <h2 className="text-2xl font-bold mb-2">
              Ready to execute {book.framework} with AI?
            </h2>
            <p className="text-text-secondary mb-6">
              Immediate PDF download. Works with Claude, ChatGPT, and Gemini.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <BuyButton href={productUrl} className="text-lg px-8 py-4">
                Buy {book.title} — $17
              </BuyButton>
              <BuyButton href={bundleUrl} variant="secondary">
                Get All 6 Books — $47
              </BuyButton>
            </div>
            <p className="text-xs text-text-muted mt-4">
              7-day money-back guarantee · No questions asked
            </p>
          </div>
        </section>

        {/* Other Books */}
        <div className="max-w-4xl mx-auto px-4 mt-16">
          <h2 className="text-xl font-bold mb-6">Other Books in the Series</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {books
              .filter((b) => b.id !== book.id)
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
