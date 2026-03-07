"use client";

import { useState, useEffect } from "react";

export default function StickyMobileCTA({
  bundlePrice,
  bundleUrl,
}: {
  bundlePrice: number;
  bundleUrl: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 600);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  const isDisabled = bundleUrl === "#" || !bundleUrl;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-navy-dark/95 backdrop-blur-md border-t border-white/10 px-4 py-3 flex items-center justify-between gap-3">
      <div className="text-sm">
        <span className="text-text-primary font-semibold">Complete Bundle</span>
        <span className="text-gold font-bold ml-2">${bundlePrice}</span>
      </div>
      {isDisabled ? (
        <span className="bg-gold/20 text-gold px-4 py-2 rounded-lg text-xs font-bold">
          Coming Soon
        </span>
      ) : (
        <a
          href={bundleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gold text-navy-dark px-4 py-2 rounded-lg text-xs font-bold hover:bg-gold-light transition-colors"
        >
          Get Bundle
        </a>
      )}
    </div>
  );
}
