"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getCtaVariant, CTA_VARIANTS, type CtaVariant } from "@/lib/cta-config";

const ExitIntentPopup = dynamic(() => import("@/components/ExitIntentPopup"), {
  ssr: false,
});
const ScrollSubscribeBanner = dynamic(() => import("@/components/ScrollSubscribeBanner"), {
  ssr: false,
});

type ExitPopupLabels = {
  successTitle: string;
  successDesc: string;
  badge: string;
  title: string;
  subtitle: string;
  benefit1: string;
  benefit2: string;
  benefit3: string;
  cta: string;
  noSpam: string;
  dismiss: string;
};

type ScrollBannerLabels = {
  title: string;
  badge: string;
  success: string;
  cta: string;
  error: string;
};

/**
 * Renders only the deferred interactive overlays (exit intent popup + scroll banner).
 * <main> content is intentionally kept outside this client boundary in layout.tsx
 * so server-rendered page content is not included in the client JS bundle.
 */
export default function IntlClientShell({
  exitPopupLabels,
  scrollBannerLabels,
}: {
  exitPopupLabels: ExitPopupLabels;
  scrollBannerLabels: ScrollBannerLabels;
}) {
  const [variant, setVariant] = useState<CtaVariant>("A");

  useEffect(() => {
    setVariant(getCtaVariant());
  }, []);

  // Apply A/B variant overrides (only for English locale — variant B overrides i18n labels)
  const abScrollLabels: ScrollBannerLabels =
    variant === "B"
      ? { ...scrollBannerLabels, ...CTA_VARIANTS.scrollBanner.B }
      : scrollBannerLabels;

  const abExitLabels: ExitPopupLabels =
    variant === "B"
      ? { ...exitPopupLabels, ...CTA_VARIANTS.exitIntent.B }
      : exitPopupLabels;

  return (
    <>
      <ScrollSubscribeBanner labels={abScrollLabels} variant={variant} />
      <ExitIntentPopup labels={abExitLabels} variant={variant} />
    </>
  );
}
