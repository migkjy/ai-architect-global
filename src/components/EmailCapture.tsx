"use client";

import { useState } from "react";

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
  buttonText = "Notify Me at Launch",
  className = "",
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
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
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-2 ${className}`}>
      <label htmlFor="email-capture-input" className="sr-only">
        Email address
      </label>
      <input
        id="email-capture-input"
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-describedby={status === "error" ? "email-capture-error" : undefined}
        className="flex-1 px-4 py-3 rounded-xl bg-navy-dark/80 border border-white/10 text-text-primary placeholder:text-text-muted focus:border-gold/40 focus:outline-none text-sm"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-gold text-navy-dark font-bold rounded-xl hover:bg-gold-light transition-all transform hover:scale-105 text-sm whitespace-nowrap"
      >
        {buttonText}
      </button>
      {status === "error" && (
        <p id="email-capture-error" role="alert" className="text-red-400 text-xs mt-1">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
