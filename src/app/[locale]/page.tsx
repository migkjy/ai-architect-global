import type { Metadata } from "next";
import Link from "next/link";
import { books, bundle, getBundleUrl, getBundlePaddlePriceId } from "@/lib/products";
import { getAllPosts } from "@/lib/blog";
import dynamic from "next/dynamic";
const BuyButton = dynamic(() => import("@/components/BuyButton"), {
  loading: () => <span className="inline-block h-12 w-48 animate-pulse bg-gold/20 rounded-xl" />,
});
const StickyMobileCTA = dynamic(() => import("@/components/StickyMobileCTA"));
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

const homeMeta: Record<string, { title: string; description: string; ogDescription: string; twitterDescription: string }> = {
  en: {
    title: "AI Native Playbook Series — Business Automation with AI. 6 World-Class Frameworks.",
    description: "6 AI-powered guides that run Russell Brunson, Jeff Walker, Jim Edwards frameworks as automation systems. Bundle $47 — start your AI-native business today.",
    ogDescription: "6 AI native guides turn world-class business frameworks into executable automation systems. AI marketing playbook + agent skills. Bundle: $47.",
    twitterDescription: "Business automation with AI. 6 PDF guides turn Russell Brunson, Jeff Walker, Jim Edwards frameworks into AI-powered systems. Bundle $47.",
  },
  ko: {
    title: "AI Native Playbook Series — 세계적 비즈니스 프레임워크를 AI로 실행하세요.",
    description: "Russell Brunson, Jeff Walker, Jim Edwards, Nicolas Cole의 프레임워크를 AI 시스템으로 전환하는 6권의 PDF 가이드. 번들: $47.",
    ogDescription: "세계적 비즈니스 프레임워크를 AI로 자동화하는 6권의 실행 가이드. 번들: $47.",
    twitterDescription: "Russell Brunson, Jeff Walker 프레임워크를 AI 시스템으로 전환. 번들 $47.",
  },
  ja: {
    title: "AI Native Playbook Series — ビジネスフレームワークをAIで実行しよう。",
    description: "Russell Brunson、Jeff Walker、Jim Edwards、Nicolas Coleのフレームワークを実行可能なAIシステムに変換する6冊のPDFガイド。バンドル: $47。",
    ogDescription: "世界クラスのビジネスフレームワークをAIで自動化する6冊の実行ガイド。バンドル: $47。",
    twitterDescription: "Russell Brunson、Jeff WalkerのフレームワークをAIシステムに変換。バンドル $47。",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com").trim();
  const meta = homeMeta[locale] ?? homeMeta.en;
  const canonicalUrl = locale === "en" ? siteUrl : `${siteUrl}/${locale}`;
  const ogLocale = locale === "ko" ? "ko_KR" : locale === "ja" ? "ja_JP" : "en_US";

  return {
    title: meta.title,
    description: meta.description,
    keywords: [
      "AI native playbook",
      "AI architecture patterns",
      "AI architect",
      "AI business automation",
      "AI marketing playbook",
      "AI native business guide",
      "business automation with AI",
      "AI powered marketing framework",
      "AI agent skills",
      "Russell Brunson AI",
      "DotCom Secrets AI system",
      "Jeff Walker Product Launch Formula AI",
      "Jim Edwards Copywriting Secrets AI",
      "Nicolas Cole AI writing",
      "AI sales funnel automation",
      "AI marketing system",
      "online business AI tools",
    ],
    openGraph: {
      title: meta.title,
      description: meta.ogDescription,
      url: canonicalUrl,
      type: "website",
      locale: ogLocale,
      siteName: "AI Native Playbook Series",
      images: [
        {
          url: `${siteUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "AI Native Playbook Series — 6 AI-Powered Business Frameworks",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.twitterDescription,
      images: [`${siteUrl}/opengraph-image`],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: siteUrl,
        ko: `${siteUrl}/ko`,
        ja: `${siteUrl}/ja`,
        "x-default": siteUrl,
      },
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const bundleUrl = getBundleUrl();
  const bundlePaddlePriceId = getBundlePaddlePriceId();
  const latestPosts = getAllPosts().slice(0, 3);

  const t = await getTranslations("home");
  const th = await getTranslations("hero");
  const tc = await getTranslations("common");
  const tf = await getTranslations("faq");
  const tt = await getTranslations("testimonials");
  const tr = await getTranslations("caseStudies");

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com").trim();

  const results = [
    { metric: t("results.metric1"), label: t("results.label1") },
    { metric: t("results.metric2"), label: t("results.label2") },
    { metric: t("results.metric3"), label: t("results.label3") },
    { metric: t("results.metric4"), label: t("results.label4") },
  ];

  const testimonials = [
    { quote: tt("t1Quote"), name: tt("t1Name"), role: tt("t1Role"), result: tt("t1Result") },
    { quote: tt("t2Quote"), name: tt("t2Name"), role: tt("t2Role"), result: tt("t2Result") },
    { quote: tt("t3Quote"), name: tt("t3Name"), role: tt("t3Role"), result: tt("t3Result") },
  ];

  const faqs = [
    { q: tf("q1"), a: tf("a1") },
    { q: tf("q2"), a: tf("a2") },
    { q: tf("q3"), a: tf("a3") },
    { q: tf("q4"), a: tf("a4") },
    { q: tf("q5", { saved: String(bundle.originalPrice - bundle.price) }) },
    { q: tf("q6", { price: String(bundle.price) }) },
    { q: tf("q7"), a: tf("a7") },
    { q: tf("q8"), a: tf("a8") },
    { q: tf("q9"), a: tf("a9") },
  ].map((f, i) => ({
    q: f.q,
    a: f.a ?? tf(`a${i + 1}` as "a1", i === 4 ? { saved: String(bundle.originalPrice - bundle.price) } : i === 5 ? { price: String(bundle.price) } : undefined),
  }));

  const caseStudies = [
    { result: tr("r1Result"), who: tr("r1Who"), how: tr("r1How") },
    { result: tr("r2Result"), who: tr("r2Who"), how: tr("r2How") },
    { result: tr("r3Result"), who: tr("r3Who"), how: tr("r3How") },
    { result: tr("r4Result"), who: tr("r4Who"), how: tr("r4How") },
    { result: tr("r5Result"), who: tr("r5Who"), how: tr("r5How") },
    { result: tr("r6Result"), who: tr("r6Who"), how: tr("r6How") },
  ];

  const targetAudiences = [
    { icon: "rocket", title: t("audience1Title"), desc: t("audience1Desc") },
    { icon: "chart", title: t("audience2Title"), desc: t("audience2Desc") },
    { icon: "store", title: t("audience3Title"), desc: t("audience3Desc") },
    { icon: "pen", title: t("audience4Title"), desc: t("audience4Desc") },
  ];

  const steps = [
    { step: "01", title: t("step1Title"), desc: t("step1Desc") },
    { step: "02", title: t("step2Title"), desc: t("step2Desc") },
    { step: "03", title: t("step3Title"), desc: t("step3Desc") },
    { step: "04", title: t("step4Title"), desc: t("step4Desc") },
  ];

  const dateLocale = locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en-US";

  const faqPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  const webPageJsonLd = locale === "en" ? {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/#webpage`,
    url: siteUrl,
    name: "AI Native Playbook Series — AI Architecture Patterns for Business Automation",
    description: "6 AI-native guides that turn proven business frameworks into executable AI architecture patterns. For entrepreneurs, marketers, and AI-native builders.",
    inLanguage: "en-US",
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: [
      { "@type": "Thing", name: "AI Native Playbook" },
      { "@type": "Thing", name: "AI Architecture Patterns" },
      { "@type": "Thing", name: "AI Business Automation" },
      { "@type": "Thing", name: "AI Architect" },
    ],
    keywords: "AI native playbook, AI architecture patterns, AI architect, business automation with AI, AI marketing playbook",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".hero-description", ".faq-section"],
    },
  } : null;

  const bookListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "AI Native Playbook Series — 6 Books",
    description: "6 AI-powered PDF guides for business framework automation",
    numberOfItems: books.length,
    itemListElement: books.map((book, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Product",
        name: book.title,
        description: book.shortDescription,
        url: `${siteUrl}/products/${book.slug}`,
        sku: `AIA-VOL${book.vol}`,
        brand: { "@type": "Brand", name: "AI Native Playbook Series" },
        offers: {
          "@type": "Offer",
          price: "17",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          priceValidUntil: "2026-12-31",
        },
      },
    })),
  };

  function escapeJsonLd(json: string): string {
    return json.replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
  }

  return (
    <>
      {webPageJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(webPageJsonLd)) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(faqPageJsonLd)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(bookListJsonLd)) }}
      />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold/3 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="flex flex-col items-center gap-3 mb-6">
            <span className="inline-block bg-gold/10 border border-gold/20 text-gold text-xs font-semibold px-4 py-1.5 rounded-full tracking-wide uppercase">
              {th("badge")}
            </span>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                {th("usedBy")}
              </span>
              <span className="text-white/20">&middot;</span>
              <span>{th("guarantee")}</span>
            </div>
          </div>

          {locale === "en" && (
            <p className="text-sm font-semibold text-gold/70 uppercase tracking-widest mb-3">
              AI Native Playbook Series
            </p>
          )}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            {th("title1")}
            <br />
            <span className="gradient-gold">{th("title2")}</span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-10 leading-relaxed">
            {th("subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <BuyButton href={bundleUrl} paddlePriceId={bundlePaddlePriceId} paddleSuccessUrl={`${siteUrl}/thank-you?product=Complete+Bundle`} className="text-lg px-10 py-4">
              {th("cta")} &mdash; ${bundle.price}
            </BuyButton>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-text-secondary border border-white/10 hover:border-gold/30 hover:text-gold transition-all"
            >
              {th("viewBooks")}
            </Link>
          </div>
          <p className="text-center text-xs text-text-muted mb-8">
            {th("trust")}
          </p>

          <div className="flex flex-wrap justify-center gap-3 text-xs text-text-muted" aria-label="Purchase benefits">
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
              <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              {th("instantPdf")}
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
              <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {th("worksWithAI")}
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
              <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              {th("moneyBack")}
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
              <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {th("setupTime")}
            </span>
          </div>
        </div>
      </section>

      {/* Social Proof Numbers */}
      <section className="py-12 border-y border-white/5 bg-navy-dark/50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {results.map((r) => (
              <div key={r.metric}>
                <div className="text-3xl md:text-4xl font-bold gradient-gold mb-1">{r.metric}</div>
                <div className="text-xs md:text-sm text-text-secondary leading-snug">{r.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-text-muted text-xs">
            <span className="uppercase tracking-wider font-medium">{t("worksWith")}</span>
            <span className="flex items-center gap-2 text-text-secondary font-medium">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              Claude (Anthropic)
            </span>
            <span className="flex items-center gap-2 text-text-secondary font-medium">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              ChatGPT (OpenAI)
            </span>
            <span className="flex items-center gap-2 text-text-secondary font-medium">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              Gemini (Google)
            </span>
            <span className="flex items-center gap-2 text-text-secondary font-medium">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              {t("anyAI")}
            </span>
          </div>
        </div>
      </section>

      {/* The Problem / Solution */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("gapTitle")}
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              {t("gapSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-surface/40 border border-white/10 rounded-2xl p-6 md:p-8">
              <div className="inline-block text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full mb-4 font-semibold">
                {t("withoutFramework")}
              </div>
              <p className="text-text-secondary leading-relaxed text-sm md:text-base">
                {t("withoutDesc")}
              </p>
              <p className="text-red-400/60 text-xs mt-4 italic">
                {t("withoutResult")}
              </p>
            </div>

            <div className="bg-surface/60 border border-gold/20 rounded-2xl p-6 md:p-8 card-glow">
              <div className="inline-block text-xs bg-gold/10 text-gold border border-gold/20 px-3 py-1 rounded-full mb-4 font-semibold">
                {t("withFramework")}
              </div>
              <p className="text-text-secondary leading-relaxed text-sm md:text-base">
                {t("withDesc")}
              </p>
              <p className="text-gold/60 text-xs mt-4 italic">
                {t("withResult")}
              </p>
            </div>
          </div>

          <p className="text-center text-text-secondary">
            {t("gapBottom")}
          </p>
        </div>
      </section>

      {/* Who Is This For */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {locale === "en" ? (
                <>Built For People Who <span className="gradient-gold">Execute</span></>
              ) : locale === "ja" ? (
                <><span className="gradient-gold">実行</span>する人のために作られた</>
              ) : (
                <><span className="gradient-gold">실행</span>하는 사람을 위해 만들어짐</>
              )}
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              {t("builtForSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {targetAudiences.map((a) => (
              <div
                key={a.title}
                className="bg-surface/60 border border-white/5 rounded-2xl p-6 hover:border-gold/20 transition-all"
              >
                <div className="w-10 h-10 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center mb-4">
                  {a.icon === "rocket" && (
                    <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>
                  )}
                  {a.icon === "chart" && (
                    <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                  )}
                  {a.icon === "store" && (
                    <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.15c0 .415.336.75.75.75z" /></svg>
                  )}
                  {a.icon === "pen" && (
                    <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                  )}
                </div>
                <h3 className="font-bold text-text-primary mb-2">{a.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Guide CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-gold/5 via-gold/10 to-gold/5 border-y border-gold/10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="inline-block bg-gold/10 border border-gold/20 text-gold text-xs font-semibold px-3 py-1 rounded-full tracking-wide uppercase mb-4">
            Free Resource
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Get Your Free AI Starter Guide
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto mb-6">
            Not ready to buy? Start with our free guide — learn how AI can automate 6 proven business frameworks in just 15 minutes.
          </p>
          <Link
            href="/free-guide"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all transform hover:scale-105 bg-gold text-navy-dark hover:bg-gold-light"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download Free Guide
          </Link>
        </div>
      </section>

      {/* Books Preview */}
      <section id="books" className="py-20 bg-navy-dark/40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gold rounded-full" />
              <h2 className="text-3xl md:text-4xl font-bold">{t("booksTitle")}</h2>
              <div className="w-1 h-6 bg-gold rounded-full" />
            </div>
            <p className="text-text-secondary">
              {t("booksSub")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {books.map((book) => (
              <Link
                key={book.id}
                href={`/products/${book.slug}`}
                className="group bg-surface/60 border border-white/5 rounded-2xl p-6 card-glow hover:border-gold/20 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-navy-dark/60 border border-gold/10 rounded-xl flex items-center justify-center text-2xl">
                    {book.icon}
                  </div>
                  <div>
                    <div className="text-xs text-gold/70 font-semibold">Vol. {book.vol}</div>
                    <div className="text-xs text-text-secondary">{book.framework}</div>
                  </div>
                </div>
                <h3 className="font-bold text-text-primary mb-2 group-hover:text-gold transition-colors">
                  {book.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed mb-3">
                  {book.shortDescription}
                </p>
                <div className="text-xs text-text-muted italic">&ldquo;{book.caseStudy.result}&rdquo;</div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors font-semibold"
            >
              {t("viewAllBooks")}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("howItWorks")}</h2>
            <p className="text-text-secondary">{t("howItWorksSub")}</p>
          </div>

          <div className="space-y-6">
            {steps.map((s) => (
              <div key={s.step} className="flex gap-6">
                <div className="shrink-0 w-12 h-12 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center font-bold text-gold text-sm">
                  {s.step}
                </div>
                <div className="flex-1 py-1">
                  <h3 className="font-bold text-text-primary mb-1">{s.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Results */}
      <section className="py-20 bg-navy-dark/40">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("documentedResults")}</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              {t("documentedResultsSub")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {caseStudies.map((r) => (
              <div key={r.result} className="bg-surface/60 border border-white/5 rounded-2xl p-5 card-glow">
                <div className="text-gold font-bold text-lg mb-1">{r.result}</div>
                <div className="text-text-primary text-sm font-semibold mb-2">{r.who}</div>
                <div className="text-text-secondary text-xs">{r.how}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("whatUsersAreSaying")}</h2>
            <p className="text-text-secondary">{t("whatUsersAreSayingSub")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((tl) => (
              <div key={tl.name} className="bg-surface/60 border border-white/5 rounded-2xl p-6 flex flex-col">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-4 flex-1 italic">
                  &ldquo;{tl.quote}&rdquo;
                </p>
                <div className="border-t border-white/5 pt-4">
                  <div className="bg-gold/10 border border-gold/20 rounded-lg px-3 py-2 mb-3">
                    <div className="text-gold font-bold text-sm">{tl.result}</div>
                  </div>
                  <div className="font-semibold text-text-primary text-sm">{tl.name}</div>
                  <div className="text-text-muted text-xs">{tl.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      {latestPosts.length > 0 && (
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("latestBlog")}</h2>
              <p className="text-text-secondary">{t("latestBlogSub")}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-surface/60 border border-white/5 rounded-2xl p-6 hover:border-gold/20 transition-all card-glow"
                >
                  <div className="text-xs text-text-muted mb-3">
                    <time dateTime={post.date}>{new Date(post.date).toLocaleDateString(dateLocale, { year: "numeric", month: "short", day: "numeric" })}</time>
                    <span className="mx-2">&middot;</span>
                    <span>{post.readingTime}</span>
                  </div>
                  <h3 className="font-bold text-text-primary mb-2 group-hover:text-gold transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-text-secondary line-clamp-3">{post.description}</p>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors font-semibold"
              >
                {t("viewAllArticles")}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Bundle CTA — Pricing Comparison */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/3 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          {/* Launch Pricing Urgency */}
          <div className="mb-8 bg-gold/10 border border-gold/30 rounded-xl px-5 py-3 text-center max-w-lg mx-auto">
            <p className="text-sm text-gold font-semibold">
              Launch pricing — $47 for all 6 books. Price increases as new volumes are added.
            </p>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-10 text-center">
            <span className="gradient-gold">{t("choosePath")}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Individual */}
            <div className="bg-surface/40 border border-white/10 rounded-2xl p-6 text-center">
              <h3 className="font-semibold text-text-secondary mb-2 text-sm uppercase tracking-wide">{t("individualBook")}</h3>
              <div className="text-4xl font-bold text-text-primary mb-1">$17</div>
              <div className="text-text-muted text-sm mb-6">{t("perBook")}</div>
              <ul className="text-left space-y-3 mb-6 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-text-muted mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {t("oneFramework")}
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-text-muted mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {t("systemPromptTemplates")}
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-text-muted mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {t("fiveDayQuickstart")}
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-text-muted mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                  <span className="text-text-muted">6 books = ${17 * 6}</span>
                </li>
              </ul>
              <Link
                href="/products"
                className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl font-semibold text-text-secondary border border-white/10 hover:border-gold/30 hover:text-gold transition-all text-sm"
              >
                {t("browseIndividual")}
              </Link>
            </div>

            {/* Bundle — Most Popular */}
            <div className="relative bg-surface/60 border-2 border-gold/30 rounded-2xl p-6 text-center card-glow">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-navy-dark text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide whitespace-nowrap">
                {t("mostPopular")} — Save ${bundle.originalPrice - bundle.price}
              </div>
              <h3 className="font-semibold text-gold mb-2 text-sm uppercase tracking-wide mt-2">{t("completeBundle")}</h3>
              <div className="flex items-center justify-center gap-3 mb-1">
                <span className="text-xl text-text-secondary line-through decoration-red-400">${bundle.originalPrice}</span>
                <span className="text-4xl font-bold text-gold">${bundle.price}</span>
              </div>
              <div className="text-text-muted text-sm mb-6">${Math.round((bundle.price / 6) * 100) / 100}/book — {bundle.discount}% off</div>
              <ul className="text-left space-y-3 mb-6 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-gold mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-text-primary font-medium">{t("allSixGuides")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-gold mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-text-primary font-medium">{t("allSixPrompts")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-gold mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {t("lifetimeUpdates")}
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-gold mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {tc("moneyBack")}
                </li>
              </ul>
              <BuyButton href={bundleUrl} paddlePriceId={bundlePaddlePriceId} paddleSuccessUrl={`${siteUrl}/thank-you?product=Complete+Bundle`} className="w-full text-lg py-4">
                {th("cta")} &mdash; ${bundle.price}
              </BuyButton>
              <p className="text-xs text-text-muted mt-3">
                {th("trust")}
              </p>
            </div>
          </div>

          {/* Guarantee Badge */}
          <div className="max-w-md mx-auto mt-10 bg-surface/60 border border-green-500/20 rounded-2xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-green-500/10 border border-green-500/20 rounded-full mb-4">
              <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h3 className="font-bold text-text-primary mb-2">{t("guaranteeBadge")}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {t("guaranteeText")}
            </p>
          </div>

          <p className="text-center text-text-muted text-xs mt-6">
            {t("sourceBooks")}
          </p>
        </div>
      </section>

      {/* FAQ — native details for zero JS */}
      <section className="py-20 bg-navy-dark/40">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t("faqTitle")}</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <details
                key={faq.q}
                className="group bg-surface/60 border border-white/5 rounded-xl overflow-hidden hover:border-gold/20 transition-colors"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none select-none">
                  <h3 className="font-semibold text-text-primary pr-4">{faq.q}</h3>
                  <svg
                    className="w-5 h-5 text-gold shrink-0 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </summary>
                <div id={`faq-home-answer-${idx}`} className="px-6 pb-6">
                  <p className="text-text-secondary text-sm leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <StickyMobileCTA
        bundlePrice={bundle.price}
        bundleUrl={bundleUrl}
        paddlePriceId={bundlePaddlePriceId}
        paddleSuccessUrl={`${siteUrl}/thank-you?product=Complete+Bundle`}
        labels={{
          completeBundle: t("completeBundle"),
          instantDownload: tc("instantDownload"),
          moneyBack: tc("moneyBack"),
          getBundle: tc("getBundle"),
        }}
      />
    </>
  );
}
