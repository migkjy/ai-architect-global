import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { GA4PurchaseComplete } from "@/components/GA4PurchaseComplete";
import {
  verifyDownloadToken,
  getAllDownloadLinks,
  detectProductType,
} from "@/lib/download";

export const metadata: Metadata = {
  title: "Thank You for Your Purchase | AI Native Playbook Series",
  description:
    "Your AI Native Playbook PDF is ready. Check your email for the download link.",
  robots: { index: false, follow: false },
};

/** Display-friendly labels for product types */
const PRODUCT_LABELS: Record<string, { title: string; description: string }> = {
  bundle: {
    title: "Complete Bundle",
    description: "All 6 PDF Playbooks + Skills + Agents + Notion Templates",
  },
  "pdf-vol1": { title: "AI Marketing Playbook", description: "Volume 1 PDF" },
  "pdf-vol2": { title: "AI Brand Playbook", description: "Volume 2 PDF" },
  "pdf-vol3": { title: "AI Traffic Playbook", description: "Volume 3 PDF" },
  "pdf-vol4": { title: "AI Story Playbook", description: "Volume 4 PDF" },
  "pdf-vol5": { title: "AI Startup Playbook", description: "Volume 5 PDF" },
  "pdf-vol6": { title: "AI Content Playbook", description: "Volume 6 PDF" },
  skills: { title: "AI Agent Skills", description: "Markdown skill files" },
  agents: { title: "AI Agent Settings", description: "Markdown agent files" },
  notion: { title: "Notion Templates", description: "Notion workspace templates" },
};

export default async function ThankYouPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const productName = sp.product ?? "AI Native Playbook Series";
  const token = sp.token;
  const purchaseType = sp.type ?? "bundle";

  // Verify token and build download links (server-side)
  let downloadLinks: Record<string, string> = {};
  let tokenValid = false;

  if (token) {
    const result = verifyDownloadToken(token);
    if (result.valid && result.orderId) {
      tokenValid = true;
      const productType = detectProductType(purchaseType);
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "https://ai-native-playbook.com";
      downloadLinks = getAllDownloadLinks(
        result.orderId,
        token,
        productType,
        siteUrl
      );
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <GA4PurchaseComplete productName={productName} />
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-10 h-10 text-green-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="gradient-gold">Thank You for Your Purchase!</span>
        </h1>

        <p className="text-text-secondary text-lg mb-8 leading-relaxed">
          Your copy of{" "}
          <strong className="text-text-primary">{productName}</strong> is on its
          way.
        </p>

        {/* Download Section */}
        {tokenValid && Object.keys(downloadLinks).length > 0 ? (
          <DownloadSection links={downloadLinks} />
        ) : (
          <div className="bg-surface/60 border border-gold/20 rounded-2xl p-8 mb-8 text-left card-glow">
            <h2 className="font-bold text-lg mb-4">What happens next:</h2>
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Check your email",
                  desc: "You'll receive a confirmation email with your download link within a few minutes.",
                },
                {
                  step: "2",
                  title: "Download your files",
                  desc: "Click the download link in the email to get your PDF playbooks and bonus files.",
                },
                {
                  step: "3",
                  title: "Load the system prompt",
                  desc: "Open the PDF, copy the AI system prompt, and paste it into Claude, ChatGPT, or Gemini.",
                },
                {
                  step: "4",
                  title: "Start executing",
                  desc: "Tell the AI about your business and watch the framework come alive with personalized strategies.",
                },
              ].map((s) => (
                <div key={s.step} className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 bg-gold/10 border border-gold/20 rounded-lg flex items-center justify-center font-bold text-gold text-sm">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary text-sm">
                      {s.title}
                    </h3>
                    <p className="text-text-secondary text-sm">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-surface/40 border border-white/5 rounded-xl p-6 mb-8">
          <p className="text-text-secondary text-sm mb-3">
            Didn&apos;t receive your email? Check your spam folder, or contact
            us:
          </p>
          <a
            href="mailto:hello@ai-native-playbook.com"
            className="text-gold hover:text-gold-light transition-colors font-semibold"
          >
            hello@ai-native-playbook.com
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-text-secondary border border-white/10 hover:border-gold/30 hover:text-gold transition-all text-sm"
          >
            Browse More Books
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-text-secondary border border-white/10 hover:border-gold/30 hover:text-gold transition-all text-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Download section showing all available download links.
 * Bundle purchases show all files; individual purchases show one.
 */
function DownloadSection({ links }: { links: Record<string, string> }) {
  const hasBundle = "bundle" in links;
  const pdfKeys = Object.keys(links).filter((k) => k.startsWith("pdf-vol"));
  const bonusKeys = Object.keys(links).filter((k) =>
    ["skills", "agents", "notion"].includes(k)
  );

  return (
    <div className="bg-surface/60 border border-gold/20 rounded-2xl p-8 mb-8 text-left card-glow">
      <h2 className="font-bold text-lg mb-2">Your Downloads</h2>
      <p className="text-text-secondary text-sm mb-6">
        Click the buttons below to download your files. Links expire in 7 days.
      </p>

      {/* Bundle download (primary CTA) */}
      {hasBundle && (
        <div className="mb-6">
          <a
            href={links.bundle}
            className="block w-full text-center bg-gold/90 hover:bg-gold text-bg-primary font-bold py-4 px-6 rounded-xl transition-colors text-base"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download Complete Bundle (ZIP)
            </span>
          </a>
          <p className="text-text-secondary text-xs mt-2 text-center">
            All 6 PDFs + AI Skills + Agent Settings + Notion Templates
          </p>
        </div>
      )}

      {/* Individual PDF downloads */}
      {pdfKeys.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-sm text-text-secondary mb-3 uppercase tracking-wider">
            {hasBundle ? "Or download individually:" : "Your Download:"}
          </h3>
          <div className="grid gap-2">
            {pdfKeys.sort().map((key) => {
              const label = PRODUCT_LABELS[key];
              return (
                <a
                  key={key}
                  href={links[key]}
                  className="flex items-center justify-between p-3 rounded-lg border border-white/10 hover:border-gold/30 hover:bg-gold/5 transition-all group"
                >
                  <div>
                    <span className="text-text-primary text-sm font-medium group-hover:text-gold transition-colors">
                      {label?.title ?? key}
                    </span>
                    <span className="text-text-secondary text-xs ml-2">
                      {label?.description ?? "PDF"}
                    </span>
                  </div>
                  <svg className="w-4 h-4 text-text-secondary group-hover:text-gold transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Bonus files */}
      {bonusKeys.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm text-text-secondary mb-3 uppercase tracking-wider">
            Bonus Files:
          </h3>
          <div className="grid gap-2">
            {bonusKeys.map((key) => {
              const label = PRODUCT_LABELS[key];
              return (
                <a
                  key={key}
                  href={links[key]}
                  className="flex items-center justify-between p-3 rounded-lg border border-white/10 hover:border-gold/30 hover:bg-gold/5 transition-all group"
                >
                  <div>
                    <span className="text-text-primary text-sm font-medium group-hover:text-gold transition-colors">
                      {label?.title ?? key}
                    </span>
                    <span className="text-text-secondary text-xs ml-2">
                      {label?.description ?? ""}
                    </span>
                  </div>
                  <svg className="w-4 h-4 text-text-secondary group-hover:text-gold transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
