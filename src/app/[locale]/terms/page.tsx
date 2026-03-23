import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com").trim();

export const metadata: Metadata = {
  title: "Terms of Service — AI Native Playbook Series",
  description:
    "Terms of Service for AI Native Playbook Series by ai-architect. Digital product license, payment terms via Paddle, refund policy, and usage guidelines explained.",
  openGraph: {
    title: "Terms of Service — AI Native Playbook Series",
    description: "Digital product license, payment terms, refund policy, and usage guidelines.",
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: "AI Native Playbook Series" }],
  },
  alternates: {
    canonical: `${SITE_URL}/terms`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

const BREADCRUMB_LABELS: Record<string, { home: string; page: string }> = {
  en: { home: "Home", page: "Terms of Service" },
  ko: { home: "\uD648", page: "\uC774\uC6A9\uC57D\uAD00" },
  ja: { home: "\u30DB\u30FC\u30E0", page: "\u5229\u7528\u898F\u7D04" },
};

function getBreadcrumbJsonLd(locale: string) {
  const labels = BREADCRUMB_LABELS[locale] || BREADCRUMB_LABELS.en;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: labels.home, item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: labels.page, item: `${SITE_URL}/${locale}/terms` },
    ],
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
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
          <h1 className="text-4xl font-bold mb-3 gradient-gold">Terms of Service</h1>
          <p className="text-text-muted text-sm">
            Last updated: March 1, 2026
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-10 text-text-secondary leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">1. Agreement to Terms</h2>
            <p>
              By purchasing or accessing any product from <strong className="text-text-primary">AI Native Playbook Series</strong>, operated by <strong className="text-text-primary">ai-architect</strong> (website: <span className="text-gold">ai-native-playbook.com</span>), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not purchase or use our products.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">2. Products and Digital Goods</h2>
            <p className="mb-3">
              AI Native Playbook Series sells digital products in PDF format ("Products"). These include but are not limited to:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>AI Marketing Architect</li>
              <li>AI Brand Architect</li>
              <li>AI Traffic Architect</li>
              <li>AI Story Architect</li>
              <li>AI Startup Architect</li>
              <li>AI Content Architect</li>
              <li>The Complete Bundle (all six guides)</li>
            </ul>
            <p className="mt-3">
              All products are delivered as instant digital downloads upon purchase confirmation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">3. License Grant</h2>
            <p className="mb-3">
              Upon purchase, ai-architect grants you a <strong className="text-text-primary">non-exclusive, non-transferable, personal-use license</strong> to:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Download and store the PDF on your personal devices</li>
              <li>Read and use the frameworks and prompts for your own business purposes</li>
              <li>Print a single copy for personal reference</li>
            </ul>
            <p className="mt-4 font-semibold text-text-primary">This license does NOT permit you to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
              <li>Redistribute, resell, or share the PDF files with others</li>
              <li>Upload to file-sharing platforms or cloud storage accessible by others</li>
              <li>Create derivative works for commercial distribution</li>
              <li>Use the content to create competing products without written permission</li>
              <li>Remove copyright notices or attribution from the materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">4. Payment and Processing</h2>
            <p className="mb-3">
              All payments are processed by <strong className="text-text-primary">Paddle</strong>, which acts as the Merchant of Record for all transactions. By purchasing, you agree to Paddle&apos;s terms of service and privacy policy available at{" "}
              <a href="https://www.paddle.com/legal/terms" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                paddle.com/legal/terms
              </a>.
            </p>
            <p className="mb-3">
              Paddle is responsible for:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Collecting and processing payment securely</li>
              <li>Managing applicable sales tax and VAT</li>
              <li>Issuing receipts and invoices</li>
              <li>Processing refund requests as directed by ai-architect</li>
            </ul>
            <p className="mt-3">
              Prices are listed in USD. Currency conversion (if applicable) is handled by your payment provider.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">5. Refund Policy</h2>
            <p className="mb-3">
              You may request a full refund within <strong className="text-text-primary">14 days</strong> of purchase, provided the product has <strong className="text-text-primary">not been downloaded</strong>. After download, refunds are not available. Downloads are available for <strong className="text-text-primary">30 days</strong> from purchase. After download, content usage is <strong className="text-text-primary">permanent</strong>.
            </p>
            <p>
              Please refer to our{" "}
              <a href="/refund" className="text-gold hover:underline">Refund Policy</a> for full details on how to request a refund.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">6. Intellectual Property</h2>
            <p className="mb-3">
              All content within AI Native Playbook Series products — including text, prompts, frameworks, illustrations, and compilations — is the intellectual property of ai-architect and is protected by applicable copyright laws.
            </p>
            <p>
              The frameworks referenced in our guides (such as DotCom Secrets, Copywriting Secrets, Launch, etc.) are the works of their respective authors. Our guides represent original AI implementation systems and are not affiliated with, endorsed by, or sponsored by the original authors or publishers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">7. Disclaimer of Warranties</h2>
            <p className="mb-3">
              AI Native Playbook Series products are provided &quot;as is&quot; without warranty of any kind. We do not guarantee:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Specific business results or revenue from using our products</li>
              <li>Accuracy of AI-generated outputs when using our prompts</li>
              <li>Compatibility with specific AI tools or platforms beyond Claude, ChatGPT, and Gemini</li>
            </ul>
            <p className="mt-3">
              Business results depend on many factors outside our control, including your industry, effort, market conditions, and execution.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, ai-architect shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our products. Our total liability for any claim arising from a product purchase shall not exceed the amount you paid for that product.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">9. Governing Law</h2>
            <p>
              These Terms of Service are governed by and construed in accordance with applicable laws. Any disputes arising from these terms shall be resolved through good-faith negotiation. If resolution cannot be reached, disputes shall be submitted to binding arbitration.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">10. Changes to Terms</h2>
            <p>
              We reserve the right to update these Terms of Service at any time. Changes will be posted on this page with an updated &quot;Last updated&quot; date. Continued use of our products after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">11. Contact</h2>
            <p>
              For questions about these Terms of Service, please contact us at:{" "}
              <a href="mailto:contact@ai-native-playbook.com" className="text-gold hover:underline">
                contact@ai-native-playbook.com
              </a>
            </p>
          </section>

          <nav className="pt-8 border-t border-white/10" aria-label="Related pages">
            <p className="text-xs font-semibold text-text-secondary/60 uppercase tracking-wider mb-3">Related Pages</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/privacy" className="text-sm text-gold hover:text-gold-light transition-colors">Privacy Policy</Link>
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
