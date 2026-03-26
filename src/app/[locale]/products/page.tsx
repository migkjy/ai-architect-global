import type { Metadata } from "next";
import Link from "next/link";
import { books, bundle, getBundleUrl, getBundlePaddlePriceId, getProductUrl } from "@/lib/products";
import dynamic from "next/dynamic";
const BuyButton = dynamic(() => import("@/components/BuyButton"));
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

const productsMeta: Record<string, { title: string; description: string; ogDescription: string; ogImageAlt: string; keywords: string[] }> = {
  en: {
    title: "All 6 AI Business Automation Guides — AI Native Playbook Series",
    description: "6 AI-native guides turning world-class marketing frameworks into executable AI systems. Prompt skills included — $17 each or $47 complete bundle.",
    ogDescription: "6 AI-powered business automation guides. Apply world-class marketing frameworks with AI agent skills. Individual $17 or complete bundle $47.",
    ogImageAlt: "AI Native Playbook Series — 6 AI Business Automation Guides with Prompt Skills",
    keywords: [
      "AI business automation guides",
      "AI marketing playbook",
      "AI native business guide",
      "business automation with AI",
      "AI agent skills",
      "AI powered marketing framework",
      "Russell Brunson AI guide",
      "Jeff Walker AI guide",
      "Jim Edwards AI guide",
      "Nicolas Cole AI guide",
      "AI sales funnel",
      "AI copywriting",
      "buy AI business guides",
      "AI marketing automation bundle",
      "digital marketing AI tools",
      "AI prompt templates for business",
    ],
  },
  ko: {
    title: "AI 비즈니스 자동화 가이드 6권 — AI Native Playbook Series",
    description: "Russell Brunson, Jeff Walker, Jim Edwards, Nicolas Cole의 프레임워크를 실행 가능한 AI 시스템으로 변환하는 6권의 PDF 가이드. 프롬프트 스킬 포함 — 개별 $17, 번들 $47.",
    ogDescription: "세계적 비즈니스 프레임워크를 AI로 자동화하는 6권의 가이드. 프롬프트 스킬 포함. 개별 $17 또는 번들 $47.",
    ogImageAlt: "AI Native Playbook 시리즈 — AI 비즈니스 자동화 가이드 6권",
    keywords: [
      "AI 비즈니스 자동화 가이드",
      "AI 마케팅 플레이북",
      "AI 프롬프트 템플릿",
      "비즈니스 자동화 AI",
      "AI 세일즈 퍼널",
      "AI 카피라이팅 가이드",
      "Russell Brunson AI 가이드",
      "AI 마케팅 프레임워크",
    ],
  },
  ja: {
    title: "AIビジネス自動化ガイド全6冊 — AI Native Playbook Series",
    description: "Russell Brunson、Jeff Walker、Jim Edwards、Nicolas Coleのフレームワークを実行可能なAIシステムに変換する6冊のPDFガイド。プロンプトスキル付き — 個別$17、バンドル$47。",
    ogDescription: "世界クラスのビジネスフレームワークをAIで自動化する6冊のガイド。プロンプトスキル付き。個別$17またはバンドル$47。",
    ogImageAlt: "AI Native Playbook シリーズ — AIビジネス自動化ガイド全6冊",
    keywords: [
      "AIビジネス自動化ガイド",
      "AIマーケティングプレイブック",
      "AIプロンプトテンプレート",
      "ビジネス自動化AI",
      "AIセールスファネル",
      "AIコピーライティングガイド",
      "Russell Brunson AIガイド",
      "AIマーケティングフレームワーク",
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com").trim();
  const meta = productsMeta[locale] ?? productsMeta.en;
  const canonicalUrl = `${siteUrl}/${locale}/products`;
  const ogDescription = (meta as typeof productsMeta.en).ogDescription ?? meta.description;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${siteUrl}/en/products`,
        ko: `${siteUrl}/ko/products`,
        ja: `${siteUrl}/ja/products`,
        "x-default": `${siteUrl}/en/products`,
      },
    },
    openGraph: {
      title: meta.title,
      description: ogDescription,
      type: "website",
      locale: locale === "ko" ? "ko_KR" : locale === "ja" ? "ja_JP" : "en_US",
      siteName: "AI Native Playbook Series",
      url: canonicalUrl,
      images: [
        {
          url: `${siteUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: meta.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: ogDescription,
      images: [`${siteUrl}/opengraph-image`],
    },
  };
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("products");
  const tc = await getTranslations("common");

  const bundleUrl = getBundleUrl();
  const bundlePaddlePriceId = getBundlePaddlePriceId();
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com").trim();

  function escapeJsonLd(json: string): string {
    return json.replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
  }

  const canonicalProductsUrl = `${siteUrl}/${locale}/products`;

  const meta = productsMeta[locale] ?? productsMeta.en;
  const inLanguage = locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en-US";

  const itemListSchema = {
    "@type": "ItemList",
    "@id": `${canonicalProductsUrl}#itemlist`,
    name: "AI Native Playbook Series — All Books",
    description: "6 AI-powered PDF guides that turn proven business frameworks into executable AI systems.",
    numberOfItems: books.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: books.map((book, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: book.title,
        description: book.shortDescription,
        url: `${siteUrl}/${locale}/products/${book.slug}`,
        sku: `AIA-VOL${book.vol}`,
        image: `${siteUrl}/opengraph-image`,
        brand: { "@type": "Brand", name: "AI Native Playbook Series" },
        category: "Digital Download / Business Guide",
        offers: {
          "@type": "Offer",
          price: "17",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          priceValidUntil: "2026-12-31",
          url: `${siteUrl}/${locale}/products/${book.slug}`,
          seller: { "@id": `${siteUrl}/#organization` },
        },
      },
    })),
  };

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "AI Native Playbook",
      url: siteUrl,
      logo: `${siteUrl}/opengraph-image`,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "AI Native Playbook",
      url: siteUrl,
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: ["en-US", "ko-KR", "ja-JP"],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/${locale}` },
        { "@type": "ListItem", position: 2, name: "All Books", item: canonicalProductsUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${canonicalProductsUrl}#webpage`,
      name: meta.title,
      description: meta.description,
      url: canonicalProductsUrl,
      inLanguage,
      isPartOf: { "@id": `${siteUrl}/#website` },
      publisher: { "@id": `${siteUrl}/#organization` },
      mainEntity: { "@id": `${canonicalProductsUrl}#itemlist` },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/${locale}` },
          { "@type": "ListItem", position: 2, name: "All Books", item: canonicalProductsUrl },
        ],
      },
    },
    {
      "@context": "https://schema.org",
      ...itemListSchema,
    },
    {
      "@context": "https://schema.org",
      "@type": "OfferCatalog",
      name: "AI Native Playbook Series — Complete Bundle",
      description: "All 6 AI business automation guides in one discounted bundle. Save 54%.",
      url: `${siteUrl}/${locale}/bundle`,
      numberOfItems: books.length,
      itemListElement: [
        {
          "@type": "Offer",
          name: "Complete Bundle — All 6 AI Guides",
          price: "47",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          priceValidUntil: "2026-12-31",
          url: `${siteUrl}/${locale}/bundle`,
          seller: { "@id": `${siteUrl}/#organization` },
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(jsonLd)) }}
      />
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="gradient-gold">{t("title")}</span>
        </h1>
        <p className="text-text-secondary text-lg mb-6 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
        <div className="inline-flex items-center gap-3 bg-gold/10 border border-gold/20 rounded-xl px-6 py-3">
          <span className="text-text-secondary text-sm">{t("individualPrice")}</span>
          <span className="text-gold font-bold">$17</span>
          <span className="text-text-muted text-xs">{tc("orGetAll").split("$")[0]}</span>
          <Link href="/bundle" className="text-gold font-bold hover:text-gold-light transition-colors">
            $47 &rarr;
          </Link>
        </div>
      </div>

      {/* Bundle CTA Banner */}
      <div className="max-w-5xl mx-auto px-4 mb-14">
        <div className="bg-surface/60 border border-gold/20 rounded-2xl p-6 md:p-8 card-glow flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-block bg-gold text-navy-dark text-xs font-bold px-3 py-1 rounded-full mb-3">
              {t("bestValue")}
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              <span className="gradient-gold">{t("bundleTitle")}</span>
            </h2>
            <p className="text-text-secondary text-sm">{t("bundleSub")}</p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-text-secondary line-through">${bundle.originalPrice}</span>
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">SAVE ${bundle.originalPrice - bundle.price}</span>
            </div>
            <div className="text-3xl font-bold text-gold">${bundle.price}</div>
            <BuyButton
              href={bundleUrl}
              paddlePriceId={bundlePaddlePriceId}
              paddleSuccessUrl={`${siteUrl}/thank-you?product=Complete+Bundle`}
              className="text-sm px-6 py-2.5"
            >
              {tc("getAllBooks")} &mdash; ${bundle.price}
            </BuyButton>
            <p className="text-xs text-text-muted">{t("instantGuarantee")}</p>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="space-y-6">
          {books.map((book) => {
            const productUrl = getProductUrl(book.envKey);
            const bookPaddlePriceId =
              (process.env[book.paddlePriceEnvKey] as string | undefined) ?? undefined;
            return (
              <div
                key={book.id}
                className="bg-surface/60 border border-white/5 rounded-2xl p-6 md:p-8 card-glow hover:border-gold/10 transition-all"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="shrink-0 flex flex-row md:flex-col items-center gap-4 md:gap-2 md:w-24">
                    <div className="relative w-16 h-16 bg-navy-dark/60 border border-gold/10 rounded-2xl flex items-center justify-center text-3xl">
                      {book.icon}
                      {book.isBestseller && (
                        <span className="absolute -top-2 -right-2 bg-gold text-navy-dark text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                          BEST
                        </span>
                      )}
                      {book.isNew && (
                        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gold/70 font-bold">Vol. {book.vol}</div>
                      <div className="text-xs text-text-muted">of 6</div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
                      <div>
                        <h2 className="text-xl font-bold text-text-primary mb-1">{book.title}</h2>
                        <p className="text-sm text-gold/80 italic">{book.tagline}</p>
                      </div>
                      <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
                        <div className="text-2xl font-bold text-gold">$17</div>
                        <BuyButton
                          href={productUrl}
                          paddlePriceId={bookPaddlePriceId}
                          paddleSuccessUrl={`${siteUrl}/thank-you?product=${encodeURIComponent(book.title)}`}
                          className="text-sm px-5 py-2"
                        >
                          {tc("buyNow")}
                        </BuyButton>
                        <Link
                          href={`/products/${book.slug}`}
                          className="text-xs text-text-secondary hover:text-gold transition-colors"
                        >
                          {tc("fullDetails")} &rarr;
                        </Link>
                      </div>
                    </div>

                    <p className="text-text-secondary text-sm leading-relaxed mb-4">
                      {book.shortDescription}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {book.highlights.map((h) => (
                        <span
                          key={h}
                          className="text-xs bg-navy-dark/60 text-text-secondary border border-white/5 px-3 py-1.5 rounded-lg"
                        >
                          {h}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/5">
                      <span className="text-xs text-gold/60 font-semibold">Documented result: </span>
                      <span className="text-xs text-text-secondary italic">&ldquo;{book.caseStudy.result}&rdquo;</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Related pages */}
      <nav className="max-w-5xl mx-auto px-4 mt-14 pt-8 border-t border-white/10" aria-label="Related pages">
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/blog" className="text-sm text-gold hover:text-gold-light transition-colors">Blog</Link>
          <Link href="/free-guide" className="text-sm text-gold hover:text-gold-light transition-colors">Free Guide</Link>
          <Link href="/bundle" className="text-sm text-gold hover:text-gold-light transition-colors">Bundle</Link>
          <Link href="/faq" className="text-sm text-gold hover:text-gold-light transition-colors">FAQ</Link>
        </div>
      </nav>
    </div>
    </>
  );
}
