"use client";

import { useState, useEffect } from "react";
import { getCtaVariant, CTA_VARIANTS, type CtaVariant } from "@/lib/cta-config";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

type EmailCaptureProps = {
  buttonText?: string;
  className?: string;
};

export default function EmailCapture({
  buttonText,
  className = "",
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [variant, setVariant] = useState<CtaVariant>("A");

  useEffect(() => {
    setVariant(getCtaVariant());
  }, []);

  const copy = CTA_VARIANTS.emailCapture[variant];
  const resolvedButtonText = buttonText ?? copy.buttonText;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    window.gtag?.("event", "signup_start", { event_category: "lead", event_label: `email-capture-${variant}` });

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website, source: `email-capture-${variant}` }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
        window.gtag?.("event", "signup_complete", { event_category: "lead", event_label: `email-capture-${variant}` });
        window.gtag?.("event", "email_capture", { source: "email-capture-form" });
        window.fbq?.('track', 'Lead');
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={`text-center py-3 px-6 bg-green-500/10 border border-green-500/20 rounded-xl ${className}`}>
        <p className="text-green-400 font-semibold text-sm">You&apos;re on the list! We&apos;ll notify you at launch.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-text-secondary">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 border border-gold/20 px-3 py-1 font-semibold text-gold">
          {copy.badge}
        </span>
      </div>
      <ul className="mb-4 space-y-1.5 text-sm text-text-secondary">
        {copy.benefits.map((benefit, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="text-gold shrink-0">&#10003;</span>
            {benefit}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="absolute opacity-0 -z-10 h-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="ec-website">Website</label>
          <input
            id="ec-website"
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <label htmlFor="email-capture-input" className="sr-only">
          Email address
        </label>
        <input
          id="email-capture-input"
          type="email"
          required
          placeholder="Enter your work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-describedby={status === "error" ? "email-capture-error" : undefined}
          className="flex-1 px-4 py-3 rounded-xl bg-navy-dark/80 border border-white/10 text-text-primary placeholder:text-text-muted focus:border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold/30 text-sm"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-gold text-navy-dark font-bold rounded-xl hover:bg-gold-light transition-all transform hover:scale-105 text-sm whitespace-nowrap"
        >
          {resolvedButtonText}
        </button>
        {status === "error" && (
          <p id="email-capture-error" role="alert" className="text-red-400 text-xs mt-1">Something went wrong. Try again.</p>
        )}
      </form>
      <p className="mt-2 text-xs text-text-muted">{copy.footer}</p>
    </div>
  );
}
