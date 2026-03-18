import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IntlClientShell from "@/components/IntlClientShell";
import dynamic from "next/dynamic";
const Analytics = dynamic(() => import("@vercel/analytics/react").then(m => ({ default: m.Analytics })));
const SpeedInsights = dynamic(() => import("@vercel/speed-insights/next").then(m => ({ default: m.SpeedInsights })));
const PostHogProvider = dynamic(() => import("@/components/PostHogProvider").then(m => ({ default: m.PostHogProvider })));
import { routing } from "@/i18n/routing";
import { MetaPixel } from "@/components/MetaPixel";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com").trim();

const OG_LOCALE_MAP: Record<string, string> = {
  en: "en_US",
  ja: "ja_JP",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const ogLocale = OG_LOCALE_MAP[locale] ?? "en_US";
  const pageUrl = locale === "en" ? SITE_URL : `${SITE_URL}/${locale}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "AI Native Playbook — AI Architecture Patterns for Business Automation",
      template: "%s | AI Native Playbook",
    },
    description:
      "AI Native Playbook: proven AI architecture patterns that automate world-class business frameworks. 6 AI-native guides for entrepreneurs. Start executing — bundle $47.",
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
      "Russell Brunson DotCom Secrets AI",
      "Jeff Walker Product Launch Formula AI",
      "Jim Edwards Copywriting Secrets AI",
      "Nicolas Cole online writing AI",
      "AI sales funnel automation",
      "AI copywriting framework",
      "AI marketing system",
      "online business AI tools",
      "AI content strategy",
    ],
    authors: [{ name: "AI Native Playbook Series" }],
    openGraph: {
      title: "AI Native Playbook — AI Architecture Patterns for Business Automation",
      description:
        "The AI Native Playbook puts proven AI architecture patterns into the hands of entrepreneurs. Russell Brunson, Jeff Walker, Jim Edwards systems — automated with AI today.",
      type: "website",
      locale: ogLocale,
      siteName: "AI Native Playbook",
      url: pageUrl,
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "AI Native Playbook — AI Architecture Patterns",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "AI Native Playbook — AI Architecture Patterns for Business Automation",
      description:
        "Stop reading business books. Start running the frameworks with AI architecture patterns. 6 PDF guides that make DotCom Secrets, PLF, Copywriting Secrets executable today.",
      images: [`${SITE_URL}/opengraph-image`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        en: SITE_URL,
        ja: `${SITE_URL}/ja`,
        "x-default": SITE_URL,
      },
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f0f23",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function buildSiteJsonLd(locale: string, siteUrl: string) {
  const names: Record<string, string> = {
    en: "AI Native Playbook Series",
    ko: "AI 아키텍트 시리즈",
    ja: "AI アーキテクトシリーズ",
  };
  const descriptions: Record<string, string> = {
    en: "6 world-class business frameworks automated with AI.",
    ko: "Russell Brunson, Jeff Walker, Jim Edwards의 비즈니스 프레임워크를 AI로 자동화.",
    ja: "世界クラスのビジネスフレームワークをAIで自動化。",
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: names[locale] ?? names.en,
        url: locale === "en" ? siteUrl : `${siteUrl}/${locale}`,
        description: descriptions[locale] ?? descriptions.en,
        inLanguage: locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en-US",
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/blog?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "AI Native Playbook Series",
        legalName: "NewBizSoft",
        url: siteUrl,
        description: descriptions[locale] ?? descriptions.en,
        foundingDate: "2024",
        areaServed: "Worldwide",
        sameAs: [
          "https://ai-driven-architect.com",
        ],
        logo: {
          "@type": "ImageObject",
          "@id": `${siteUrl}/#logo`,
          url: `${siteUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          caption: "AI Native Playbook Series",
        },
        image: { "@id": `${siteUrl}/#logo` },
        knowsAbout: [
          "AI Native Playbook",
          "AI Architecture Patterns",
          "AI Business Automation",
          "AI Marketing Frameworks",
          "Business Automation with AI",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          email: "contact@newbizsoft.com",
          contactType: "customer service",
          availableLanguage: ["English", "Korean", "Japanese"],
        },
      },
    ],
  };
}

function escapeJsonLd(json: string): string {
  return json.replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const [tExit, tScroll] = await Promise.all([
    getTranslations({ locale, namespace: "exitPopup" }),
    getTranslations({ locale, namespace: "scrollBanner" }),
  ]);

  const siteJsonLd = buildSiteJsonLd(locale, SITE_URL);

  return (
    <html lang={locale} className={inter.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="naver-site-verification" content="a6ff1a6273de52eee09a6d7965035cb60726a641" />
        <meta name="naver-site-verification" content="cda8874de26392058a4eacc1de62c73bf59ff7ef" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN && (
          <>
            <link rel="preconnect" href="https://cdn.paddle.com" crossOrigin="anonymous" />
            <link rel="dns-prefetch" href="https://cdn.paddle.com" />
          </>
        )}
        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        {process.env.NEXT_PUBLIC_POSTHOG_KEY && (
          <link rel="dns-prefetch" href="https://us.i.posthog.com" />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(siteJsonLd)) }}
        />
        {/* GA4 */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-76C0HSW5LB" strategy="lazyOnload" />
        <Script id="ga4-ai-architect-io" strategy="lazyOnload">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-76C0HSW5LB');`}
        </Script>
        {/* Paddle Billing — overlay checkout (Client Token 미설정 시 로드하지 않음) */}
        {process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN && (
          <>
            <Script
              src="https://cdn.paddle.com/paddle/v2/paddle.js"
              strategy="lazyOnload"
            />
            <Script id="paddle-init" strategy="lazyOnload">
              {`
                (function() {
                  var checkPaddle = setInterval(function() {
                    if (typeof window.Paddle !== 'undefined') {
                      clearInterval(checkPaddle);
                      var env = '${process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT ?? "sandbox"}';
                      if (env === 'sandbox' && window.Paddle.Environment) {
                        window.Paddle.Environment.set('sandbox');
                      }
                      window.Paddle.Setup({ token: '${process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN}' });
                    }
                  }, 100);
                })();
              `}
            </Script>
          </>
        )}
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-navy text-text-primary font-sans">
        <MetaPixel />
        {/* PostHog pageview tracking — isolated Suspense so it never blocks paint */}
        <Suspense fallback={null}>
          <PostHogProvider>{null}</PostHogProvider>
        </Suspense>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:rounded-md focus:bg-gold focus:px-4 focus:py-2 focus:text-navy-dark focus:text-sm focus:font-medium">
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        {/* Deferred interactive overlays — loaded after main content */}
        <IntlClientShell
          exitPopupLabels={{
            successTitle: tExit("successTitle"),
            successDesc: tExit("successDesc"),
            badge: tExit("badge"),
            title: tExit("title"),
            subtitle: tExit("subtitle"),
            benefit1: tExit("benefit1"),
            benefit2: tExit("benefit2"),
            benefit3: tExit("benefit3"),
            cta: tExit("cta"),
            noSpam: tExit("noSpam"),
            dismiss: tExit("dismiss"),
          }}
          scrollBannerLabels={{
            title: tScroll("title"),
            badge: tScroll("badge"),
            success: tScroll("success"),
            cta: tScroll("cta"),
            error: tScroll("error"),
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
