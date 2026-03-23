"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const EmailCapture = dynamic(() => import("@/components/EmailCapture"));

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
  const [paddleReady, setPaddleReady] = useState(false);

  useEffect(() => {
    if (!paddlePriceId) return;

    // Paddle.js가 로드되어 Checkout.open이 사용 가능한지 확인
    function checkPaddle() {
      if (window.Paddle?.Checkout) {
        setPaddleReady(true);
        return true;
      }
      return false;
    }

    if (checkPaddle()) return;

    // Use shorter initial delay to catch already-loaded Paddle, then back off
    const interval = setInterval(() => {
      if (checkPaddle()) clearInterval(interval);
    }, 300);

    // 4초 후 포기 (Paddle.js 미로드 = Client Token 미설정)
    const timeout = setTimeout(() => clearInterval(interval), 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [paddlePriceId]);

  const base =
    variant === "primary"
      ? "bg-gold text-navy-dark hover:bg-gold-light shadow-lg shadow-gold/20"
      : "bg-surface border border-gold/30 text-gold hover:border-gold/60";

  // Paddle Price ID가 있고 Paddle.js 준비됨 → Paddle overlay 사용
  const usePaddleOverlay = !!paddlePriceId && paddleReady;

  // Paddle Price ID가 있지만 Paddle.js 미로드 → 결제 시스템 준비 중
  const paddleNotReady = !!paddlePriceId && !paddleReady;

  // href="#" 이고 Paddle Price ID도 없으면 이메일 캡처 폼 표시
  const isDisabled = !paddlePriceId && (href === "#" || !href);

  if (isDisabled) {
    return (
      <div className={`w-full max-w-md mx-auto ${className}`}>
        <p className="text-center text-gold font-semibold text-sm mb-2">
          Available Now
        </p>
        <EmailCapture buttonText="Buy Now" />
      </div>
    );
  }

  // Paddle Price ID는 있지만 Paddle.js가 로드되지 않은 상태 (Client Token 미설정)
  // href도 없으면 disabled 버튼, href가 있으면 href로 폴백
  if (paddleNotReady && (href === "#" || !href)) {
    return (
      <button
        type="button"
        disabled
        className={`inline-flex items-center justify-center px-8 py-3 rounded-xl font-bold transition-all opacity-60 cursor-not-allowed bg-surface border border-gold/30 text-gold ${className}`}
      >
        Preparing checkout&hellip;
      </button>
    );
  }

  function handleBuyClick(e: React.MouseEvent) {
    window.gtag?.("event", "cta_click", { event_category: "engagement", event_label: "buy_button", cta_location: "pricing" });
    window.gtag?.("event", "purchase_start", { event_category: "ecommerce", event_label: String(children) });
    window.gtag?.("event", "buy_click", { item_name: String(children) });
    window.fbq?.("track", "InitiateCheckout", { content_name: String(children) });

    if (usePaddleOverlay && window.Paddle?.Checkout) {
      e.preventDefault();

      const siteUrl =
        (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com").trim();

      window.Paddle.Checkout.open({
        items: [{ priceId: paddlePriceId!, quantity: 1 }],
        settings: {
          successUrl: paddleSuccessUrl ?? `${siteUrl}/thank-you`,
        },
      });
    }
    // Paddle이 로드되지 않았으면 href 링크로 폴백
  }

  // Paddle overlay 사용 시 button 태그
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

  // href 폴백 (Paddle 미로드 시 or paddlePriceId 없는 경우)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleBuyClick}
      aria-label={`${String(children)} (opens in new tab)`}
      className={`inline-flex items-center justify-center px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${base} ${className}`}
    >
      {children}
    </a>
  );
}
