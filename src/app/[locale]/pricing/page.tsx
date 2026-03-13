import type { Metadata } from "next";
import Link from "next/link";
import { books, bundle, getBundleUrl, getBundlePaddlePriceId, getBookPaddlePriceId, getProductUrl } from "@/lib/products";
import dynamic from "next/dynamic";
const BuyButton = dynamic(() => import("@/components/BuyButton"));
import { setRequestLocale } from "next-intl/server";

const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com").trim();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl =
    locale === "en" ? `${SITE_URL}/pricing` : `${SITE_URL}/${locale}/pricing`;

  return {
    title: "Pricing — AI Native Playbook Series",
    description:
      "Get all 6 AI business automation guides for $47 (save $55) or start with a single volume for $17. Instant PDF download. 14-day refund policy.",
    keywords: [
      "AI Native Playbook pricing",
      "AI business guide price",
      "AI marketing playbook cost",
      "AI business automation bundle deal",
      "AI ebook bundle discount",
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/pricing`,
        ja: `${SITE_URL}/ja/pricing`,
        "x-default": `${SITE_URL}/pricing`,
      },
    },
    openGraph: {
      title: "Pricing — AI Native Playbook Series",
      description:
        "6 AI-powered business automation guides. Individual $17 or complete bundle $47. Save $55.",
      type: "website",
      locale: locale === "ja" ? "ja_JP" : "en_US",
      siteName: "AI Native Playbook Series",
      url: canonicalUrl,
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "AI Native Playbook Series Pricing",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Pricing — AI Native Playbook Series",
      description:
        "6 AI-powered business automation guides. Individual $17 or complete bundle $47.",
      images: [`${SITE_URL}/opengraph-image`],
    },
  };
}

/* ── Feature comparison data ── */
const comparisonFeatures = [
  { label: "AI Marketing & Funnel System", volumes: [true, false, false, false, false, false] },
  { label: "Brand & Movement Building", volumes: [false, true, false, false, false, false] },
  { label: "Traffic Acquisition Strategy", volumes: [false, false, true, false, false, false] },
  { label: "Sales Copywriting Formulas", volumes: [false, false, false, true, false, false] },
  { label: "Product Launch Sequence", volumes: [false, false, false, false, true, false] },
  { label: "Content Strategy & Atomization", volumes: [false, false, false, false, false, true] },
  { label: "AI System Prompts Included", volumes: [true, true, true, true, true, true] },
  { label: "Real Case Studies with Revenue", volumes: [true, true, true, true, true, true] },
  { label: "5-Day Quickstart Checklist", volumes: [true, true, true, true, true, true] },
  { label: "Works with Claude, ChatGPT, Gemini", volumes: [true, true, true, true, true, true] },
];

/* ── FAQ data ── */
const pricingFaqs = [
  {
    q: "What format are the guides in?",
    a: "All guides are premium PDF format (A4), optimized for both screen reading and printing. You get instant download access after purchase.",
  },
  {
    q: "Do I need technical skills to use these?",
    a: "No. Each guide includes ready-to-use AI prompts that work with ChatGPT, Claude, and Gemini. Just paste the prompts and follow the step-by-step instructions for your specific business.",
  },
  {
    q: "What's the difference between buying individual volumes and the bundle?",
    a: "Individual volumes ($17 each) focus on one specific business framework. The bundle ($47 for all 6) saves you $55 and includes 3 exclusive bonuses: Master Template, Execution Tracker, and Quick Reference Card.",
  },
  {
    q: "What is your refund policy?",
    a: "You may request a full refund within 14 days of purchase, provided the product has not been downloaded. After download, refunds are not available. Download period: 30 days from purchase. Content usage after download: permanent.",
  },
  {
    q: "Can I upgrade from a single volume to the bundle later?",
    a: "Yes. Contact us after purchasing a single volume and we'll apply your previous purchase amount toward the bundle price.",
  },
  {
    q: "How is this different from just reading the original books?",
    a: "The original books explain the frameworks conceptually. Our guides translate each framework into executable AI prompts and systems you can apply to your specific business immediately — turning weeks of reading into hours of execution.",
  },
  {
    q: "Do you offer team or enterprise licensing?",
    a: "Yes. For teams of 5+ or custom training packages, contact us at the email below for volume pricing and white-label options.",
  },
];

function escapeJsonLd(json: string): string {
  return json
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const bundleUrl = getBundleUrl();
  const bundlePaddlePriceId = getBundlePaddlePriceId();
  const vol1 = books[0]; // AI Marketing Architect (Vol 1)
  const vol1PaddlePriceId = getBookPaddlePriceId(vol1.paddlePriceEnvKey);
  const vol1Url = getProductUrl(vol1.envKey);
  const savedAmount = bundle.originalPrice - bundle.price;
  const savePct = Math.round((savedAmount / bundle.originalPrice) * 100);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Pricing",
        item: `${SITE_URL}/pricing`,
      },
    ],
  };

  const canonicalPricingUrl =
    locale === "en" ? `${SITE_URL}/pricing` : `${SITE_URL}/${locale}/pricing`;

  const offerCatalogJsonLd = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "AI Native Playbook Series — Pricing",
    description:
      "Get all 6 AI business automation guides for $47 (save $55) or start with a single volume for $17.",
    url: canonicalPricingUrl,
    numberOfItems: 2,
    itemListElement: [
      {
        "@type": "Offer",
        name: "Individual Volume",
        description:
          "1 premium PDF guide with AI system prompts, real case studies, and a 5-day quickstart checklist.",
        price: "17",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        priceValidUntil: "2026-12-31",
        url: `${SITE_URL}/products`,
        seller: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Offer",
        name: "Complete Bundle — All 6 Volumes",
        description:
          "All 6 AI business automation guides plus 3 exclusive bonuses: Master Template, Execution Tracker, and Quick Reference Card.",
        price: String(bundle.price),
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        priceValidUntil: "2026-12-31",
        url: `${SITE_URL}/bundle`,
        seller: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: escapeJsonLd(JSON.stringify(breadcrumbJsonLd)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: escapeJsonLd(JSON.stringify(offerCatalogJsonLd)),
        }}
      />

      <div className="min-h-screen pt-24 pb-20">
        {/* Hero */}
        <section className="text-center max-w-4xl mx-auto px-4 mb-16">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            data-testid="pricing-title"
          >
            <span className="gradient-gold">Simple, Transparent Pricing</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            Choose a single volume to master one framework, or get the complete
            bundle and save {savePct}%. Every guide includes AI prompts, real
            case studies, and a quickstart checklist.
          </p>
        </section>

        {/* ── Pricing Tiers ── */}
        <section className="max-w-6xl mx-auto px-4 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Tier 1 — Individual */}
            <div
              className="bg-surface/60 border border-white/10 rounded-2xl p-8 flex flex-col"
              data-testid="tier-individual"
            >
              <h2 className="text-xl font-bold mb-1">Individual Volume</h2>
              <p className="text-text-secondary text-sm mb-6">
                Master one specific framework
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-text-primary">$17</span>
                <span className="text-text-muted text-sm ml-1">/ volume</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "1 premium PDF guide (20 pages)",
                  "AI system prompt included",
                  "Real case studies with revenue",
                  "5-day quickstart checklist",
                  "Works with Claude, ChatGPT, Gemini",
                  "Instant PDF download",
                  "14-day refund (before download)",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-text-secondary"
                  >
                    <svg
                      className="w-4 h-4 text-gold shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <BuyButton
                href={vol1Url}
                paddlePriceId={vol1PaddlePriceId}
                paddleSuccessUrl={`${SITE_URL}/thank-you?product=${encodeURIComponent(vol1.title)}`}
                variant="secondary"
                className="w-full"
              >
                Start with Volume 1 — $17
              </BuyButton>
              <Link
                href="/products"
                className="block text-center text-sm text-text-secondary hover:text-gold transition-colors mt-3"
                data-testid="cta-individual"
              >
                Browse all volumes &rarr;
              </Link>
            </div>

            {/* Tier 2 — Bundle (highlighted) */}
            <div
              className="bg-surface/60 border-2 border-gold/40 rounded-2xl p-8 flex flex-col relative card-glow"
              data-testid="tier-bundle"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span
                  className="bg-gold text-navy-dark text-xs font-bold px-4 py-1.5 rounded-full"
                  data-testid="badge-best-value"
                >
                  BEST VALUE
                </span>
              </div>

              <h2 className="text-xl font-bold mb-1 mt-2">Complete Bundle</h2>
              <p className="text-text-secondary text-sm mb-6">
                All 6 frameworks + exclusive bonuses
              </p>

              <div className="mb-2">
                <span className="text-lg text-text-secondary line-through mr-2">
                  ${bundle.originalPrice}
                </span>
                <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                  SAVE ${savedAmount}
                </span>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gold">${bundle.price}</span>
                <span className="text-text-muted text-sm ml-1">one-time</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "All 6 premium PDF guides (120+ pages)",
                  "6 AI system prompts",
                  "Real case studies across all frameworks",
                  "6 quickstart checklists",
                  "BONUS: Master Template (Notion DB)",
                  "BONUS: Execution Tracker",
                  "BONUS: Quick Reference Card",
                  "Instant PDF download",
                  "14-day refund (before download)",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-text-secondary"
                  >
                    <svg
                      className="w-4 h-4 text-gold shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <BuyButton
                href={bundleUrl}
                paddlePriceId={bundlePaddlePriceId}
                paddleSuccessUrl={`${SITE_URL}/thank-you?product=Complete+Bundle`}
                className="w-full text-lg py-4"
              >
                Get the Bundle — Save {savePct}%
              </BuyButton>
              <p className="text-xs text-text-muted text-center mt-3">
                Instant download &middot; No account required
              </p>
            </div>

            {/* Tier 3 — Enterprise */}
            <div
              className="bg-surface/60 border border-white/10 rounded-2xl p-8 flex flex-col"
              data-testid="tier-enterprise"
            >
              <h2 className="text-xl font-bold mb-1">Enterprise / Team</h2>
              <p className="text-text-secondary text-sm mb-6">
                Custom packages for teams of 5+
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-text-primary">
                  Custom
                </span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Everything in Complete Bundle",
                  "Team license (5+ seats)",
                  "Custom AI prompt customization",
                  "Priority email support",
                  "White-label options available",
                  "Invoice & PO payment",
                  "Volume discounts",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-text-secondary"
                  >
                    <svg
                      className="w-4 h-4 text-gold shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="mailto:support@ai-driven-architect.com?subject=Enterprise%20Inquiry"
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 bg-transparent border border-white/20 text-text-primary hover:border-gold/40 hover:text-gold w-full text-center"
                data-testid="cta-enterprise"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>

        {/* ── Trust Signals ── */}
        <section className="max-w-4xl mx-auto px-4 mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-surface/60 border border-white/5 rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">🛡️</div>
              <p className="font-semibold text-text-primary text-sm">
                14-Day Refund Policy
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Full refund within 14 days if not downloaded.
              </p>
            </div>
            <div className="bg-surface/60 border border-white/5 rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <p className="font-semibold text-text-primary text-sm">
                Instant PDF Download
              </p>
              <p className="text-xs text-text-secondary mt-1">
                No account needed. Access your guides immediately.
              </p>
            </div>
            <div className="bg-surface/60 border border-white/5 rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">🤖</div>
              <p className="font-semibold text-text-primary text-sm">
                Works with Any AI
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Claude, ChatGPT, Gemini — use your preferred AI tool.
              </p>
            </div>
          </div>
        </section>

        {/* ── Social Proof ── */}
        <section className="max-w-4xl mx-auto px-4 mb-20">
          <div className="text-center mb-10">
            <p
              className="text-gold font-semibold text-sm mb-2"
              data-testid="social-proof-count"
            >
              Join 500+ AI entrepreneurs
            </p>
            {/* TODO: replace with real subscriber count from analytics */}
            <h2 className="text-2xl md:text-3xl font-bold">
              What Our Readers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* TODO: real testimonials — replace placeholder text */}
            {[
              {
                name: "Marcus T.",
                role: "Digital Marketing Consultant",
                text: "Applied DotCom Secrets through AI and went from $0 to $4,200/month in 60 days. The prompts execute the frameworks immediately.",
                rating: 5,
              },
              {
                name: "Sarah K.",
                role: "E-commerce Founder",
                text: "The bundle paid for itself in week one. I used the copywriting and funnel guides together — my conversion rate tripled.",
                rating: 5,
              },
              {
                name: "James L.",
                role: "SaaS Startup Founder",
                text: "Jeff Walker's launch formula + AI prompts = $32K ARR in month one. These guides compress months of learning into hours of execution.",
                rating: 5,
              },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-surface/60 border border-white/5 rounded-xl p-6"
                data-testid="testimonial-card"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-gold"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-4 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-text-primary text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-text-muted">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* As Seen In placeholder */}
          {/* TODO: real logos — replace with actual partner/media logos */}
          {/*
          <div className="mt-12 text-center">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-4">
              As Seen In
            </p>
            <div className="flex items-center justify-center gap-8 opacity-40">
              <span className="text-text-secondary text-sm">[Logo 1]</span>
              <span className="text-text-secondary text-sm">[Logo 2]</span>
              <span className="text-text-secondary text-sm">[Logo 3]</span>
            </div>
          </div>
          */}
        </section>

        {/* ── Feature Comparison Table ── */}
        <section className="max-w-5xl mx-auto px-4 mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-gold rounded-full" />
            <h2 className="text-2xl md:text-3xl font-bold">
              What Each Volume Covers
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table
              className="w-full border-collapse"
              data-testid="comparison-table"
            >
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">
                    Feature
                  </th>
                  {books.map((book) => (
                    <th
                      key={book.id}
                      className="text-center py-3 px-2 text-xs font-semibold text-text-secondary"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-lg">{book.icon}</span>
                        <span>Vol.{book.vol}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, idx) => (
                  <tr
                    key={feature.label}
                    className={`border-b border-white/5 ${
                      idx % 2 === 0 ? "bg-surface/30" : ""
                    }`}
                  >
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {feature.label}
                    </td>
                    {feature.volumes.map((included, vi) => (
                      <td key={vi} className="text-center py-3 px-2">
                        {included ? (
                          <span role="img" aria-label="Included">
                            <svg
                              className="w-5 h-5 text-gold mx-auto"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </span>
                        ) : (
                          <span className="text-text-muted" aria-label="Not included">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-center">
            <span
              className="inline-block bg-gold text-navy-dark text-xs font-bold px-4 py-1.5 rounded-full"
              data-testid="badge-most-popular"
            >
              MOST POPULAR
            </span>
            <p className="text-text-secondary text-sm mt-2">
              The Complete Bundle includes every feature across all 6 volumes + exclusive bonuses
            </p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="max-w-3xl mx-auto px-4 mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-gold rounded-full" />
            <h2 className="text-2xl md:text-3xl font-bold">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3" data-testid="pricing-faq">
            {pricingFaqs.map((faq, idx) => (
              <details
                key={idx}
                className="group border border-white/10 rounded-xl overflow-hidden transition-colors hover:border-gold/20"
              >
                <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none text-left font-semibold text-text-primary select-none">
                  <span>{faq.q}</span>
                  <svg
                    className="w-5 h-5 shrink-0 text-gold transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-text-secondary text-sm leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-gold">
              Ready to Execute, Not Just Read?
            </span>
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Stop spending weeks reading business books. Start executing proven
            frameworks with AI — today.
          </p>

          <div className="inline-flex flex-col items-center bg-surface/60 border-2 border-gold/30 rounded-2xl p-8 card-glow mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl text-text-secondary line-through decoration-red-400">
                ${bundle.originalPrice}
              </span>
              <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg">
                SAVE ${savedAmount}
              </span>
            </div>
            <div className="text-5xl font-bold text-gold mb-6">
              ${bundle.price}
            </div>

            <BuyButton
              href={bundleUrl}
              paddlePriceId={bundlePaddlePriceId}
              paddleSuccessUrl={`${SITE_URL}/thank-you?product=Complete+Bundle`}
              className="w-full text-lg py-4"
            >
              Get the Bundle — Save {savePct}%
            </BuyButton>
            <p className="text-xs text-text-muted mt-3">
              Instant download &middot; 14-day refund policy
            </p>
          </div>

          <div className="mt-4">
            <p className="text-sm text-text-secondary mb-2">
              Prefer to start with just one?
            </p>
            <Link
              href="/products"
              className="text-gold hover:text-gold-light transition-colors font-semibold"
              data-testid="cta-secondary"
            >
              Browse Individual Volumes — $17 each &rarr;
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
