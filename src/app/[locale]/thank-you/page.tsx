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

/** Determine if purchase is a bundle or individual volume */
function isBundlePurchase(purchaseType: string): boolean {
  return purchaseType === "bundle";
}

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

  const isBundle = isBundlePurchase(purchaseType);
  const shareText = encodeURIComponent(
    "Just got the AI Native Playbook Series - practical AI frameworks for real business results. Highly recommend!"
  );
  const shareUrl = encodeURIComponent("https://ai-native-playbook.com/products");

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
            aria-hidden="true"
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

        {/* Upsell / Cross-sell Section */}
        {isBundle ? (
          <BundleBuyerNextSteps />
        ) : (
          <IndividualBuyerUpsell purchaseType={purchaseType} />
        )}

        {/* Social Share Section */}
        <div className="bg-surface/40 border border-white/5 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-text-primary mb-3">
            Enjoying the Playbook? Share it with your network
          </h3>
          <div className="flex gap-3 justify-center">
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1DA1F2]/10 border border-[#1DA1F2]/20 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-all text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0A66C2]/10 border border-[#0A66C2]/20 text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-all text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Share on LinkedIn
            </a>
          </div>
        </div>

        {/* Newsletter / Free Guide CTA */}
        <div className="bg-gradient-to-r from-gold/5 to-gold/10 border border-gold/20 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-text-primary mb-2">
            Get Free AI Implementation Tips
          </h3>
          <p className="text-text-secondary text-sm mb-4">
            Subscribe to our newsletter for weekly AI strategies, prompt templates, and exclusive updates on new playbooks.
          </p>
          <Link
            href="/free-guide"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 transition-all text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            Get Your Free AI Guide + Newsletter
          </Link>
        </div>

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
 * Upsell section for individual volume purchasers.
 * Encourages upgrading to the complete bundle.
 */
function IndividualBuyerUpsell({ purchaseType }: { purchaseType: string }) {
  const currentLabel = PRODUCT_LABELS[purchaseType];
  const currentTitle = currentLabel?.title ?? "your playbook";

  return (
    <div className="bg-gradient-to-br from-gold/5 via-surface/60 to-gold/10 border border-gold/30 rounded-2xl p-8 mb-8 card-glow">
      <div className="flex items-center justify-center gap-2 mb-3">
        <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
        <h3 className="font-bold text-lg text-text-primary">
          Unlock the Complete AI Playbook System
        </h3>
      </div>
      <p className="text-text-secondary text-sm mb-4">
        You have <strong className="text-text-primary">{currentTitle}</strong>. Get the remaining 5 playbooks plus AI Skills, Agent Settings, and Notion Templates in one bundle.
      </p>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {["Marketing", "Brand", "Traffic", "Story", "Startup", "Content"].map((name) => {
          const isOwned = currentTitle.includes(name);
          return (
            <div
              key={name}
              className={`text-xs py-1.5 px-2 rounded-lg text-center ${
                isOwned
                  ? "bg-green-500/10 border border-green-500/20 text-green-400"
                  : "bg-white/5 border border-white/10 text-text-secondary"
              }`}
            >
              {isOwned ? "\u2713 " : ""}AI {name}
            </div>
          );
        })}
      </div>
      <p className="text-text-secondary text-xs mb-4">
        Plus bonus: AI Agent Skills + Agent Settings + Notion Templates
      </p>
      <Link
        href="/pricing"
        className="block w-full text-center bg-gold/90 hover:bg-gold text-bg-primary font-bold py-3.5 px-6 rounded-xl transition-colors text-sm"
      >
        Upgrade to Complete Bundle &rarr;
      </Link>
    </div>
  );
}

/**
 * Next steps section for bundle purchasers.
 * Guides them to getting started and deeper engagement.
 */
function BundleBuyerNextSteps() {
  return (
    <div className="bg-gradient-to-br from-gold/5 via-surface/60 to-gold/10 border border-gold/30 rounded-2xl p-8 mb-8 card-glow">
      <h3 className="font-bold text-lg text-text-primary mb-2">
        You Have the Complete System. Here&apos;s Your Next Move.
      </h3>
      <p className="text-text-secondary text-sm mb-6">
        Maximize the value of your bundle with these recommended next steps:
      </p>
      <div className="space-y-3 text-left">
        <Link
          href="/getting-started"
          className="flex items-center gap-4 p-4 rounded-xl border border-gold/20 hover:border-gold/40 hover:bg-gold/5 transition-all group"
        >
          <div className="shrink-0 w-10 h-10 bg-gold/10 border border-gold/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <span className="font-semibold text-sm text-text-primary group-hover:text-gold transition-colors">
              Quick Start Guide
            </span>
            <p className="text-text-secondary text-xs">
              Step-by-step setup to get your AI system running in 15 minutes
            </p>
          </div>
          <svg className="w-4 h-4 text-text-secondary group-hover:text-gold transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </Link>

        <Link
          href="/products"
          className="flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:border-gold/20 hover:bg-gold/5 transition-all group"
        >
          <div className="shrink-0 w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-text-secondary group-hover:text-gold transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <div className="flex-1">
            <span className="font-semibold text-sm text-text-primary group-hover:text-gold transition-colors">
              Explore All Playbooks
            </span>
            <p className="text-text-secondary text-xs">
              Dive deeper into each volume and discover advanced strategies
            </p>
          </div>
          <svg className="w-4 h-4 text-text-secondary group-hover:text-gold transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </Link>

        <Link
          href="/skill-guide"
          className="flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:border-gold/20 hover:bg-gold/5 transition-all group"
        >
          <div className="shrink-0 w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-text-secondary group-hover:text-gold transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          </div>
          <div className="flex-1">
            <span className="font-semibold text-sm text-text-primary group-hover:text-gold transition-colors">
              AI Skill Guide
            </span>
            <p className="text-text-secondary text-xs">
              Learn how to use the included AI Skills and Agent configurations
            </p>
          </div>
          <svg className="w-4 h-4 text-text-secondary group-hover:text-gold transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </Link>
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
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
                  <svg className="w-4 h-4 text-text-secondary group-hover:text-gold transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
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
                  <svg className="w-4 h-4 text-text-secondary group-hover:text-gold transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
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
