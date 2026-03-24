import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com").trim();

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl = `${SITE_URL}/${locale}/privacy`;

  return {
    title: "Privacy Policy — AI Native Playbook Series",
    description:
      "Privacy Policy for AI Native Playbook Series by ai-architect. Learn how we collect, use, and protect your personal data in compliance with GDPR and international law.",
    openGraph: {
      title: "Privacy Policy — AI Native Playbook Series",
      description: "Learn how we collect, use, and protect your personal data.",
      images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: "AI Native Playbook Series" }],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

const BREADCRUMB_LABELS: Record<string, { home: string; page: string }> = {
  en: { home: "Home", page: "Privacy Policy" },
  ko: { home: "\uD648", page: "\uAC1C\uC778\uC815\uBCF4\uCC98\uB9AC\uBC29\uCE68" },
  ja: { home: "\u30DB\u30FC\u30E0", page: "\u30D7\u30E9\u30A4\u30D0\u30B7\u30FC\u30DD\u30EA\u30B7\u30FC" },
};

function getBreadcrumbJsonLd(locale: string) {
  const labels = BREADCRUMB_LABELS[locale] || BREADCRUMB_LABELS.en;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: labels.home, item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: labels.page, item: `${SITE_URL}/${locale}/privacy` },
    ],
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
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
          <h1 className="text-4xl font-bold mb-3 gradient-gold">Privacy Policy</h1>
          <p className="text-text-muted text-sm">
            Last updated: March 1, 2026
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-10 text-text-secondary leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">1. Introduction</h2>
            <p>
              ai-architect (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), operating the website{" "}
              <span className="text-gold">ai-native-playbook.com</span> under the service name <strong className="text-text-primary">AI Native Playbook Series</strong>, is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you visit our website or purchase our products.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">2. Information We Collect</h2>

            <h3 className="text-base font-semibold text-text-primary mb-2 mt-4">2.1 Information You Provide</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong className="text-text-primary">Email address</strong> — when subscribing to our newsletter or receiving product updates</li>
              <li><strong className="text-text-primary">Purchase information</strong> — name and billing details collected by Paddle during checkout</li>
              <li><strong className="text-text-primary">Communications</strong> — messages you send us via email</li>
            </ul>

            <h3 className="text-base font-semibold text-text-primary mb-2 mt-4">2.2 Information Collected Automatically</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong className="text-text-primary">Usage data</strong> — pages visited, time spent, referring URLs (via Google Analytics)</li>
              <li><strong className="text-text-primary">Device information</strong> — browser type, operating system, IP address (anonymized)</li>
              <li><strong className="text-text-primary">Cookies</strong> — see Section 5 for details</li>
            </ul>

            <h3 className="text-base font-semibold text-text-primary mb-2 mt-4">2.3 Payment Information</h3>
            <p>
              We do <strong className="text-text-primary">not</strong> directly collect or store payment card details. All payment processing is handled by <strong className="text-text-primary">Paddle</strong> as Merchant of Record. Paddle&apos;s privacy practices are governed by their{" "}
              <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                Privacy Policy
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">3. How We Use Your Information</h2>
            <p className="mb-3">We use collected information to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Process and fulfill your product purchases</li>
              <li>Send order confirmations and digital product delivery</li>
              <li>Communicate product updates and relevant announcements (with your consent)</li>
              <li>Send our newsletter if you have subscribed (opt-in only)</li>
              <li>Improve our website and product offerings via analytics</li>
              <li>Respond to your support inquiries</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p className="mt-3">
              We do <strong className="text-text-primary">not</strong> sell, rent, or trade your personal information to third parties for their marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">4. Third-Party Services</h2>

            <div className="space-y-4">
              <div className="bg-surface/40 border border-white/5 rounded-xl p-4">
                <h3 className="font-semibold text-text-primary mb-1">Paddle (Payment Processing)</h3>
                <p className="text-sm">
                  Processes all payments as Merchant of Record. Collects billing information, payment details, and issues receipts. Subject to Paddle&apos;s Privacy Policy.
                </p>
              </div>

              <div className="bg-surface/40 border border-white/5 rounded-xl p-4">
                <h3 className="font-semibold text-text-primary mb-1">Brevo (Email Marketing)</h3>
                <p className="text-sm">
                  We use Brevo (formerly Sendinblue) to manage our email newsletter list and send transactional emails. Your email address is stored in Brevo&apos;s system only if you have opted in to our newsletter. You can unsubscribe at any time via the link in any email.
                </p>
              </div>

              <div className="bg-surface/40 border border-white/5 rounded-xl p-4">
                <h3 className="font-semibold text-text-primary mb-1">Google Analytics (Analytics)</h3>
                <p className="text-sm">
                  We use Google Analytics 4 (GA4) to understand website traffic and user behavior. GA4 anonymizes IP addresses and does not store personally identifiable information. You can opt out via the{" "}
                  <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                    Google Analytics Opt-out Browser Add-on
                  </a>.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">5. Cookies</h2>
            <p className="mb-3">We use the following types of cookies:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong className="text-text-primary">Essential cookies</strong> — required for basic website functionality
              </li>
              <li>
                <strong className="text-text-primary">Analytics cookies</strong> — Google Analytics cookies to measure website performance (anonymized)
              </li>
              <li>
                <strong className="text-text-primary">Paddle cookies</strong> — set during the checkout process for payment security
              </li>
            </ul>
            <p className="mt-3">
              You can control cookies through your browser settings. Disabling cookies may affect some website functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">6. Data Retention</h2>
            <p>
              We retain your email address for as long as you remain subscribed to our newsletter. Purchase records are retained as required by tax and accounting laws (typically 7 years). You may request deletion of your personal data at any time (see Section 7).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">7. Your Rights (GDPR)</h2>
            <p className="mb-3">
              If you are located in the European Economic Area (EEA), United Kingdom, or other jurisdictions with data protection laws, you have the following rights:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong className="text-text-primary">Right to access</strong> — request a copy of the personal data we hold about you</li>
              <li><strong className="text-text-primary">Right to rectification</strong> — request correction of inaccurate personal data</li>
              <li><strong className="text-text-primary">Right to erasure</strong> — request deletion of your personal data</li>
              <li><strong className="text-text-primary">Right to restrict processing</strong> — request limitation of how we use your data</li>
              <li><strong className="text-text-primary">Right to data portability</strong> — receive your data in a machine-readable format</li>
              <li><strong className="text-text-primary">Right to object</strong> — object to processing of your personal data</li>
              <li><strong className="text-text-primary">Right to withdraw consent</strong> — unsubscribe from marketing emails at any time</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:contact@ai-native-playbook.com" className="text-gold hover:underline">
                contact@ai-native-playbook.com
              </a>. We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">8. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information. Our website uses HTTPS encryption. Payment data is handled exclusively by Paddle&apos;s PCI-DSS compliant infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">9. Children&apos;s Privacy</h2>
            <p>
              Our products and website are not directed to individuals under 16 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Changes will be posted on this page with an updated &quot;Last updated&quot; date. We encourage you to review this policy regularly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">11. Contact Us</h2>
            <p>
              For privacy-related questions or to exercise your rights, contact us at:{" "}
              <a href="mailto:contact@ai-native-playbook.com" className="text-gold hover:underline">
                contact@ai-native-playbook.com
              </a>
            </p>
          </section>

          <nav className="pt-8 border-t border-white/10" aria-label="Related pages">
            <p className="text-xs font-semibold text-text-secondary/60 uppercase tracking-wider mb-3">Related Pages</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/terms" className="text-sm text-gold hover:text-gold-light transition-colors">Terms of Service</Link>
              <Link href="/refund" className="text-sm text-gold hover:text-gold-light transition-colors">Refund Policy</Link>
              <Link href="/faq" className="text-sm text-gold hover:text-gold-light transition-colors">FAQ</Link>
              <Link href="/products" className="text-sm text-gold hover:text-gold-light transition-colors">Products</Link>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
