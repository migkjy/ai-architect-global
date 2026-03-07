"use client";

import { useEffect, useState, useCallback } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const DISMISS_KEY = "ai_architect_exit_dismissed";
const SUBSCRIBED_KEY = "ai_architect_subscribed";
const DISMISS_DAYS = 14;

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
  }, []);

  // Exit intent detection (desktop only)
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) return;
    try {
      if (localStorage.getItem(SUBSCRIBED_KEY)) return;
      const dismissed = localStorage.getItem(DISMISS_KEY);
      if (dismissed) {
        const daysPassed = (Date.now() - parseInt(dismissed, 10)) / (1000 * 60 * 60 * 24);
        if (daysPassed < DISMISS_DAYS) return;
      }
    } catch {}

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

  // Auto-close on success
  useEffect(() => {
    if (status === "success") {
      const t = setTimeout(dismiss, 3000);
      return () => clearTimeout(t);
    }
  }, [status, dismiss]);

  // ESC key
  useEffect(() => {
    if (!visible) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
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
        body: JSON.stringify({ email }),
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
      <div className="relative w-full max-w-md bg-navy-light border border-gold/20 rounded-2xl p-8 shadow-2xl">
        <button
          onClick={dismiss}
          aria-label="Close"
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
              You&apos;re on the list!
            </h2>
            <p className="text-text-secondary text-sm">
              Check your inbox for the AI Architecture Design sample.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-5">
              <div className="inline-block bg-gold/10 border border-gold/20 text-gold text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
                500+ entrepreneurs inside
              </div>
              <p className="text-2xl mb-2">&#128218;</p>
              <h2
                id="exit-popup-title"
                className="text-xl font-bold text-text-primary mb-1"
              >
                Before You Go — Free Framework Inside
              </h2>
              <p className="text-text-secondary text-sm">
                Join 500+ entrepreneurs getting AI-powered business frameworks every week
              </p>
            </div>

            <ul className="mb-5 space-y-2 text-sm text-text-secondary">
              <li className="flex items-center gap-2.5">
                <span className="text-gold shrink-0">&#10003;</span>
                <span>AI Framework preview — cut 50%+ strategy time</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-gold shrink-0">&#10003;</span>
                <span>3 ready-to-use system prompts (Claude / ChatGPT)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-gold shrink-0">&#10003;</span>
                <span>Weekly AI business insight — every Friday</span>
              </li>
            </ul>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label htmlFor="exit-popup-email" className="sr-only">
                Email address
              </label>
              <input
                id="exit-popup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-navy-dark/80 border border-white/10 text-text-primary placeholder:text-text-muted focus:border-gold/40 focus:outline-none text-sm"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full px-6 py-3 bg-gold text-navy-dark font-bold rounded-xl hover:bg-gold-light transition-all text-sm disabled:opacity-50"
              >
                {status === "loading" ? "..." : "Send Me the Free Framework"}
              </button>
              {status === "error" && (
                <p role="alert" className="text-center text-xs text-red-400">
                  {errorMsg}
                </p>
              )}
            </form>

            <p className="mt-3 text-center text-xs text-text-muted">
              No spam. Unsubscribe anytime.
            </p>

            <button
              onClick={dismiss}
              className="mt-3 block w-full text-center text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              No thanks, I don&apos;t need free frameworks
            </button>
          </>
        )}
      </div>
    </div>
  );
}
