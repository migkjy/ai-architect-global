"use client";

import dynamic from "next/dynamic";

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

export default function IntlClientShell({
  children,
  exitPopupLabels,
  scrollBannerLabels,
}: {
  children: React.ReactNode;
  exitPopupLabels: ExitPopupLabels;
  scrollBannerLabels: ScrollBannerLabels;
}) {
  return (
    <>
      {children}
      <ScrollSubscribeBanner labels={scrollBannerLabels} />
      <ExitIntentPopup labels={exitPopupLabels} />
    </>
  );
}
