"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function GA4PurchaseComplete({ productName }: { productName: string }) {
  useEffect(() => {
    window.gtag?.("event", "purchase_complete", {
      event_category: "ecommerce",
      event_label: productName,
    });
  }, [productName]);

  return null;
}
