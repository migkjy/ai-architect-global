"use client";

import { useEffect, useState } from "react";
import { getCtaVariant, CTA_VARIANTS, type CtaVariant } from "@/lib/cta-config";
import FreeGuideForm from "@/components/FreeGuideForm";

interface FreeGuideFormWithABProps {
  /** Translated CTA button label (variant A / i18n default) */
  ctaLabel: string;
  /** Translated form heading (variant A / i18n default) */
  heading: string;
  /** Translated subheading (variant A / i18n default) */
  subheading: string;
}

/**
 * Client wrapper that applies A/B variant overrides to the free-guide form.
 * Variant A: uses i18n-provided labels (control).
 * Variant B: overrides heading, subheading, and CTA with benefit-focused copy.
 */
export default function FreeGuideFormWithAB({
  ctaLabel,
  heading,
  subheading,
}: FreeGuideFormWithABProps) {
  const [variant, setVariant] = useState<CtaVariant>("A");

  useEffect(() => {
    const v = getCtaVariant();
    setVariant(v);

    // GA4: track which variant was shown
    window.gtag?.("event", "free_guide_ab_impression", {
      event_category: "experiment",
      event_label: "free_guide_form",
      variant: v,
    });
  }, []);

  const cfg = CTA_VARIANTS.freeGuide[variant];

  const displayHeading = variant === "B" ? cfg.heading : heading;
  const displaySubheading = variant === "B" ? cfg.subheading : subheading;
  const displayCta = variant === "B" ? cfg.ctaButton : ctaLabel;

  return (
    <>
      <h2 className="text-xl font-bold text-center mb-2 mt-2">
        {displayHeading}
      </h2>
      <p className="text-text-secondary text-sm text-center mb-6">
        {displaySubheading}
      </p>
      <FreeGuideForm ctaLabel={displayCta} variant={variant} />
    </>
  );
}
