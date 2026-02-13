"use client";

import { useTrackingConsent } from "@/lib/tracking/consent-context";
import { inter } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ConsentBanner() {
  const { consent, setConsent, isHydrated } = useTrackingConsent();

  if (!isHydrated || consent !== null) {
    return null;
  }

  return (
    <section
      aria-label="Podešavanje praćenja"
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-border bg-card px-4 py-4 shadow-lg"
    >
      <div
        className={cn(
          inter.className,
          "mx-auto flex w-full max-w-[95%] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:max-w-[85%]",
        )}
      >
        <p className="text-[14px] leading-[1.5] text-foreground md:text-[16px]">
          Koristimo analitiku kako bismo poboljšali sajt. Možete prihvatiti ili
          odbiti praćenje.
        </p>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setConsent("denied")}
            className="min-w-[100px]"
          >
            Odbij
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => setConsent("accepted")}
            className="min-w-[100px]"
          >
            Prihvati
          </Button>
        </div>
      </div>
    </section>
  );
}
