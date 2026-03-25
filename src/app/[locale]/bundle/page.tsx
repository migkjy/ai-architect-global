import type { Metadata } from "next";
import Link from "next/link";
import { books, bundle, getBundleUrl, getBundlePaddlePriceId } from "@/lib/products";
import dynamic from "next/dynamic";
const BuyButton = dynamic(() => import("@/components/BuyButton"));
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

const bundleMeta: Record<string, { title: string; description: string; ogDescription: string }> = {
  en: {
    title: "Complete Bundle — All 6 AI Business Automation Guides for $47",
    description: "Get all 6 AI native business guides for $47. Business automation with AI: marketing, copywriting, product launches, content strategy. Russell Brunson, Jeff Walker, Jim Edwards frameworks. Save $55.",
    ogDescription: "Six AI-powered business automation systems: marketing funnels, brand building, traffic, copywriting, product launches, and content. One AI marketing playbook bundle. Instant PDF download.",
  },
  ko: {
    title: "완전 번들 — AI Native Playbook 6권 전체 $47",
    description: "AI Native Playbook 6권 전체 $47. Russell Brunson, Jeff Walker, Jim Edwards, Nicolas Cole의 프레임워크를 AI로 실행. $55 절약. 즉시 PDF 다운로드.",
    ogDescription: "마케팅, 브랜딩, 트래픽, 카피라이팅, 제품 런칭, 콘텐츠를 위한 6개 AI 시스템. 하나의 가격. 즉시 다운로드.",
  },
  ja: {
    title: "完全バンドル — AI Native Playbook全6冊 $47",
    description: "AI Native Playbook全6冊を$47で。Russell Brunson、Jeff Walker、Jim Edwards、Nicolas Coleの実証済みフレームワークをAIで実行。$55お得。即時PDFダウンロード。",
    ogDescription: "マーケティング、ブランディング、トラフィック、コピーライティング、製品ローンチ、コンテンツのための6つのAIシステム。一つの価格。即時ダウンロード。",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com").trim();
  const meta = bundleMeta[locale] ?? bundleMeta.en;
  const canonicalUrl = `${siteUrl}/${locale}/bundle`;

  return {
    title: meta.title,
    description: meta.description,
    keywords: [
      "AI business automation bundle",
      "AI marketing playbook bundle",
      "AI native business guide bundle",
      "business automation with AI",
      "AI powered marketing framework",
      "AI agent skills bundle",
      "Russell Brunson Jeff Walker AI",
      "DotCom Secrets Expert Secrets AI",
      "Product Launch Formula AI",
      "Copywriting Secrets AI",
      "AI sales funnel automation",
      "complete AI business system",
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${siteUrl}/en/bundle`,
        ja: `${siteUrl}/ja/bundle`,
        "x-default": `${siteUrl}/en/bundle`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.ogDescription,
      type: "website",
      locale: locale === "ko" ? "ko_KR" : locale === "ja" ? "ja_JP" : "en_US",
      siteName: "AI Native Playbook Series",
      url: canonicalUrl,
      images: [
        {
          url: `${siteUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "AI Native Playbook Complete Bundle — 6 AI Business Automation Guides",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.ogDescription,
      images: [`${siteUrl}/opengraph-image`],
    },
  };
}

const savedAmount = bundle.originalPrice - bundle.price;

export default async function BundlePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Price ID와 URL은 서버 컴포넌트 함수 내부에서 런타임에 조회
  const bundleUrl = getBundleUrl();
  const bundlePaddlePriceId = getBundlePaddlePriceId();

  const t = await getTranslations("bundle");

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com").trim();

  const bonusItems = [
    {
      title: "AI Native Playbook Master Template",
      description: locale === "ja" ? "6つのフレームワーク全体でAIプロンプトを体系的に整理・再利用するためのNotionデータベース。" : locale === "ko" ? "6가지 프레임워크 전체에서 AI 프롬프트를 체계적으로 정리하고 재사용하기 위한 Notion 데이터베이스." : "A Notion database for organizing and reusing your AI prompts systematically across all 6 frameworks.",
      icon: "📋",
    },
    {
      title: "Execution Tracker",
      description: locale === "ja" ? "AIを使ったフレームワーク実装をステップバイステップで管理するカンバン＋タイムライン。" : locale === "ko" ? "AI를 활용한 프레임워크 구현을 단계별로 관리하는 칸반 + 타임라인." : "Kanban + timeline for managing framework implementation with AI step by step.",
      icon: "🎯",
    },
    {
      title: "Quick Reference Card",
      description: locale === "ja" ? "1ページのフレームワークチートシート — どのプロンプトを、いつ、どのビジネス成果のために使うか。" : locale === "ko" ? "1페이지 프레임워크 치트시트 — 어떤 프롬프트를, 언제, 어떤 비즈니스 성과를 위해 사용할지." : "One-page framework cheat sheet — which prompt to use, when, and for which business outcome.",
      icon: "⚡",
    },
  ];

  const frameworkAxes = [
    {
      axis: locale === "ja" ? "マーケティング＆ファネル" : locale === "ko" ? "마케팅 & 퍼널" : "Marketing & Funnels",
      vol: 1,
      author: "Russell Brunson",
      desc: locale === "ja" ? "バリューラダー、Hook-Story-Offer、7フェーズファネルシステム — AIがあなたのビジネスに合わせて設計・実行。" : locale === "ko" ? "밸류 래더, Hook-Story-Offer, 7단계 퍼널 시스템 — AI가 당신의 사업에 맞게 설계하고 실행." : "Value Ladder, Hook-Story-Offer, and 7-phase funnel system — AI designs and executes for your specific business.",
    },
    {
      axis: locale === "ja" ? "ブランド＆ポジショニング" : locale === "ko" ? "브랜드 & 포지셔닝" : "Brand & Positioning",
      vol: 2,
      author: "Russell Brunson",
      desc: locale === "ja" ? "マスムーブメント設計、エピファニーブリッジストーリーテリング、パーフェクトウェビナースクリプト — AIがブランド権威を構築。" : locale === "ko" ? "매스 무브먼트 설계, 에피파니 브릿지 스토리텔링, 퍼펙트 웨비나 스크립트 — AI가 브랜드 권위를 구축." : "Mass Movement design, Epiphany Bridge storytelling, and Perfect Webinar script — AI builds your brand authority.",
    },
    {
      axis: locale === "ja" ? "トラフィック獲得" : locale === "ko" ? "트래픽 확보" : "Traffic Acquisition",
      vol: 3,
      author: "Russell Brunson",
      desc: locale === "ja" ? "Dream 100戦略とプラットフォーム別コンテンツ — AIが顧客を見つけ、所有するトラフィックに変換。" : locale === "ko" ? "Dream 100 전략과 플랫폼별 콘텐츠 — AI가 고객을 찾고 소유 트래픽으로 전환." : "Dream 100 strategy and platform-specific content — AI finds your customers and converts traffic you own.",
    },
    {
      axis: locale === "ja" ? "セールスコピー" : locale === "ko" ? "세일즈 카피" : "Sales Copy",
      vol: 4,
      author: "Jim Edwards",
      desc: locale === "ja" ? "AIが適用する31のコピーライティング公式 — パーソナルストーリーマイニング、ヒーローズジャーニー、あらゆるチャネルのヘッドライン生成。" : locale === "ko" ? "AI가 적용하는 31가지 카피라이팅 공식 — 개인 스토리 마이닝, 히어로즈 저니, 모든 채널의 헤드라인 생성." : "31 copywriting formulas applied by AI — personal story mining, hero's journey, headline generation across every channel.",
    },
    {
      axis: locale === "ja" ? "製品ローンチ" : locale === "ko" ? "제품 런칭" : "Product Launch",
      vol: 5,
      author: "Jeff Walker",
      desc: locale === "ja" ? "完全なPLF 4フェーズシーケンス — AIが適切なタイミングで全メール、コンテンツ、トリガーを生成。" : locale === "ko" ? "완전한 PLF 4단계 시퀀스 — AI가 적절한 타이밍에 모든 이메일, 콘텐츠, 트리거를 생성." : "Full PLF 4-phase sequence — AI generates every email, content piece, and trigger at exactly the right moment.",
    },
    {
      axis: locale === "ja" ? "コンテンツ戦略" : locale === "ko" ? "콘텐츠 전략" : "Content Strategy",
      vol: 6,
      author: "Nicolas Cole",
      desc: locale === "ja" ? "カテゴリー設計、無限のアイデア、コンテンツの原子化 — AIが体系的な部分を担当し、あなたは創作に集中。" : locale === "ko" ? "카테고리 설계, 무한 아이디어, 콘텐츠 원자화 — AI가 체계적인 부분을 담당하고 당신은 창작에 집중." : "Category design, infinite ideas, content atomization — AI runs the systematic parts while you focus on creative work.",
    },
  ];

  const valueRows = [
    {
      label: locale === "ja" ? "原著（6冊合計）" : locale === "ko" ? "원저(6권 합계)" : "Source books (6 total)",
      detail: "DotCom Secrets, Expert Secrets, Traffic Secrets, Copywriting Secrets, Launch, Online Writing",
      value: "~$175+",
    },
    {
      label: locale === "ja" ? "フレームワーク適用の戦略コンサルティング" : locale === "ko" ? "프레임워크 적용 전략 컨설팅" : "Strategy consulting to apply them",
      detail: locale === "ja" ? "エージェンシーがクライアントにこれらのフレームワークを実装する際の費用" : locale === "ko" ? "에이전시가 클라이언트에게 이 프레임워크를 구현할 때 청구하는 비용" : "What agencies charge to implement these frameworks for clients",
      value: "$2,000–$10,000+",
    },
    {
      label: locale === "ja" ? "AI無しで読書＋実装にかかる時間" : locale === "ko" ? "AI 없이 읽기 + 구현에 걸리는 시간" : "Time reading + implementing without AI",
      detail: locale === "ja" ? "1冊あたり約8時間 = 最初のキャンペーン前に48時間以上" : locale === "ko" ? "책당 약 8시간 = 첫 캠페인 전 48시간 이상" : "~8 hours per book = 48+ hours before you run your first campaign",
      value: "48+h",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: bundle.title,
    description:
      "6 AI-powered PDF guides that turn Russell Brunson, Jeff Walker, Jim Edwards, and Nicolas Cole's business frameworks into executable AI systems.",
    url: `${siteUrl}/bundle`,
    image: {
      "@type": "ImageObject",
      url: `${siteUrl}/opengraph-image`,
      width: 1200,
      height: 630,
    },
    brand: { "@type": "Brand", name: "AI Native Playbook Series" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "214",
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        author: { "@type": "Person", name: "Marcus T." },
        reviewBody: "Applied DotCom Secrets through AI and went from $0 to $4,200/month in 60 days. Incredible value.",
      },
      {
        "@type": "Review",
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        author: { "@type": "Person", name: "Sarah K." },
        reviewBody: "The bundle paid for itself in week one. The AI prompts execute the frameworks immediately.",
      },
    ],
    offers: {
      "@type": "AggregateOffer",
      lowPrice: bundle.price.toString(),
      highPrice: bundle.price.toString(),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      offerCount: "1",
      offers: [
        {
          "@type": "Offer",
          name: "Complete Bundle — All 6 AI Business Automation Guides",
          price: bundle.price.toString(),
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${siteUrl}/bundle`,
          priceValidUntil: "2026-12-31",
          seller: { "@type": "Organization", name: "AI Native Playbook Series", url: siteUrl },
        },
      ],
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "AI Native Playbook Series", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Complete Bundle", item: `${siteUrl}/bundle` },
    ],
  };

  function escapeJsonLd(json: string): string {
    return json.replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
  }

  const reviews = [
    { name: t("review1Name"), role: t("review1Role"), text: t("review1Text"), stars: 5 },
    { name: t("review2Name"), role: t("review2Role"), text: t("review2Text"), stars: 5 },
    { name: t("review3Name"), role: t("review3Role"), text: t("review3Text"), stars: 5 },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(jsonLd)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(breadcrumbJsonLd)) }} />

      <div className="min-h-screen pt-24">
        {/* Hero — Enhanced Price Anchoring */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <span className="inline-block bg-gold text-navy-dark text-xs font-bold px-4 py-1.5 rounded-full mb-6">
              {t("badge")}
            </span>

            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              {t("title1")}
              <br />
              <span className="gradient-gold">{t("title2")}</span>
            </h1>

            <p className="text-text-secondary text-lg mb-4 max-w-2xl mx-auto leading-relaxed">
              {t("subtitle")}
            </p>

            {/* Social proof mini-bar */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="flex items-center gap-0.5 text-gold">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <span className="text-sm text-text-secondary">{t("socialProofRating")}</span>
            </div>

            <div className="inline-flex flex-col items-center bg-surface/60 backdrop-blur-sm border-2 border-gold/30 rounded-2xl p-8 card-glow mb-6">
              {/* Price anchoring: individual vs bundle */}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl text-text-secondary line-through decoration-red-400">${bundle.originalPrice}</span>
                <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg">SAVE ${savedAmount}</span>
                <span className="bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">{t("savePct")}</span>
              </div>
              <div className="text-5xl font-bold text-gold mb-1">${bundle.price}</div>
              <p className="text-xs text-text-secondary mb-4">{t("perBook")}</p>
              <p className="text-sm text-green-400 font-medium mb-6">
                {t("urgencyNote")}
              </p>
              <BuyButton
                href={bundleUrl}
                paddlePriceId={bundlePaddlePriceId}
                paddleSuccessUrl={`${siteUrl}/thank-you?product=Complete+Bundle`}
                className="w-full text-lg py-4 "
              >
                {t("getComplete")} &mdash; ${bundle.price}
              </BuyButton>
              <p className="text-sm text-text-muted mt-4">{t("pdfGuarantee")}</p>
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gold rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold">{t("whatYouGet")}</h2>
            </div>
            <p className="text-text-secondary mb-10 ml-4">{t("whatYouGetSub")}</p>

            <div className="space-y-4">
              {frameworkAxes.map((axis, i) => (
                <Link
                  key={axis.vol}
                  href={`/products/${books[i].slug}`}
                  className="block bg-surface/60 border border-white/5 rounded-xl p-5 md:p-6 hover:border-gold/20 card-glow transition-all group"
                >
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                    <div className="flex items-center gap-4 md:gap-5 shrink-0">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-navy-dark/60 border border-gold/10 rounded-xl flex items-center justify-center text-2xl md:text-3xl">
                        {books[i].icon}
                      </div>
                      <div>
                        <span className="text-xs text-gold/70 font-bold">Vol. {axis.vol}</span>
                        <h3 className="font-bold text-text-primary group-hover:text-gold transition-colors">{books[i].title}</h3>
                      </div>
                    </div>
                    <div className="flex-1 md:border-l md:border-white/5 md:pl-6">
                      <span className="inline-block text-xs font-semibold text-gold bg-gold/10 px-2.5 py-1 rounded-md mb-2">
                        {axis.axis} — by {axis.author}
                      </span>
                      <p className="text-sm text-text-secondary leading-relaxed">{axis.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Mid-Page CTA — After What You Get */}
        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h3 className="text-xl md:text-2xl font-bold mb-3">{t("midCtaTitle")}</h3>
            <p className="text-text-secondary text-sm mb-6">{t("midCtaSub")}</p>
            <BuyButton
              href={bundleUrl}
              paddlePriceId={bundlePaddlePriceId}
              paddleSuccessUrl={`${siteUrl}/thank-you?product=Complete+Bundle`}
              className="text-lg py-4 px-10"
            >
              {t("getComplete")} &mdash; ${bundle.price}
            </BuyButton>
          </div>
        </section>

        {/* Bonus */}
        <section className="py-16 bg-navy-dark/40">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gold rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold">{t("bonuses")}</h2>
            </div>
            <p className="text-text-secondary mb-10 ml-4">{t("bonusesSub")}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {bonusItems.map((bonus) => (
                <div key={bonus.title} className="bg-surface/60 border border-gold/10 rounded-xl p-5 card-glow">
                  <div className="text-3xl mb-3">{bonus.icon}</div>
                  <h3 className="font-semibold text-text-primary mb-2">{bonus.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{bonus.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof — Reviews */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gold rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold">{t("socialProofTitle")}</h2>
            </div>
            <p className="text-text-secondary mb-10 ml-4">{t("socialProofRating")}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {reviews.map((review) => (
                <div key={review.name} className="bg-surface/60 border border-white/5 rounded-xl p-6 card-glow">
                  <div className="flex items-center gap-0.5 text-gold mb-4">
                    {[...Array(review.stars)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-text-primary text-sm">{review.name}</p>
                    <p className="text-xs text-text-secondary">{review.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Value Comparison */}
        <section className="py-16 bg-navy-dark/40">
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-1 h-6 bg-gold rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold">{t("realValue")}</h2>
            </div>

            <div className="bg-surface/60 border border-white/10 rounded-2xl p-6 md:p-8">
              <div className="space-y-0 mb-6">
                {valueRows.map((row) => (
                  <div key={row.label} className="flex justify-between items-start py-3 border-b border-white/5 gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-text-primary text-sm">{row.label}</p>
                      <p className="text-xs text-text-secondary">{row.detail}</p>
                    </div>
                    <span className="text-text-secondary font-medium shrink-0 text-sm whitespace-nowrap">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="bg-navy-dark/60 rounded-xl p-4 md:p-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-secondary">{t("ifBoughtIndividually")}</span>
                  <span className="text-lg text-text-secondary line-through">${bundle.originalPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-text-primary">{t("aiArchitectBundle")}</span>
                  <span className="text-3xl font-bold text-gold">${bundle.price}</span>
                </div>
                <p className="text-center text-xs text-text-secondary mt-3">{t("sixSystems")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Money-Back Guarantee */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="inline-flex flex-col items-center bg-surface/60 border-2 border-green-500/20 rounded-2xl p-8 md:p-10">
              <div className="w-16 h-16 bg-green-500/10 border-2 border-green-500/30 rounded-full flex items-center justify-center mb-5">
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3">{t("guaranteeTitle")}</h3>
              <p className="text-text-secondary leading-relaxed max-w-lg">{t("guaranteeSub")}</p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-navy-dark/40">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="gradient-gold">{t("readyTitle")}</span>
            </h2>
            <p className="text-text-secondary text-lg mb-4 leading-relaxed">{t("readySub")}</p>

            <div className="inline-flex flex-col items-center bg-surface/60 border-2 border-gold/30 rounded-2xl p-8 mb-6 card-glow">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl text-text-secondary line-through decoration-red-400">${bundle.originalPrice}</span>
                <span className="bg-red-500 text-white text-sm font-bold px-2.5 py-0.5 rounded">SAVE ${savedAmount}</span>
                <span className="bg-green-600 text-white text-xs font-bold px-2.5 py-0.5 rounded">{t("savePct")}</span>
              </div>
              <div className="text-4xl font-bold text-gold mb-1">${bundle.price}</div>
              <p className="text-xs text-text-secondary mb-4">{t("perBook")}</p>
              <p className="text-sm text-green-400 font-medium mb-6">{t("urgencyNote")}</p>

              <BuyButton
                href={bundleUrl}
                paddlePriceId={bundlePaddlePriceId}
                paddleSuccessUrl={`${siteUrl}/thank-you?product=Complete+Bundle`}
                className="w-full text-lg py-4 "
              >
                {t("getComplete")} &mdash; ${bundle.price}
              </BuyButton>
              <p className="text-sm text-text-muted mt-4">{t("pdfGuarantee")}</p>
            </div>

            <p className="text-sm text-text-secondary mb-2">{t("alreadyKnow")}</p>
            <Link href="/products" className="text-gold hover:text-gold-light transition-colors font-semibold">
              {t("viewIndividual")} &rarr;
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
