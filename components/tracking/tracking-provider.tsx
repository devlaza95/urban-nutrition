"use client";

import { TrackingConsentProvider } from "@/lib/tracking/consent-context";
import { ConsentBanner } from "@/components/tracking/consent-banner";
import { MetaPixel } from "@/components/tracking/meta-pixel";

export function TrackingProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TrackingConsentProvider>
      {children}
      <ConsentBanner />
      <MetaPixel />
    </TrackingConsentProvider>
  );
}
