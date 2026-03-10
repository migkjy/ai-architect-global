"use client";

import { NextIntlClientProvider } from "next-intl";
import type { AbstractIntlMessages } from "next-intl";
import dynamic from "next/dynamic";

const ExitIntentPopup = dynamic(() => import("@/components/ExitIntentPopup"), {
  ssr: false,
});
const ScrollSubscribeBanner = dynamic(() => import("@/components/ScrollSubscribeBanner"), {
  ssr: false,
});

export default function IntlClientShell({
  messages,
  locale,
  children,
}: {
  messages: AbstractIntlMessages;
  locale: string;
  children: React.ReactNode;
}) {
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
      <ScrollSubscribeBanner />
      <ExitIntentPopup />
    </NextIntlClientProvider>
  );
}
