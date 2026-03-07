import type { Metadata } from "next";
import Link from "next/link";
import { books, bundle, getBundleUrl, getProductUrl } from "@/lib/products";
import BuyButton from "@/components/BuyButton";
import FaqAccordion from "@/components/FaqAccordion";
import EmailCapture from "@/components/EmailCapture";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "AI Architect Series — You've Read the Books. Now Let AI Execute the Frameworks.",
  description:
    "6 AI-powered PDF guides turn Russell Brunson, Jeff Walker, Jim Edwards, and Nicolas Cole's frameworks into executable systems you can run today. Bundle: $47. Individual books: $17.",
  keywords: [
    "AI business framework",
    "Russell Brunson AI",
    "DotCom Secrets AI system",
    "Jeff Walker Product Launch Formula AI",
    "Jim Edwards Copywriting Secrets AI",
    "Nicolas Cole AI writing",
    "AI sales funnel automation",
    "business PDF guide",
    "AI marketing system",
    "online business AI",
  ],
  openGraph: {
    title: "AI Architect Series — You've Read the Books. Now Let AI Execute the Frameworks.",
    description:
      "6 AI-powered PDF guides turn world-class business frameworks into executable systems. Bundle: $47.",
    url: "https://ai-driven-architect.com",
    type: "website",
    locale: "en_US",
    siteName: "AI Architect Series",
    images: [
      {
        url: "https://ai-driven-architect.com/og-image",
        width: 1200,
        height: 630,
        alt: "AI Architect Series — 6 AI-Powered Business Frameworks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Architect Series — Let AI Execute the Frameworks",
    description:
      "6 PDF guides that turn Russell Brunson, Jeff Walker, Jim Edwards frameworks into AI-powered systems. Bundle $47.",
    images: ["https://ai-driven-architect.com/og-image"],
  },
  alternates: {
    canonical: "https://ai-driven-architect.com",
    languages: {
      en: "https://ai-driven-architect.com",
      ko: "https://ai-driven-architect.com/ko",
      ja: "https://ai-driven-architect.com/ja",
    },
  },
};

const results = [
  { metric: "500+", label: "Entrepreneurs & marketers using these frameworks" },
  { metric: "5x", label: "Average revenue improvement reported in first 90 days" },
  { metric: "87%", label: "CPA reduction achieved by one SaaS startup using AI Traffic system" },
  { metric: "24h", label: "Average time from purchase to first AI-assisted strategy session" },
];

const testimonials = [
  {
    quote: "I was skeptical about another AI tool. But this actually understood my yoga studio's business model and built a funnel I could use the same day.",
    name: "Sarah M.",
    role: "Yoga Studio Owner",
    result: "$600 to $5,000/mo",
  },
  {
    quote: "The Traffic Architect cut our customer acquisition cost by 87%. We stopped guessing and started scaling.",
    name: "David K.",
    role: "SaaS Founder",
    result: "CPA: $125 to $16",
  },
  {
    quote: "I published 3x per week using the Content Architect framework. In 90 days, I went from zero to 2,400 subscribers.",
    name: "Rachel T.",
    role: "Newsletter Creator",
    result: "0 to 2,400 subs",
  },
];

const faqs = [
  {
    q: "Do I need to have read the original books first?",
    a: "No. Each guide includes the core framework concepts. But if you have read them, the AI system will feel like having a personal implementation coach who already knows the book inside out.",
  },
  {
    q: "Which AI tools does this work with?",
    a: "All system prompts work with Claude, ChatGPT (GPT-4 or above), and Gemini. Any current AI assistant with system prompt support.",
  },
  {
    q: "How long does it take to see results?",
    a: "Each book includes a 5-day quickstart. Most buyers run their first AI-assisted strategy session within 24 hours of purchase.",
  },
  {
    q: "Is this a course or a PDF?",
    a: "PDF guides — immediate download, no login, no platform. Each guide is A4 format, approximately 20 pages, designed to be used alongside your AI tool of choice.",
  },
  {
    q: "Can I buy individual books instead of the bundle?",
    a: `Yes. Each book is available individually at $17. The bundle saves $${bundle.originalPrice - bundle.price} versus buying all six separately.`,
  },
  {
    q: "What if I only use one or two frameworks?",
    a: `At $${bundle.price} for six books, even getting value from two books makes the bundle worth it. But most buyers report using all six within the first month.`,
  },
  {
    q: "What format are the PDFs?",
    a: "A4 format, approximately 20 pages each. They include the framework explanation, step-by-step AI implementation guide, ready-to-use system prompts, and real case studies. No fluff — every page is actionable.",
  },
  {
    q: "What if it doesn't work for my business?",
    a: "Every purchase comes with a 7-day money-back guarantee. If the frameworks don't deliver value for your specific business, email us and we'll refund you immediately. No questions asked.",
  },
  {
    q: "I'm not in the US — will this work for me?",
    a: "Absolutely. The frameworks are universal business principles. They've been applied by entrepreneurs in 30+ countries. The AI systems work in any language — you can describe your business in your preferred language and get framework-driven output.",
  },
];

const bundleUrl = getBundleUrl();

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AI Architect Series",
    url: siteUrl,
    description:
      "6 AI-powered PDF guides turn Russell Brunson, Jeff Walker, Jim Edwards, and Nicolas Cole's business frameworks into executable AI systems.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/products/{search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

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

  const bookListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "AI Architect Series — 6 Books",
    description: "6 AI-powered PDF guides for business framework automation",
    numberOfItems: books.length,
    itemListElement: books.map((book, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: book.title,
      url: `${siteUrl}/products/${book.slug}`,
    })),
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
              6 World-Class Frameworks + AI
            </span>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Used by 500+ entrepreneurs worldwide
              </span>
              <span className="text-white/20">·</span>
              <span>7-day money-back guarantee</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            You&apos;ve Read the Books.
            <br />
            <span className="gradient-gold">Now Let AI Execute the Frameworks.</span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-10 leading-relaxed">
            The AI Architect Series puts 6 world-class business frameworks — from Russell Brunson, Jim Edwards,
            Jeff Walker, and Nicolas Cole — into AI-powered systems that work on your specific business.
            No more &ldquo;how do I apply this?&rdquo; Just results.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <BuyButton href={bundleUrl} className="text-lg px-10 py-4 animate-pulse-subtle">
              Get All 6 Books — ${bundle.price}
            </BuyButton>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-text-secondary border border-white/10 hover:border-gold/30 hover:text-gold transition-all"
            >
              View Individual Books — $17 each
            </Link>
          </div>
          <p className="text-center text-xs text-text-muted mb-8">
            Instant PDF download. No account required. 7-day money-back guarantee.
          </p>

          <div className="flex flex-wrap justify-center gap-3 text-xs text-text-muted" aria-label="Purchase benefits">
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
              <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Instant PDF Download
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
              <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Works with Claude, ChatGPT, Gemini
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
              <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              7-Day Money-Back Guarantee
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
              <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Setup in Under 1 Hour
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

      {/* The Problem / Solution */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The Gap Between Understanding and Execution
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              You&apos;ve invested time reading the best business books. DotCom Secrets. Expert Secrets.
              Traffic Secrets. Copywriting Secrets. Launch. The Art and Business of Online Writing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-surface/40 border border-white/10 rounded-2xl p-6 md:p-8">
              <div className="inline-block text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full mb-4 font-semibold">
                Without a Framework
              </div>
              <p className="text-text-secondary leading-relaxed text-sm md:text-base">
                &ldquo;Design a marketing funnel for my business.&rdquo;
                <br /><br />
                AI gives you a generic AIDA model explanation. Theoretically correct.
                Completely disconnected from your specific product, customer, and market.
                You still don&apos;t know what to actually build.
              </p>
              <p className="text-red-400/60 text-xs mt-4 italic">
                Generic. Textbook. Impossible to execute without guesswork.
              </p>
            </div>

            <div className="bg-surface/60 border border-gold/20 rounded-2xl p-6 md:p-8 card-glow">
              <div className="inline-block text-xs bg-gold/10 text-gold border border-gold/20 px-3 py-1 rounded-full mb-4 font-semibold">
                With AI Architect Framework
              </div>
              <p className="text-text-secondary leading-relaxed text-sm md:text-base">
                AI applies Russell Brunson&apos;s Value Ladder to your business:
                Lead magnet [Free PDF guide] → Tripwire [$27 intro course] →
                Core offer [Monthly membership] → Backend [1-on-1 coaching]...
              </p>
              <p className="text-gold/60 text-xs mt-4 italic">
                Specific. Framework-driven. Executable today.
              </p>
            </div>
          </div>

          <p className="text-center text-text-secondary">
            AI is powerful. But without structure, it gives you different answers every time.
            <br className="hidden md:block" />
            A proven framework gives AI the structure to deliver consistent, actionable results for your business.
          </p>
        </div>
      </section>

      {/* Books Preview */}
      <section id="books" className="py-20 bg-navy-dark/40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gold rounded-full" />
              <h2 className="text-3xl md:text-4xl font-bold">6 AI-Powered Framework Guides</h2>
              <div className="w-1 h-6 bg-gold rounded-full" />
            </div>
            <p className="text-text-secondary">
              Each guide turns a proven business framework into a step-by-step AI system.
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
              View all books with full descriptions
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-text-secondary">From purchase to execution in under an hour.</p>
          </div>

          <div className="space-y-6">
            {[
              {
                step: "01",
                title: "Download your PDF guide",
                desc: "Instant access after purchase. No account required, no platform login. PDF opens immediately.",
              },
              {
                step: "02",
                title: "Load the system prompt into Claude or ChatGPT",
                desc: "Each guide includes a ready-to-use AI system prompt. Copy it directly into your AI tool of choice.",
              },
              {
                step: "03",
                title: "Tell the AI about your business",
                desc: "Describe your product, your target customer, and your current situation. The more context you give, the more precise the output.",
              },
              {
                step: "04",
                title: "AI immediately applies the framework to your business",
                desc: "Not generic advice — the framework executed for your specific situation. Value Ladders, launch sequences, copy, traffic strategies, all tailored to you.",
              },
            ].map((s) => (
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Documented Results</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              These aren&apos;t projections. These are documented outcomes from people applying the frameworks inside this bundle with AI.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { result: "$600 → $5,000/month", who: "Yoga instructor", how: "Value Ladder + AI funnel automation" },
              { result: "500 → 3,000 engaged fans", who: "Life coach", how: "Mass Movement design with Expert Secrets framework" },
              { result: "87% CPA reduction", who: "SaaS startup", how: "AI Traffic system — $125 → $16 per acquisition" },
              { result: "1.2% → 6.8% conversion", who: "Handmade jam brand", how: "Story-based copywriting applied to product pages" },
              { result: "$3,700 in 3 days", who: "Food blogger", how: "PLF Seed Launch — first month was $210" },
              { result: "0 → 2,400 subscribers", who: "Newsletter writer", how: "Nicolas Cole framework + AI, 90 days, working full-time" },
            ].map((r) => (
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Users Are Saying</h2>
            <p className="text-text-secondary">Real feedback from entrepreneurs using AI Architect frameworks.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-surface/60 border border-white/5 rounded-2xl p-6 flex flex-col">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-4 flex-1 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="border-t border-white/5 pt-4">
                  <div className="font-semibold text-text-primary text-sm">{t.name}</div>
                  <div className="text-text-muted text-xs">{t.role}</div>
                  <div className="text-gold text-xs font-semibold mt-1">{t.result}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle CTA — Pricing Comparison */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/3 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-10 text-center">
            <span className="gradient-gold">Choose Your Path</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Individual */}
            <div className="bg-surface/40 border border-white/10 rounded-2xl p-6 text-center">
              <h3 className="font-semibold text-text-secondary mb-2 text-sm uppercase tracking-wide">Individual Book</h3>
              <div className="text-4xl font-bold text-text-primary mb-1">$17</div>
              <div className="text-text-muted text-sm mb-6">per book</div>
              <ul className="text-left space-y-3 mb-6 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-text-muted mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  1 AI-powered framework guide
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-text-muted mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  System prompt + templates
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-text-muted mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  5-day quickstart
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-text-muted mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                  <span className="text-text-muted">All 6 books = ${17 * 6}</span>
                </li>
              </ul>
              <Link
                href="/products"
                className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl font-semibold text-text-secondary border border-white/10 hover:border-gold/30 hover:text-gold transition-all text-sm"
              >
                Browse Individual Books
              </Link>
            </div>

            {/* Bundle — Most Popular */}
            <div className="relative bg-surface/60 border-2 border-gold/30 rounded-2xl p-6 text-center card-glow">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-navy-dark text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide whitespace-nowrap">
                Most Popular — Save ${bundle.originalPrice - bundle.price}
              </div>
              <h3 className="font-semibold text-gold mb-2 text-sm uppercase tracking-wide mt-2">Complete Bundle</h3>
              <div className="flex items-center justify-center gap-3 mb-1">
                <span className="text-xl text-text-secondary line-through decoration-red-400">${bundle.originalPrice}</span>
                <span className="text-4xl font-bold text-gold">${bundle.price}</span>
              </div>
              <div className="text-text-muted text-sm mb-6">${Math.round((bundle.price / 6) * 100) / 100}/book — {bundle.discount}% off</div>
              <ul className="text-left space-y-3 mb-6 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-gold mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-text-primary font-medium">All 6 AI framework guides</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-gold mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-text-primary font-medium">6 system prompts + all templates</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-gold mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Lifetime access + updates
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-gold mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  7-day money-back guarantee
                </li>
              </ul>
              <BuyButton href={bundleUrl} className="w-full text-lg py-4 animate-pulse-subtle">
                Get All 6 Books — ${bundle.price}
              </BuyButton>
              <p className="text-xs text-text-muted mt-3">
                Instant PDF download · 7-day money-back guarantee · No questions asked
              </p>
            </div>
          </div>

          <p className="text-center text-text-muted text-xs mt-8">
            Source books retail for ~$175+. Strategy consulting to apply them: $2,000–$10,000+.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-navy-dark/40">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      {/* Email Capture — Free Framework Sample */}
      <section className="py-20 pb-32 md:pb-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="inline-block bg-gold/10 border border-gold/20 text-gold text-xs font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            500+ entrepreneurs already subscribed
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Get the Free AI Framework Sample</h2>
          <p className="text-text-secondary mb-3">
            Get a free preview of the AI Architect framework + 3 ready-to-use system prompts — plus weekly AI business insights every Friday.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-text-muted mb-8">
            <span className="flex items-center gap-1.5">
              <span className="text-gold">&#10003;</span> Cut 50%+ strategy time with AI
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-gold">&#10003;</span> Real results from 500+ users
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-gold">&#10003;</span> Every Friday — no fluff
            </span>
          </div>
          <EmailCapture
            buttonText="Send Me the Free Framework"
            className="max-w-lg mx-auto"
          />
          <p className="text-text-muted text-xs mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
      <StickyMobileCTA bundlePrice={bundle.price} bundleUrl={bundleUrl} />
    </>
  );
}
