import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com").trim();

export const metadata: Metadata = {
  title: "Refund Policy — AI Native Playbook Series",
  description:
    "Refund policy for AI Native Playbook Series digital products. Full refund available within 14 days of purchase if the product has not been downloaded. Download available for 30 days from purchase.",
  openGraph: {
    title: "Refund Policy — AI Native Playbook Series",
    description: "Full refund within 14 days if not downloaded. Download available for 30 days.",
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: "AI Native Playbook Series" }],
  },
  alternates: {
    canonical: `${SITE_URL}/en/refund`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

const BREADCRUMB_LABELS: Record<string, { home: string; page: string }> = {
  en: { home: "Home", page: "Refund Policy" },
  ko: { home: "\uD648", page: "\uD658\uBD88 \uC815\uCC45" },
  ja: { home: "\u30DB\u30FC\u30E0", page: "\u8FD4\u91D1\u30DD\u30EA\u30B7\u30FC" },
};

function getBreadcrumbJsonLd(locale: string) {
  const labels = BREADCRUMB_LABELS[locale] || BREADCRUMB_LABELS.en;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: labels.home, item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: labels.page, item: `${SITE_URL}/${locale}/refund` },
    ],
  };
}

export default async function RefundPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getBreadcrumbJsonLd(locale)).replace(/</g, "\\u003c"),
        }}
      />
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3 gradient-gold">Refund Policy</h1>
          <p className="text-text-muted text-sm">
            Last updated: March 1, 2026
          </p>
        </div>

        {/* Highlight box */}
        <div className="bg-gold/5 border border-gold/30 rounded-2xl p-6 mb-10">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-gold shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <div>
              <p className="font-semibold text-text-primary text-lg">14-Day Refund Policy</p>
              <p className="text-text-secondary text-sm mt-1">
                You may request a full refund within <strong className="text-text-primary">14 days</strong> of purchase, provided the product has <strong className="text-text-primary">not been downloaded</strong>. After download, refunds are not available.
              </p>
            </div>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-10 text-text-secondary leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">1. Refund Eligibility</h2>
            <p className="mb-3">You are eligible for a full refund if <strong className="text-text-primary">both</strong> of the following conditions are met:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Your refund request is submitted within <strong className="text-text-primary">14 calendar days</strong> of your purchase date</li>
              <li>You have <strong className="text-text-primary">not downloaded</strong> the purchased product</li>
            </ul>
            <p className="mt-4 font-semibold text-text-primary">Refunds are NOT available if:</p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
              <li>The product has already been downloaded</li>
              <li>More than 14 days have passed since the purchase date</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">2. Download Period</h2>
            <p>
              After purchase, you have <strong className="text-text-primary">30 days</strong> to download your product. The download link is sent via email immediately after purchase. After 30 days, the download link expires.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">3. Content Usage</h2>
            <p>
              Once you download the product, you have <strong className="text-text-primary">permanent access</strong> to the downloaded files. There is no expiration on your use of downloaded content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">4. How to Request a Refund</h2>
            <p className="mb-4">To request a refund:</p>

            <div className="space-y-3">
              {[
                {
                  step: "1",
                  title: "Send an email",
                  desc: (
                    <>
                      Email us at{" "}
                      <a href="mailto:contact@ai-native-playbook.com" className="text-gold hover:underline">
                        contact@ai-native-playbook.com
                      </a>{" "}
                      with the subject line: <span className="text-text-primary font-mono text-sm bg-surface/60 px-1.5 py-0.5 rounded">Refund Request — [Your Order Number]</span>
                    </>
                  ),
                },
                {
                  step: "2",
                  title: "Include your order details",
                  desc: "Provide the email address used for purchase and your order number (found in your purchase confirmation email from Paddle).",
                },
                {
                  step: "3",
                  title: "Confirmation",
                  desc: "We will confirm receipt of your refund request within 1 business day and verify download status.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 bg-surface/40 border border-white/5 rounded-xl p-4">
                  <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center shrink-0 text-gold font-bold text-sm">
                    {item.step}
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary mb-1">{item.title}</p>
                    <p className="text-sm text-text-secondary">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">5. Refund Processing</h2>
            <p className="mb-3">
              Once your refund is approved:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>The refund is processed through <strong className="text-text-primary">Paddle</strong>, our payment processor</li>
              <li>Refunds are returned to the original payment method used for purchase</li>
              <li>Processing time: <strong className="text-text-primary">5–10 business days</strong> depending on your bank or card issuer</li>
              <li>You will receive a confirmation email from Paddle once the refund is issued</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">6. Summary</h2>
            <div className="bg-surface/40 border border-white/5 rounded-xl p-5 space-y-2">
              <p><strong className="text-text-primary">Refund window:</strong> 14 days from purchase (before download only)</p>
              <p><strong className="text-text-primary">Download period:</strong> 30 days from purchase</p>
              <p><strong className="text-text-primary">Content usage:</strong> Permanent after download</p>
              <p><strong className="text-text-primary">After download:</strong> Refunds are not available</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">7. Contact</h2>
            <p>
              For any questions about our refund policy, please contact us at:{" "}
              <a href="mailto:contact@ai-native-playbook.com" className="text-gold hover:underline">
                contact@ai-native-playbook.com
              </a>
            </p>
            <p className="mt-3">
              We typically respond within 1 business day.
            </p>
          </section>

          <nav className="pt-8 border-t border-white/10" aria-label="Related pages">
            <p className="text-xs font-semibold text-text-secondary/60 uppercase tracking-wider mb-3">Related Pages</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/terms" className="text-sm text-gold hover:text-gold-light transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="text-sm text-gold hover:text-gold-light transition-colors">Privacy Policy</Link>
              <Link href="/faq" className="text-sm text-gold hover:text-gold-light transition-colors">FAQ</Link>
              <Link href="/bundle" className="text-sm text-gold hover:text-gold-light transition-colors">Bundle</Link>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
