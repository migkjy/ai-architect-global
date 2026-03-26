"use client";

import { useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        params: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact";
        }
      ) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

interface TurnstileWidgetProps {
  onTokenChange: (token: string | null) => void;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact";
}

/**
 * Cloudflare Turnstile widget component.
 *
 * When NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set, renders nothing
 * (graceful fallback for dev environments).
 * Calls onTokenChange(null) when the token expires or on error.
 */
export function TurnstileWidget({
  onTokenChange,
  theme = "dark",
  size = "normal",
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const renderWidget = useCallback(() => {
    if (!containerRef.current || !siteKey || !window.turnstile) return;

    // Remove existing widget if any
    if (widgetIdRef.current) {
      try {
        window.turnstile.remove(widgetIdRef.current);
      } catch {
        // ignore
      }
      widgetIdRef.current = null;
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token: string) => {
        onTokenChange(token);
      },
      "expired-callback": () => {
        onTokenChange(null);
      },
      "error-callback": () => {
        onTokenChange(null);
      },
      theme,
      size,
    });
  }, [siteKey, onTokenChange, theme, size]);

  useEffect(() => {
    if (!siteKey) return;

    // Script already loaded
    if (window.turnstile) {
      renderWidget();
      return;
    }

    // Register callback for when script loads
    window.onloadTurnstileCallback = renderWidget;

    // Inject script if not present
    const existing = document.querySelector(
      'script[src*="challenges.cloudflare.com/turnstile"]'
    );
    if (!existing) {
      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
      }
    };
  }, [siteKey, renderWidget]);

  // No site key = skip rendering (dev environment)
  if (!siteKey) return null;

  return <div ref={containerRef} className="my-2" />;
}
