import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Thank You for Your Purchase | AI Native Playbook Series",
  description:
    "Your AI Native Playbook PDF is ready. Check your email for the download link.",
  robots: { index: false, follow: false },
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

  return (
    <div className="min-h-screen pt-32 pb-20">
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
                title: "Download your PDF",
                desc: "Click the download link in the email, or access it directly from your Lemon Squeezy receipt.",
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
