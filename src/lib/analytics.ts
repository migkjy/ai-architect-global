/**
 * GA4 Event Tracking Utility — ai-native-playbook.com
 * Measurement ID: G-76C0HSW5LB
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, string | number | boolean | undefined>;

function trackEvent(eventName: string, params?: EventParams) {
  window.gtag?.("event", eventName, params);
}

// ── CTA Click Events ──────────────────────────────────────────────
export function trackCTAClick(label: string, location: string) {
  trackEvent("cta_click", {
    event_category: "engagement",
    event_label: label,
    cta_location: location,
  });
}

// ── Signup / Subscribe Events ─────────────────────────────────────
export function trackSignupStart(source: string) {
  trackEvent("signup_start", {
    event_category: "lead",
    event_label: source,
  });
}

export function trackSignupComplete(source: string) {
  trackEvent("signup_complete", {
    event_category: "lead",
    event_label: source,
  });
}

// ── Purchase Events ───────────────────────────────────────────────
export function trackPurchaseStart(itemName: string) {
  trackEvent("purchase_start", {
    event_category: "ecommerce",
    event_label: itemName,
  });
}

export function trackPurchaseComplete(productName: string) {
  trackEvent("purchase_complete", {
    event_category: "ecommerce",
    event_label: productName,
  });
}
