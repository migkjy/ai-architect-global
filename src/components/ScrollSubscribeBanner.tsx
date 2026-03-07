"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const DISMISS_KEY = "ai_architect_scroll_dismissed";
const SUBSCRIBED_KEY = "ai_architect_subscribed";

export default function ScrollSubscribeBanner() {
  const pathname = usePathname();
  const isBlogPage = pathname?.includes("/blog");
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const t = useTranslations("scrollBanner");

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {}
  }, []);

  useEffect(() => {
    if (!isBlogPage) return;
    try {
      if (localStorage.getItem(SUBSCRIBED_KEY)) return;
      if (sessionStorage.getItem(DISMISS_KEY)) return;
    } catch {}

    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      if (window.scrollY / scrollable >= 0.5) {
        setVisible(true);
        window.removeEventListener("scroll", handleScroll);
        window.gtag?.("event", "scroll_cta_view", { source: "ai-architect" });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (status === "success") {
      const t = setTimeout(dismiss, 3000);
      return () => clearTimeout(t);
    }
  }, [status, dismiss]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
        try {
          localStorage.setItem(SUBSCRIBED_KEY, "1");
        } catch {}
        window.gtag?.("event", "subscribe_scroll_cta", { source: "ai-architect" });
        window.fbq?.("track", "Lead");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gold/20 bg-navy/95 backdrop-blur-sm shadow-lg px-4 py-3"
      role="banner"
    >
      <div className="mx-auto max-w-2xl flex items-center gap-3">
        <div className="hidden sm:flex flex-col shrink-0">
          <span className="text-sm font-bold text-text-primary leading-tight">{t("title")}</span>
          <span className="text-xs text-gold/80">{t("badge")}</span>
        </div>

        {status === "success" ? (
          <p className="flex-1 text-sm text-green-400 font-medium">
            {t("success")}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
            <label htmlFor="scroll-email" className="sr-only">Email address</label>
            <input
              id="scroll-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email"
              required
              className="flex-1 min-w-0 rounded-xl border border-white/10 bg-navy-dark/80 px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-colors"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-xl bg-gold px-4 py-1.5 text-sm font-bold text-navy-dark hover:bg-gold-light transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {status === "loading" ? "..." : t("cta")}
            </button>
          </form>
        )}

        <button
          onClick={dismiss}
          aria-label="Close"
          className="text-text-secondary hover:text-text-primary transition-colors shrink-0 text-lg leading-none"
        >
          &times;
        </button>
      </div>
      {status === "error" && (
        <p className="text-center text-xs text-red-400 mt-1">{t("error")}</p>
      )}
    </div>
  );
}
