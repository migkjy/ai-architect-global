"use client";

import { useState, useEffect } from "react";

export default function StickyMobileCTA({
  bundlePrice,
  bundleUrl,
  labels,
}: {
  bundlePrice: number;
  bundleUrl: string;
  labels: {
    completeBundle: string;
    instantDownload: string;
    moneyBack: string;
    comingSoon: string;
    getBundle: string;
  };
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 500);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  const isDisabled = bundleUrl === "#" || !bundleUrl;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-navy-dark/97 backdrop-blur-md border-t border-gold/20 px-4 py-3 flex items-center justify-between gap-3 shadow-lg">
      <div>
        <div className="text-sm font-bold text-text-primary">
          {labels.completeBundle}
          <span className="text-gold ml-2">${bundlePrice}</span>
          <span className="text-xs text-text-secondary line-through ml-1.5">$102</span>
        </div>
        <div className="text-xs text-text-muted">{labels.instantDownload} · {labels.moneyBack}</div>
      </div>
      {isDisabled ? (
        <span className="bg-gold/20 text-gold px-4 py-2.5 rounded-lg text-xs font-bold">
          {labels.comingSoon}
        </span>
      ) : (
        <a
          href={bundleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gold text-navy-dark px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gold-light transition-colors whitespace-nowrap"
        >
          {labels.getBundle} &mdash; ${bundlePrice}
        </a>
      )}
    </div>
  );
}
