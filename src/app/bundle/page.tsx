import type { Metadata } from "next";
import Link from "next/link";
import { books, bundle, getBundleUrl } from "@/lib/products";
import BuyButton from "@/components/BuyButton";

export const metadata: Metadata = {
  title: "Complete Bundle — All 6 AI Architect Books for $47",
  description:
    "Get all 6 AI Architect books in one bundle for $47. Apply Russell Brunson, Jeff Walker, Jim Edwards, and Nicolas Cole's proven frameworks with AI. Save $55 vs buying individually. Instant PDF download. 7-day money-back guarantee.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-architect.io"}/bundle`,
  },
  openGraph: {
    title: "Complete Bundle — All 6 AI Architect Books for $47",
    description:
      "Six AI-powered systems for marketing, branding, traffic, copywriting, product launches, and content. One price. Instant PDF download.",
    type: "website",
    locale: "en_US",
    siteName: "AI Architect Series",
  },
};

const bonusItems = [
  {
    title: "AI Architect Master Template",
    description: "A Notion database for organizing and reusing your AI prompts systematically across all 6 frameworks.",
    icon: "📋",
  },
  {
    title: "Execution Tracker",
    description: "Kanban + timeline for managing framework implementation with AI step by step.",
    icon: "🎯",
  },
  {
    title: "Quick Reference Card",
    description: "One-page framework cheat sheet — which prompt to use, when, and for which business outcome.",
    icon: "⚡",
  },
];

const frameworkAxes = [
  {
    axis: "Marketing & Funnels",
    vol: 1,
    author: "Russell Brunson",
    desc: "Value Ladder, Hook-Story-Offer, and 7-phase funnel system — AI designs and executes for your specific business.",
  },
  {
    axis: "Brand & Positioning",
    vol: 2,
    author: "Russell Brunson",
    desc: "Mass Movement design, Epiphany Bridge storytelling, and Perfect Webinar script — AI builds your brand authority.",
  },
  {
    axis: "Traffic Acquisition",
    vol: 3,
    author: "Russell Brunson",
    desc: "Dream 100 strategy and platform-specific content — AI finds your customers and converts traffic you own.",
  },
  {
    axis: "Sales Copy",
    vol: 4,
    author: "Jim Edwards",
    desc: "31 copywriting formulas applied by AI — personal story mining, hero's journey, headline generation across every channel.",
  },
  {
    axis: "Product Launch",
    vol: 5,
    author: "Jeff Walker",
    desc: "Full PLF 4-phase sequence — AI generates every email, content piece, and trigger at exactly the right moment.",
  },
  {
    axis: "Content Strategy",
    vol: 6,
    author: "Nicolas Cole",
    desc: "Category design, infinite ideas, content atomization — AI runs the systematic parts while you focus on creative work.",
  },
];

const bundleUrl = getBundleUrl();
const savedAmount = bundle.originalPrice - bundle.price;

export default function BundlePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: bundle.title,
    description:
      "6 AI-powered PDF guides that turn Russell Brunson, Jeff Walker, Jim Edwards, and Nicolas Cole's business frameworks into executable AI systems.",
    offers: {
      "@type": "Offer",
      price: bundle.price.toString(),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen pt-24">
        {/* Hero */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <span className="inline-block bg-gold text-navy-dark text-xs font-bold px-4 py-1.5 rounded-full mb-6">
              COMPLETE BUNDLE — ALL 6 BOOKS
            </span>

            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Six World-Class Frameworks.
              <br />
              <span className="gradient-gold">Fully Automated with AI.</span>
            </h1>

            <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Marketing. Branding. Traffic. Copywriting. Product Launch. Content.
              <br className="hidden md:block" />
              Six proven systems. One AI-powered bundle. One price.
            </p>

            <div className="inline-flex flex-col items-center bg-surface/60 backdrop-blur-sm border-2 border-gold/30 rounded-2xl p-8 card-glow mb-6">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-xl text-text-secondary line-through decoration-red-400">
                  ${bundle.originalPrice}
                </span>
                <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg">
                  SAVE ${savedAmount}
                </span>
              </div>
              <div className="text-5xl font-bold text-gold mb-2">${bundle.price}</div>
              <p className="text-sm text-green-400 font-medium mb-6">
                ${savedAmount} off buying each book individually
              </p>
              <BuyButton href={bundleUrl} className="w-full text-lg py-4 animate-pulse-subtle">
                Get the Complete Bundle — ${bundle.price}
              </BuyButton>
              <p className="text-sm text-text-muted mt-4">
                Immediate PDF download · 7-day money-back guarantee
              </p>
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gold rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold">What You Get</h2>
            </div>
            <p className="text-text-secondary mb-10 ml-4">
              6 premium PDF guides. One complete AI-powered business system.
            </p>

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
                        <h3 className="font-bold text-text-primary group-hover:text-gold transition-colors">
                          {books[i].title}
                        </h3>
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
              <h2 className="text-2xl md:text-3xl font-bold">Bundle Bonuses</h2>
            </div>
            <p className="text-text-secondary mb-10 ml-4">
              Exclusive Notion templates included with the complete bundle.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {bonusItems.map((bonus) => (
                <div
                  key={bonus.title}
                  className="bg-surface/60 border border-gold/10 rounded-xl p-5 card-glow"
                >
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
              <h2 className="text-2xl md:text-3xl font-bold">The Real Value</h2>
            </div>

            <div className="bg-surface/60 border border-white/10 rounded-2xl p-6 md:p-8">
              <div className="space-y-0 mb-6">
                {[
                  {
                    label: "Source books (6 total)",
                    detail: "DotCom Secrets, Expert Secrets, Traffic Secrets, Copywriting Secrets, Launch, Online Writing",
                    value: "~$175+",
                  },
                  {
                    label: "Strategy consulting to apply them",
                    detail: "What agencies charge to implement these frameworks for clients",
                    value: "$2,000–$10,000+",
                  },
                  {
                    label: "Time reading + implementing without AI",
                    detail: "~8 hours per book = 48+ hours before you run your first campaign",
                    value: "48+ hours",
                  },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-start py-3 border-b border-white/5 gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-text-primary text-sm">{row.label}</p>
                      <p className="text-xs text-text-secondary">{row.detail}</p>
                    </div>
                    <span className="text-text-secondary font-medium shrink-0 text-sm whitespace-nowrap">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-navy-dark/60 rounded-xl p-4 md:p-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-secondary">If bought individually</span>
                  <span className="text-lg text-text-secondary line-through">${bundle.originalPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-text-primary">AI Architect Complete Bundle</span>
                  <span className="text-3xl font-bold text-gold">${bundle.price}</span>
                </div>
                <p className="text-center text-xs text-text-secondary mt-3">
                  Six AI-powered systems. Start executing any framework within 24 hours of purchase.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-navy-dark/40">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="gradient-gold">Ready to Start Executing?</span>
            </h2>
            <p className="text-text-secondary text-lg mb-4 leading-relaxed">
              Six frameworks. Six AI systems. One complete business operating system.
            </p>

            <div className="inline-flex flex-col items-center bg-surface/60 border-2 border-gold/30 rounded-2xl p-8 mb-8 card-glow">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl text-text-secondary line-through decoration-red-400">
                  ${bundle.originalPrice}
                </span>
                <span className="bg-red-500 text-white text-sm font-bold px-2.5 py-0.5 rounded">
                  SAVE ${savedAmount}
                </span>
              </div>
              <div className="text-4xl font-bold text-gold mb-6">${bundle.price}</div>

              <BuyButton href={bundleUrl} className="w-full text-lg py-4 animate-pulse-subtle">
                Get the Complete Bundle — ${bundle.price}
              </BuyButton>
            </div>

            <p className="text-sm text-text-secondary mb-2">
              Already know which framework you need most?
            </p>
            <Link href="/products" className="text-gold hover:text-gold-light transition-colors font-semibold">
              View individual books at $17 each →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
