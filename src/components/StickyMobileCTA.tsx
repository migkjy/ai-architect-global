"use client";

import { useState, useEffect } from "react";

export default function StickyMobileCTA({
  bundlePrice,
  bundleUrl,
  paddlePriceId,
  paddleSuccessUrl,
  labels,
}: {
  bundlePrice: number;
  bundleUrl: string;
  paddlePriceId?: string;
  paddleSuccessUrl?: string;
  labels: {
    completeBundle: string;
    instantDownload: string;
    moneyBack: string;
    getBundle: string;
  };
}) {
  const [visible, setVisible] = useState(false);
  const [paddleReady, setPaddleReady] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 500);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!paddlePriceId) return;
    function checkPaddle() {
      if (window.Paddle?.Checkout) {
        setPaddleReady(true);
        return true;
      }
      return false;
    }
    if (checkPaddle()) return;
    const interval = setInterval(() => {
      if (checkPaddle()) clearInterval(interval);
    }, 300);
    const timeout = setTimeout(() => clearInterval(interval), 10000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [paddlePriceId]);

  if (!visible) return null;

  function handleBuyClick(e: React.MouseEvent) {
    window.gtag?.("event", "cta_click", { event_category: "engagement", event_label: "sticky_mobile_cta", cta_location: "sticky_bottom" });
    window.fbq?.("track", "InitiateCheckout", { content_name: "Complete Bundle (Sticky CTA)" });

    if (paddlePriceId && paddleReady && window.Paddle?.Checkout) {
      e.preventDefault();
      const siteUrl = window.location.origin;
      window.Paddle.Checkout.open({
        items: [{ priceId: paddlePriceId, quantity: 1 }],
        settings: {
          successUrl: paddleSuccessUrl ?? `${siteUrl}/thank-you`,
        },
      });
    }
  }

  // Use Paddle overlay if ready, otherwise fall back to href link
  const usePaddleOverlay = !!paddlePriceId && paddleReady;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-navy-dark/97 backdrop-blur-md border-t border-gold/20 px-4 py-3 flex items-center justify-between gap-3 shadow-lg"
      role="region"
      aria-label="Purchase call to action"
    >
      <div>
        <div className="text-sm font-bold text-text-primary">
          {labels.completeBundle}
          <span className="text-gold ml-2">${bundlePrice}</span>
          <span className="text-xs text-text-secondary line-through ml-1.5">$102</span>
        </div>
        <div className="text-xs text-text-muted">{labels.instantDownload} · {labels.moneyBack}</div>
      </div>
      {usePaddleOverlay ? (
        <button
          type="button"
          onClick={handleBuyClick}
          className="bg-gold text-navy-dark px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gold-light transition-colors whitespace-nowrap cursor-pointer"
        >
          {labels.getBundle} &mdash; ${bundlePrice}
        </button>
      ) : (
        <a
          href={bundleUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleBuyClick}
          aria-label={`${labels.getBundle} — $${bundlePrice} (opens in new tab)`}
          className="bg-gold text-navy-dark px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gold-light transition-colors whitespace-nowrap"
        >
          {labels.getBundle} &mdash; ${bundlePrice}
        </a>
      )}
    </div>
  );
}
