"use client";

import EmailCapture from "@/components/EmailCapture";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    Paddle?: {
      Environment?: {
        set: (env: string) => void;
      };
      Setup?: (options: { token: string }) => void;
      Checkout?: {
        open: (options: {
          items: Array<{ priceId: string; quantity: number }>;
          settings?: {
            successUrl?: string;
            frameTarget?: string;
            frameInitialHeight?: number;
            frameStyle?: string;
          };
        }) => void;
      };
    };
  }
}

type BuyButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  /** Paddle Price ID (설정 시 Paddle overlay checkout 사용) */
  paddlePriceId?: string;
  /** Paddle checkout 성공 후 리디렉션 URL */
  paddleSuccessUrl?: string;
};

export default function BuyButton({
  href,
  children,
  className = "",
  variant = "primary",
  paddlePriceId,
  paddleSuccessUrl,
}: BuyButtonProps) {
  const base =
    variant === "primary"
      ? "bg-gold text-navy-dark hover:bg-gold-light shadow-lg shadow-gold/20"
      : "bg-surface border border-gold/30 text-gold hover:border-gold/60";

  // Paddle Price ID가 있으면 Paddle overlay 사용
  const usePaddleOverlay = !!paddlePriceId;

  // href="#" 이고 Paddle Price ID도 없으면 이메일 캡처 폼 표시
  const isDisabled = !usePaddleOverlay && (href === "#" || !href);

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

  function handleBuyClick(e: React.MouseEvent) {
    window.gtag?.("event", "buy_click", { item_name: String(children) });
    window.fbq?.("track", "InitiateCheckout", { content_name: String(children) });

    if (usePaddleOverlay && window.Paddle?.Checkout) {
      e.preventDefault();

      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";

      window.Paddle.Checkout.open({
        items: [{ priceId: paddlePriceId!, quantity: 1 }],
        settings: {
          successUrl: paddleSuccessUrl ?? `${siteUrl}/thank-you`,
        },
      });
    }
    // Paddle이 로드되지 않았거나 priceId가 없으면 href 링크로 폴백
  }

  // Paddle overlay 사용 시 button 태그, 아니면 a 태그
  if (usePaddleOverlay) {
    return (
      <button
        type="button"
        onClick={handleBuyClick}
        className={`inline-flex items-center justify-center px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 cursor-pointer ${base} ${className}`}
      >
        {children}
      </button>
    );
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
