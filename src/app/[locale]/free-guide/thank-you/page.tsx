import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl =
    locale === "en"
      ? `${SITE_URL}/free-guide/thank-you`
      : `${SITE_URL}/${locale}/free-guide/thank-you`;

  return {
    title: "Thank You — Your Free Guide is Ready",
    description:
      "Download your free AI Business Automation Starter Guide now.",
    robots: { index: false, follow: false },
    alternates: { canonical: canonicalUrl },
  };
}

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <section className="text-center max-w-2xl mx-auto px-4">
        {/* Success icon */}
        <div className="w-20 h-20 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-10 h-10 text-gold"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="gradient-gold">Your Guide is Ready!</span>
        </h1>

        <p className="text-lg text-text-secondary mb-8 leading-relaxed">
          Thank you for signing up. Click the button below to download your
          free AI Business Automation Starter Guide.
        </p>

        {/* Download Button */}
        <a
          href="/guides/ai-starter-guide.pdf"
          download
          className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 bg-gold text-navy-dark hover:bg-gold-light mb-8"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          Download Your Free Guide (PDF)
        </a>

        {/* What's next */}
        <div className="bg-surface/60 border border-white/10 rounded-2xl p-8 mt-8 text-left">
          <h2 className="text-lg font-bold mb-4 text-center">
            What&apos;s Next?
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="w-7 h-7 bg-gold/10 border border-gold/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-gold text-xs font-bold">1</span>
              </span>
              <div>
                <p className="font-semibold text-text-primary text-sm">
                  Read the Starter Guide
                </p>
                <p className="text-xs text-text-secondary">
                  It takes about 15 minutes and gives you a clear overview of
                  all 6 frameworks.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-7 h-7 bg-gold/10 border border-gold/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-gold text-xs font-bold">2</span>
              </span>
              <div>
                <p className="font-semibold text-text-primary text-sm">
                  Try the 3 Included Prompts
                </p>
                <p className="text-xs text-text-secondary">
                  Paste them into Claude, ChatGPT, or Gemini and see
                  results immediately.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-7 h-7 bg-gold/10 border border-gold/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-gold text-xs font-bold">3</span>
              </span>
              <div>
                <p className="font-semibold text-text-primary text-sm">
                  Check Your Email for More Resources
                </p>
                <p className="text-xs text-text-secondary">
                  We&apos;ll send you additional tips and frameworks to
                  help you get the most out of AI automation.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Secondary CTA — link to products */}
        <div className="mt-12">
          <p className="text-text-secondary text-sm mb-3">
            Want the complete system?
          </p>
          <Link
            href="/products"
            className="text-gold hover:text-gold-light transition-colors font-semibold"
          >
            Explore the Full AI Native Playbook Series &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
