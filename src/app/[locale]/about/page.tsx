import type { Metadata } from "next";
import Link from "next/link";
import { bundle, getBundleUrl } from "@/lib/products";
import BuyButton from "@/components/BuyButton";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "About AI Architect Series — Why We Built AI-Powered Business Framework Guides",
  description:
    "Bridge the gap between reading and executing proven business frameworks. AI Architect turns DotCom Secrets, PLF, and Copywriting Secrets into AI-powered systems you can run today.",
  keywords: [
    "AI Architect Series",
    "AI business framework",
    "Russell Brunson AI",
    "Jeff Walker AI",
    "Jim Edwards AI",
    "Nicolas Cole AI",
    "about AI Architect",
    "business automation tools",
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com"}/about`,
  },
};

const bundleUrl = getBundleUrl();

function escapeJsonLd(json: string): string {
  return json.replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "About", item: `${siteUrl}/about` },
    ],
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(breadcrumbJsonLd)) }}
      />
      <div className="max-w-3xl mx-auto px-4">
        {/* Hero */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-gold">Why We Built This</span>
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed mb-6">
            The business books that shaped the modern online economy — DotCom Secrets, Expert Secrets,
            Traffic Secrets, Copywriting Secrets, Launch, The Art and Business of Online Writing — are
            genuinely brilliant. The frameworks inside them work. The results they&apos;ve produced are real.
          </p>
          <p className="text-text-secondary text-lg leading-relaxed mb-6">
            The problem isn&apos;t the frameworks. The problem is the gap between understanding a framework
            and executing it on your specific business, for your specific customer, in your specific market.
          </p>
          <p className="text-text-secondary text-lg leading-relaxed">
            Most people who read these books end up with better theory and the same results.
          </p>
        </div>

        {/* The Insight */}
        <div className="bg-gold/5 border border-gold/20 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-4 gradient-gold">The Insight</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            AI has fundamentally changed what&apos;s possible for solo entrepreneurs and small teams.
            You can now load a world-class framework into a system prompt, describe your business,
            and have the AI apply that framework — specifically to your situation — in minutes.
          </p>
          <p className="text-text-secondary leading-relaxed">
            The AI Architect Series was built to make that accessible. Not as a course. Not as a
            membership. As a practical PDF guide that closes the gap between framework and execution.
          </p>
        </div>

        {/* How We Approach It */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Our Approach</h2>
          <div className="space-y-6">
            {[
              {
                title: "Source fidelity first",
                desc: "Every guide is built on the original framework — not a paraphrase, not a summary. The AI systems apply the actual framework steps from the actual books.",
              },
              {
                title: "Specific over generic",
                desc: "Generic AI advice is everywhere. Each guide is designed to produce strategies specific to your business, not a theoretical example.",
              },
              {
                title: "Results over completion",
                desc: "We don't measure success by whether you finish reading the guide. We measure it by whether you run your first AI-assisted strategy session within 5 days.",
              },
              {
                title: "Works with the tools you already use",
                desc: "No proprietary platform. No subscription. Every system prompt works with Claude, ChatGPT, and Gemini — tools you likely already pay for.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="w-1.5 bg-gold/30 rounded-full shrink-0" />
                <div>
                  <h3 className="font-bold text-text-primary mb-1">{item.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Frameworks */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">The Frameworks</h2>
          <p className="text-text-secondary mb-6">
            The AI Architect Series covers six books from four authors who collectively represent
            the most systematic approach to building online businesses documented anywhere:
          </p>
          <div className="space-y-3">
            {[
              { author: "Russell Brunson", books: "DotCom Secrets, Expert Secrets, Traffic Secrets", vols: "Vol. 1, 2, 3" },
              { author: "Jim Edwards", books: "Copywriting Secrets", vols: "Vol. 4" },
              { author: "Jeff Walker", books: "Launch (Product Launch Formula)", vols: "Vol. 5" },
              { author: "Nicolas Cole", books: "The Art and Business of Online Writing", vols: "Vol. 6" },
            ].map((item) => (
              <div key={item.author} className="bg-surface/60 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="font-semibold text-text-primary">{item.author}</div>
                  <div className="text-sm text-text-secondary">{item.books}</div>
                </div>
                <span className="text-xs text-gold bg-gold/10 border border-gold/20 px-2.5 py-1 rounded-full shrink-0">
                  {item.vols}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-surface/60 border border-gold/20 rounded-2xl p-8 text-center card-glow">
          <h2 className="text-2xl font-bold mb-3">
            Ready to Close the Execution Gap?
          </h2>
          <p className="text-text-secondary mb-6">
            Six frameworks. Six AI systems. Immediate PDF download.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <BuyButton href={bundleUrl} className="text-lg py-4">
              Get Complete Bundle — ${bundle.price}
            </BuyButton>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-4 rounded-xl font-semibold text-text-secondary border border-white/10 hover:border-gold/30 hover:text-gold transition-all"
            >
              View Individual Books
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
