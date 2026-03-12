"use client";

import { useEffect, useState, useCallback, useRef } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const DISMISS_KEY = "ai_architect_exit_dismissed";
const SUBSCRIBED_KEY = "ai_architect_subscribed";
const DISMISS_DAYS = 14;

type ExitIntentPopupLabels = {
  successTitle: string;
  successDesc: string;
  badge: string;
  title: string;
  subtitle: string;
  benefit1: string;
  benefit2: string;
  benefit3: string;
  cta: string;
  noSpam: string;
  dismiss: string;
};

export default function ExitIntentPopup({ labels, variant = "A" }: { labels: ExitIntentPopupLabels; variant?: string }) {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
  }, []);

  // Exit intent detection (desktop: mouseleave, mobile: 45s timer)
  useEffect(() => {
    try {
      if (localStorage.getItem(SUBSCRIBED_KEY)) return;
      const dismissed = localStorage.getItem(DISMISS_KEY);
      if (dismissed) {
        const daysPassed = (Date.now() - parseInt(dismissed, 10)) / (1000 * 60 * 60 * 24);
        if (daysPassed < DISMISS_DAYS) return;
      }
    } catch {}

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    if (isMobile) {
      // Mobile: show after 45 seconds of browsing
      const timer = setTimeout(() => {
        setVisible(true);
      }, 45000);
      return () => clearTimeout(timer);
    }

    // Desktop: exit intent detection
    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0) {
        setVisible(true);
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    }

    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    if (status === "success") {
      const t = setTimeout(dismiss, 3000);
      return () => clearTimeout(t);
    }
  }, [status, dismiss]);

  useEffect(() => {
    if (!visible) return;

    // Focus first focusable element when dialog opens
    const dialog = dialogRef.current;
    if (dialog) {
      const firstFocusable = dialog.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        dismiss();
        return;
      }

      // Focus trap
      if (e.key === "Tab" && dialog) {
        const focusableElements = dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const focusable = Array.from(focusableElements).filter(
          (el) => !el.closest('[aria-hidden="true"]')
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [visible, dismiss]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website, source: `exit-intent-${variant}` }),
      });
      const data = await res.json();
      if (res.ok || data.success) {
        setStatus("success");
        setEmail("");
        try {
          localStorage.setItem(SUBSCRIBED_KEY, "1");
        } catch {}
        window.gtag?.("event", "subscribe_exit_intent", { source: "ai-architect" });
        window.fbq?.("track", "Lead");
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-popup-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <div ref={dialogRef} className="relative w-full max-w-md bg-navy-light border border-gold/20 rounded-2xl p-8 shadow-2xl">
        <button
          onClick={dismiss}
          aria-label="Close popup"
          className="absolute right-4 top-4 text-text-secondary hover:text-text-primary transition-colors text-xl leading-none"
        >
          &times;
        </button>

        {status === "success" ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 border border-gold/20 rounded-full mb-4">
              <span className="text-gold text-3xl">&#10003;</span>
            </div>
            <h2 id="exit-popup-title" className="text-xl font-bold text-text-primary mb-2">
              {labels.successTitle}
            </h2>
            <p className="text-text-secondary text-sm">
              {labels.successDesc}
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-5">
              <div className="inline-block bg-gold/10 border border-gold/20 text-gold text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
                {labels.badge}
              </div>
              <p className="text-2xl mb-2">&#128218;</p>
              <h2
                id="exit-popup-title"
                className="text-xl font-bold text-text-primary mb-1"
              >
                {labels.title}
              </h2>
              <p className="text-text-secondary text-sm">
                {labels.subtitle}
              </p>
            </div>

            <ul className="mb-5 space-y-2 text-sm text-text-secondary">
              <li className="flex items-center gap-2.5">
                <span className="text-gold shrink-0">&#10003;</span>
                <span>{labels.benefit1}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-gold shrink-0">&#10003;</span>
                <span>{labels.benefit2}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-gold shrink-0">&#10003;</span>
                <span>{labels.benefit3}</span>
              </li>
            </ul>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="absolute opacity-0 -z-10 h-0 overflow-hidden" aria-hidden="true">
                <label htmlFor="exit-website">Website</label>
                <input
                  id="exit-website"
                  type="text"
                  name="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <label htmlFor="exit-popup-email" className="sr-only">
                Email address
              </label>
              <input
                id="exit-popup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your work email"
                required
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-navy-dark/80 border border-white/10 text-text-primary placeholder:text-text-muted focus:border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold/30 text-sm"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                aria-busy={status === "loading"}
                className="w-full px-6 py-3 bg-gold text-navy-dark font-bold rounded-xl hover:bg-gold-light transition-all text-sm disabled:opacity-50"
              >
                {status === "loading" ? (
                  <>
                    <span aria-hidden="true">...</span>
                    <span className="sr-only">Submitting...</span>
                  </>
                ) : labels.cta}
              </button>
              {status === "error" && (
                <p role="alert" className="text-center text-xs text-red-400">
                  {errorMsg}
                </p>
              )}
            </form>

            <p className="mt-3 text-center text-xs text-text-muted">
              {labels.noSpam}
            </p>

            <button
              onClick={dismiss}
              className="mt-3 block w-full text-center text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              {labels.dismiss}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
