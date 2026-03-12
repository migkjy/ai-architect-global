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

export function GA4LeadComplete({ source }: { source: string }) {
  useEffect(() => {
    window.gtag?.("event", "free_guide_download_page_view", {
      event_category: "lead",
      event_label: source,
    });
  }, [source]);

  return null;
}
