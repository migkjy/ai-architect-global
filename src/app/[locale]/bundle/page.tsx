import type { Metadata } from "next";
import Link from "next/link";
import { books, bundle, getBundleUrl, getBundlePaddlePriceId } from "@/lib/products";
import dynamic from "next/dynamic";
const BuyButton = dynamic(() => import("@/components/BuyButton"));
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

const bundleMeta: Record<string, { title: string; description: string; ogDescription: string }> = {
  en: {
    title: "Complete Bundle — All 6 AI Native Playbook Books for $47",
    description: "All 6 AI Native Playbook books for $47. Apply Russell Brunson, Jeff Walker, Jim Edwards, and Nicolas Cole's proven frameworks with AI. Save $55. Instant PDF download.",
    ogDescription: "Six AI-powered systems for marketing, branding, traffic, copywriting, product launches, and content. One price. Instant PDF download.",
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";
  const meta = bundleMeta[locale] ?? bundleMeta.en;
  const canonicalUrl = locale === "en" ? `${siteUrl}/bundle` : `${siteUrl}/${locale}/bundle`;

  return {
    title: meta.title,
    description: meta.description,
    keywords: [
      "AI Native Playbook bundle",
      "AI business framework bundle",
      "Russell Brunson Jeff Walker AI",
      "DotCom Secrets Expert Secrets AI",
      "Product Launch Formula AI",
      "Copywriting Secrets AI",
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${siteUrl}/bundle`,
        ko: `${siteUrl}/ko/bundle`,
        ja: `${siteUrl}/ja/bundle`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.ogDescription,
      type: "website",
      locale: locale === "ko" ? "ko_KR" : locale === "ja" ? "ja_JP" : "en_US",
      siteName: "AI Native Playbook Series",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.ogDescription,
    },
  };
}

const bundleUrl = getBundleUrl();
const bundlePaddlePriceId = getBundlePaddlePriceId();
const savedAmount = bundle.originalPrice - bundle.price;

export default async function BundlePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("bundle");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";

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
    brand: { "@type": "Brand", name: "AI Native Playbook Series" },
    offers: {
      "@type": "Offer",
      price: bundle.price.toString(),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/bundle`,
      seller: { "@type": "Organization", name: "AI Native Playbook Series", url: siteUrl },
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(jsonLd)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(breadcrumbJsonLd)) }} />

      <div className="min-h-screen pt-24">
        {/* Hero */}
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

            <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              {t("subtitle")}
            </p>

            <div className="inline-flex flex-col items-center bg-surface/60 backdrop-blur-sm border-2 border-gold/30 rounded-2xl p-8 card-glow mb-6">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-xl text-text-secondary line-through decoration-red-400">${bundle.originalPrice}</span>
                <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg">SAVE ${savedAmount}</span>
              </div>
              <div className="text-5xl font-bold text-gold mb-2">${bundle.price}</div>
              <p className="text-sm text-green-400 font-medium mb-6">
                ${savedAmount} off
              </p>
              <BuyButton
                href={bundleUrl}
                paddlePriceId={bundlePaddlePriceId}
                paddleSuccessUrl={`${siteUrl}/thank-you?product=Complete+Bundle`}
                className="w-full text-lg py-4 animate-pulse-subtle"
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

        {/* Value Comparison */}
        <section className="py-16">
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

        {/* Final CTA */}
        <section className="py-16 bg-navy-dark/40">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="gradient-gold">{t("readyTitle")}</span>
            </h2>
            <p className="text-text-secondary text-lg mb-4 leading-relaxed">{t("readySub")}</p>

            <div className="inline-flex flex-col items-center bg-surface/60 border-2 border-gold/30 rounded-2xl p-8 mb-8 card-glow">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl text-text-secondary line-through decoration-red-400">${bundle.originalPrice}</span>
                <span className="bg-red-500 text-white text-sm font-bold px-2.5 py-0.5 rounded">SAVE ${savedAmount}</span>
              </div>
              <div className="text-4xl font-bold text-gold mb-6">${bundle.price}</div>

              <BuyButton
                href={bundleUrl}
                paddlePriceId={bundlePaddlePriceId}
                paddleSuccessUrl={`${siteUrl}/thank-you?product=Complete+Bundle`}
                className="w-full text-lg py-4 animate-pulse-subtle"
              >
                {t("getComplete")} &mdash; ${bundle.price}
              </BuyButton>
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
