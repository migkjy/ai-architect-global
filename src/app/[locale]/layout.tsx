import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
const Analytics = dynamic(() => import("@vercel/analytics/react").then(m => ({ default: m.Analytics })));
const SpeedInsights = dynamic(() => import("@vercel/speed-insights/next").then(m => ({ default: m.SpeedInsights })));
import { routing } from "@/i18n/routing";
import { MetaPixel } from "@/components/MetaPixel";
const ExitIntentPopup = dynamic(() => import("@/components/ExitIntentPopup"));
const ScrollSubscribeBanner = dynamic(() => import("@/components/ScrollSubscribeBanner"));

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";
const OG_IMAGE = `${SITE_URL}/og-image`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AI Architect Series — 6 World-Class Frameworks, Fully Automated with AI",
    template: "%s | AI Architect Series",
  },
  description:
    "Stop reading about proven business frameworks. Start using them. The AI Architect Series puts Russell Brunson, Jeff Walker, Jim Edwards, and Nicolas Cole's systems into AI-powered tools that work on your specific business.",
  keywords: [
    "AI marketing automation",
    "Russell Brunson DotCom Secrets AI",
    "Jeff Walker Product Launch Formula AI",
    "Jim Edwards Copywriting Secrets AI",
    "Nicolas Cole online writing AI",
    "business framework automation",
    "AI sales funnel",
    "AI copywriting",
    "digital product",
    "online business",
    "AI content strategy",
  ],
  authors: [{ name: "AI Architect Series" }],
  openGraph: {
    title: "AI Architect Series — 6 World-Class Frameworks, Fully Automated with AI",
    description:
      "The AI Architect Series puts Russell Brunson, Jeff Walker, Jim Edwards, and Nicolas Cole's systems into AI-powered tools that execute for your specific business.",
    type: "website",
    locale: "en_US",
    siteName: "AI Architect Series",
    url: SITE_URL,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "AI Architect Series — 6 AI-Powered Business Frameworks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Architect Series — 6 World-Class Frameworks, Fully Automated with AI",
    description:
      "Stop reading business books. Start running the frameworks with AI. 6 PDF guides that make DotCom Secrets, PLF, Copywriting Secrets, and more executable today.",
    images: [OG_IMAGE],
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
    canonical: SITE_URL,
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function buildSiteJsonLd(locale: string, siteUrl: string) {
  const names: Record<string, string> = {
    en: "AI Architect Series",
    ko: "AI 아키텍트 시리즈",
    ja: "AI アーキテクトシリーズ",
  };
  const descriptions: Record<string, string> = {
    en: "6 world-class business frameworks automated with AI.",
    ko: "Russell Brunson, Jeff Walker, Jim Edwards의 비즈니스 프레임워크를 AI로 자동화.",
    ja: "世界クラスのビジネスフレームワークをAIで自動化。",
  };
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: names[locale] ?? names.en,
      url: locale === "en" ? siteUrl : `${siteUrl}/${locale}`,
      description: descriptions[locale] ?? descriptions.en,
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "AI Architect Series",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/og-image`,
        width: 1200,
        height: 630,
      },
      sameAs: [
        "https://richbukae.com",
        "https://aihubkorea.kr",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        email: "contact@newbizsoft.com",
        contactType: "customer service",
      },
    },
  ];
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

  const messages = await getMessages();

  const hreflangLinks = routing.locales.map((loc) => ({
    rel: "alternate" as const,
    hrefLang: loc,
    href: loc === routing.defaultLocale ? SITE_URL : `${SITE_URL}/${loc}`,
  }));

  const siteJsonLd = buildSiteJsonLd(locale, SITE_URL);

  return (
    <html lang={locale}>
      <head>
        {hreflangLinks.map((link) => (
          <link key={link.hrefLang} rel={link.rel} hrefLang={link.hrefLang} href={link.href} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN && (
          <>
            <link rel="preconnect" href="https://cdn.paddle.com" crossOrigin="anonymous" />
            <link rel="dns-prefetch" href="https://cdn.paddle.com" />
          </>
        )}
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link
          rel="preload"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          rel="stylesheet"
          media="print"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          // @ts-expect-error onload is valid HTML attribute
          onLoad="this.media='all'"
        />
        <noscript>
          <link
            rel="stylesheet"
            crossOrigin="anonymous"
            href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(siteJsonLd)) }}
        />
        {/* GA4: ai-driven-architect.com — 자비스 자동 삽입 */}
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
        <MetaPixel />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-navy text-text-primary">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:rounded-md focus:bg-gold focus:px-4 focus:py-2 focus:text-navy-dark focus:text-sm focus:font-medium">
          Skip to content
        </a>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
          <ScrollSubscribeBanner />
          <ExitIntentPopup />
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
