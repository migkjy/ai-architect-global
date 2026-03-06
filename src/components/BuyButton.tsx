"use client";

import EmailCapture from "@/components/EmailCapture";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type BuyButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
};

export default function BuyButton({
  href,
  children,
  className = "",
  variant = "primary",
}: BuyButtonProps) {
  const base =
    variant === "primary"
      ? "bg-gold text-navy-dark hover:bg-gold-light shadow-lg shadow-gold/20"
      : "bg-surface border border-gold/30 text-gold hover:border-gold/60";

  const isDisabled = href === "#" || !href;

  if (isDisabled) {
    return (
      <div className={`w-full max-w-md mx-auto ${className}`}>
        <p className="text-center text-gold font-semibold text-sm mb-2">
          Launching Soon — Get Notified
        </p>
        <EmailCapture buttonText="Notify Me at Launch" />
      </div>
    );
  }

  function handleBuyClick() {
    window.gtag?.("event", "buy_click", { item_name: String(children) });
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleBuyClick}
      className={`inline-flex items-center justify-center px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${base} ${className}`}
    >
      {children}
    </a>
  );
}
