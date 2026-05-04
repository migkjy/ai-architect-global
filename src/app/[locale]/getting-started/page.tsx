import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { books, bundle } from "@/lib/products";
import CopyLinkButton from "@/components/CopyLinkButton";

type Props = {
  params: Promise<{ locale: string }>;
};

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com").trim();

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl = `${SITE_URL}/${locale}/getting-started`;

  return {
    title: "Getting Started — AI Native Playbook Series",
    description:
      "A new buyer's complete guide: how to read your PDF, load the AI Agent Skill into Claude or ChatGPT, run your first prompt, and follow the 5-day quickstart.",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/getting-started`,
        ja: `${SITE_URL}/ja/getting-started`,
        "x-default": `${SITE_URL}/en/getting-started`,
      },
    },
    openGraph: {
      title: "Getting Started — AI Native Playbook Series",
      description:
        "Step-by-step guide: PDF guide, AI Agent Skill setup, first prompt, and 5-day quickstart checklist.",
      type: "website",
      url: canonicalUrl,
      siteName: "AI Native Playbook Series",
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "Getting Started — AI Native Playbook Series",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Getting Started — AI Native Playbook Series",
      description:
        "Step-by-step guide: PDF guide, AI Agent Skill setup, first prompt, and 5-day quickstart checklist.",
      images: [`${SITE_URL}/opengraph-image`],
    },
    robots: { index: true, follow: true },
  };
}

function escapeJsonLd(json: string): string {
  return json.replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

const steps = [
  {
    num: "1",
    title: "Read the PDF Guide (30 min)",
    desc: "Skim the full guide first for the big picture. You do not need to memorize anything — just understand the framework structure and what the AI Agent Skill will do with it. The 5-day quickstart checklist is at the end of the PDF.",
    detail: "Read the framework overview first. Scan the case studies — they show you what output to expect. When you reach the 5-day checklist, stop and move to Step 2. You can go deeper on the theory after you have seen it work.",
  },
  {
    num: "2",
    title: "Load the AI Agent Skill",
    desc: "The .md file in your download is not a document to read — it is a system prompt that gives your AI specialist-level expertise in the framework. Without it, you get generic AI output. With it, you get framework-driven analysis applied to your specific business.",
    detail: "Claude (recommended): Add the .md file to a Claude Project via 'Add to project knowledge.' ChatGPT: Paste the contents into Custom Instructions. Gemini: Paste as your first message. For a full platform-by-platform walkthrough, see the AI Agent Skill Guide.",
  },
  {
    num: "3",
    title: "Run Your First Prompt",
    desc: "Each book has a 'Start Here' prompt built into the framework. With the Skill loaded, paste it into your AI and describe your business in plain language. The AI applies the full expert framework to your specific situation — not a generic template.",
    detail: "Example (Vol 1 — Marketing Architect): 'I sell [product] to [audience]. Use marketing-architect to define my Dream Customer and map my Value Ladder.' Expected output: a structured Dream Customer profile with psychographics, congregation map, bait ideas, and a Before/After transformation statement.",
  },
  {
    num: "4",
    title: "Follow the 5-Day Quickstart",
    desc: "Each book has a day-by-day action plan. One focused task per day. By Day 5 you have a working system — not just a plan, but actual output you can deploy: a funnel structure, a launch sequence, a brand narrative, a traffic strategy.",
    detail: "Find your book's Quick Start guide in the section below. Each guide shows the exact sequence, the prompts to use each day, and what to do with the output. One hour per day is enough.",
  },
  {
    num: "5",
    title: "Iterate and Improve",
    desc: "The first output is your starting point. Feed it back to the AI with your feedback — 'the audience description is too broad, focus on X' — and the framework tightens. The more context you give across sessions, the more precise the output becomes.",
    detail: "Bundle buyers: each framework's output feeds the next. Marketing Architect defines your Dream Customer. Traffic Architect uses that profile to build your Dream 100 list. Story Architect writes the copy for the funnel Marketing Architect designed. Chain them in sequence for a complete business execution system.",
  },
];

export default async function GettingStartedPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const canonicalUrl = `${SITE_URL}/${locale}/getting-started`;

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Get Started with AI Native Playbook Series",
    description:
      "Complete buyer onboarding guide: read your PDF, load the AI Agent Skill, run your first prompt, and follow the 5-day quickstart.",
    url: canonicalUrl,
    step: steps.map((s) => ({
      "@type": "HowToStep",
      position: parseInt(s.num),
      name: s.title,
      text: s.desc,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Getting Started", item: canonicalUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(howToJsonLd)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(breadcrumbJsonLd)) }}
      />

      <div className="min-h-screen pt-24 pb-20">
        {/* Breadcrumb */}
        <div className="max-w-3xl mx-auto px-4 mb-8">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-text-secondary">Getting Started</span>
          </div>
        </div>

        {/* Header */}
        <section className="max-w-3xl mx-auto px-4 mb-12">
          <div className="inline-block bg-gold/10 border border-gold/20 text-gold text-xs font-semibold px-4 py-1.5 rounded-full tracking-wide uppercase mb-6">
            Buyer Onboarding Guide
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {/* {GARY_TODO}: Replace headline with final copy */}
            <span className="gradient-gold">Welcome — Here Is Exactly What to Do Next</span>
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed">
            You have a PDF guide, an AI Agent Skill file, and a 5-day quickstart plan. This page shows you how to use all three — from download to your first AI-generated business output in under an hour.
          </p>
        </section>

        {/* What You Received */}
        <section className="max-w-3xl mx-auto px-4 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gold rounded-full" />
            <h2 className="text-xl font-bold">What You Received</h2>
          </div>
          <div className="bg-surface/60 border border-white/5 rounded-2xl p-6 space-y-4">
            {[
              {
                icon: "📄",
                title: "PDF Guide (20 pages)",
                desc: "A framework overview, worked examples, and the 5-day quickstart checklist at the end. Read it for context — the AI Agent Skill handles the application.",
              },
              {
                icon: "🤖",
                title: "AI Agent Skill (.md file)",
                desc: "A structured knowledge file you load into Claude, ChatGPT, or any AI. Once loaded, the AI operates as a specialist in the framework — applying it step by step to your specific business, not giving generic answers.",
              },
              {
                icon: "📋",
                title: "Prompt Templates",
                desc: "Copy-paste prompts for each major framework step. These are not generic — they are designed to extract the maximum output from the Skill. Use them exactly as written, then customize from there.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-text-primary text-sm mb-1">{item.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5-Step Process */}
        <section className="max-w-3xl mx-auto px-4 mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-gold rounded-full" />
            <h2 className="text-2xl font-bold">5 Steps to Your First Result</h2>
          </div>

          <div className="space-y-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="bg-surface/60 border border-white/5 rounded-2xl p-6 hover:border-gold/20 transition-all"
              >
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center font-bold text-gold">
                    {step.num}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-text-primary mb-2">{step.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed mb-3">{step.desc}</p>
                    <p className="text-text-muted text-xs leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skill Guide Link */}
        <section className="max-w-3xl mx-auto px-4 mb-12">
          <Link
            href="/skill-guide"
            className="block bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/20 rounded-2xl p-5 hover:border-gold/40 transition-colors group"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-text-primary mb-1">
                  New to AI Agent Skills?
                </p>
                <p className="text-xs text-text-secondary">
                  The complete guide to loading your .md skill file across Claude, ChatGPT, and Gemini — with platform-specific steps, best practices, and troubleshooting.
                </p>
              </div>
              <span className="shrink-0 text-xs bg-gold/15 text-gold px-4 py-2 rounded-lg font-semibold group-hover:bg-gold/25 transition-colors whitespace-nowrap">
                Read Skill Guide &rarr;
              </span>
            </div>
          </Link>
        </section>

        {/* Quick Start Links per Book */}
        <section className="max-w-3xl mx-auto px-4 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gold rounded-full" />
            {/* {GARY_TODO}: Replace section heading */}
            <h2 className="text-xl font-bold">Quick Start Guides by Book</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {books.map((book) => (
              <Link
                key={book.id}
                href={`/products/${book.slug}/quick-start`}
                className="flex items-center gap-3 bg-surface/40 border border-white/5 rounded-xl p-4 hover:border-gold/20 transition-all group"
              >
                <span className="text-2xl shrink-0">{book.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs text-gold/60 font-bold mb-0.5">Vol. {book.vol}</div>
                  <div className="text-sm font-semibold text-text-primary group-hover:text-gold transition-colors truncate">
                    {book.title}
                  </div>
                  <div className="text-xs text-text-muted">Quick Start &rarr;</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Bundle Upsell CTA */}
        <section className="max-w-3xl mx-auto px-4 mb-12">
          <div className="relative overflow-hidden bg-gradient-to-br from-gold/15 via-gold/5 to-transparent border border-gold/25 rounded-2xl p-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="inline-block bg-gold/20 text-gold text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
                Bundle &amp; Save {bundle.discount}%
              </div>
              <h2 className="text-xl font-bold text-text-primary mb-2">
                Get All 6 Frameworks — Build a Complete Business System
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed mb-2">
                Each book&apos;s AI Agent Skill stacks with the others. Marketing Architect defines your customer. Traffic Architect finds them. Story Architect converts them. Together they become a full AI-powered business execution engine.
              </p>
              <p className="text-text-muted text-xs mb-5">
                <span className="line-through">${bundle.originalPrice}</span>{" "}
                <span className="text-gold font-bold text-base">${bundle.price}</span>{" "}
                for all 6 books + 6 AI Agent Skills
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 bg-gold text-bg font-semibold text-sm px-6 py-3 rounded-xl hover:bg-gold/90 transition-colors"
                >
                  View Bundle Pricing &rarr;
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-sm text-text-secondary border border-white/10 hover:border-gold/30 px-5 py-3 rounded-xl transition-colors"
                >
                  Browse Individual Books
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* AI Readiness Diagnostic CTA */}
        <section className="max-w-3xl mx-auto px-4 mb-12">
          <div className="bg-surface/60 border border-white/5 rounded-2xl p-6 hover:border-gold/20 transition-all">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="shrink-0 w-12 h-12 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center text-2xl">
                📊
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-text-primary mb-1">
                  How AI-Ready Is Your Business?
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Take the AI Readiness Score — a quick diagnostic that maps where you are today and which framework to prioritize first. See exactly where AI can create the most leverage in your business.
                </p>
              </div>
              <Link
                href="/free-guide"
                className="shrink-0 inline-flex items-center gap-2 text-sm text-gold border border-gold/20 hover:border-gold/40 px-5 py-2.5 rounded-xl transition-all font-semibold whitespace-nowrap"
              >
                Get Your Score &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter / Free Guide CTA */}
        <section className="max-w-3xl mx-auto px-4 mb-12">
          <div className="bg-surface/60 border border-white/5 rounded-2xl p-6 hover:border-gold/20 transition-all">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="shrink-0 w-12 h-12 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center text-2xl">
                📬
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-text-primary mb-1">
                  Free Guide: AI Implementation Playbook
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Get the free starter guide + weekly AI business strategies in your inbox. Learn which frameworks to apply first, common implementation mistakes, and real results from other founders.
                </p>
              </div>
              <Link
                href="/free-guide"
                className="shrink-0 inline-flex items-center gap-2 text-sm text-gold border border-gold/20 hover:border-gold/40 px-5 py-2.5 rounded-xl transition-all font-semibold whitespace-nowrap"
              >
                Download Free &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Social Share CTA */}
        <section className="max-w-3xl mx-auto px-4 mb-12">
          <div className="bg-surface/40 border border-white/5 rounded-2xl p-6 text-center">
            <h3 className="font-bold text-text-primary mb-2">
              Know Someone Who Needs This?
            </h3>
            <p className="text-text-secondary text-sm mb-5 max-w-lg mx-auto">
              Share the AI Native Playbook series with a founder or marketer who could use AI-powered frameworks to grow their business.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://twitter.com/intent/tweet?text=I%27m%20using%20the%20AI%20Native%20Playbook%20series%20to%20build%20AI-powered%20business%20systems.%20Each%20book%20comes%20with%20an%20AI%20Agent%20Skill%20that%20turns%20ChatGPT%2FClaude%20into%20a%20business%20strategist.&url=https%3A%2F%2Fai-native-playbook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-text-secondary border border-white/10 hover:border-gold/30 hover:text-gold px-4 py-2.5 rounded-xl transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                Share on X
              </a>
              <a
                href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fai-native-playbook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-text-secondary border border-white/10 hover:border-gold/30 hover:text-gold px-4 py-2.5 rounded-xl transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                Share on LinkedIn
              </a>
              <CopyLinkButton url="https://ai-native-playbook.com" />
            </div>
          </div>
        </section>

        {/* CTA to Products */}
        <section className="max-w-3xl mx-auto px-4">
          <div className="bg-surface/60 border border-white/5 rounded-2xl p-6 text-center">
            <p className="text-text-secondary text-sm mb-3">
              Haven&apos;t purchased yet? Each book is a complete expert framework — AI Agent Skill included — for $17. All 6 books are available as a bundle for $47.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm text-gold border border-gold/20 hover:border-gold/40 px-5 py-2.5 rounded-xl transition-all font-semibold"
            >
              Browse All 6 Books &rarr;
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
