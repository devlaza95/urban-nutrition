"use client";

import { anton, inter } from "@/lib/fonts";
import { cn } from "@/lib/utils";

const STEPS = [
  { step: 1 as const, label: "1. Korpa" },
  { step: 2 as const, label: "2. Unos podataka" },
  { step: 3 as const, label: "3. Kupovina je završena" },
] as const;

type Step = 1 | 2 | 3;

export function CheckoutStepIndicator({ currentStep }: { currentStep: Step }) {
  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-2 py-6"
      aria-label="Koraci kupovine"
    >
      {STEPS.map(({ step, label }, index) => (
        <span key={step} className="flex items-center gap-2">
          <span
            className={cn(
              inter.className,
              "text-base font-medium",
              currentStep === step
                ? "text-foreground font-semibold"
                : "text-muted-foreground",
            )}
          >
            {label}
          </span>
          {index < STEPS.length - 1 && (
            <span
              className={cn(anton.className, "text-muted-foreground text-sm")}
              aria-hidden
            >
              →
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
