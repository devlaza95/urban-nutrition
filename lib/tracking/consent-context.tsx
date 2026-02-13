"use client";

import * as React from "react";

export const TRACKING_CONSENT_KEY = "urban_nutrition_tracking_consent";

export type TrackingConsent = "accepted" | "denied" | null;

type TrackingConsentContextValue = {
  consent: TrackingConsent;
  setConsent: (value: "accepted" | "denied") => void;
  hasChosen: boolean;
  /** True after we have read from localStorage; use to avoid flashing the banner on refresh. */
  isHydrated: boolean;
};

const TrackingConsentContext = React.createContext<
  TrackingConsentContextValue | undefined
>(undefined);

function readStoredConsent(): TrackingConsent {
  if (globalThis.window === undefined) return null;
  try {
    const raw = globalThis.localStorage.getItem(TRACKING_CONSENT_KEY);
    if (raw === "accepted" || raw === "denied") return raw;
    return null;
  } catch {
    return null;
  }
}

export function TrackingConsentProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [consent, setConsentState] = React.useState<TrackingConsent>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setConsentState(readStoredConsent());
    setMounted(true);
  }, []);

  const setConsent = React.useCallback((value: "accepted" | "denied") => {
    try {
      globalThis.localStorage.setItem(TRACKING_CONSENT_KEY, value);
    } catch {
      // ignore
    }
    setConsentState(value);
  }, []);

  const value: TrackingConsentContextValue = React.useMemo(
    () => ({
      consent: mounted ? consent : null,
      setConsent,
      hasChosen: consent !== null,
      isHydrated: mounted,
    }),
    [consent, setConsent, mounted],
  );

  return (
    <TrackingConsentContext.Provider value={value}>
      {children}
    </TrackingConsentContext.Provider>
  );
}

export function useTrackingConsent(): TrackingConsentContextValue {
  const ctx = React.useContext(TrackingConsentContext);
  if (ctx === undefined) {
    throw new Error(
      "useTrackingConsent must be used within a TrackingConsentProvider",
    );
  }
  return ctx;
}
