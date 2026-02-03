"use client";

import { use, type ReactNode } from "react";
import { useCartStore } from "@/lib/cart/store";

let rehydratePromise: Promise<void> | null = null;

/**
 * Returns a stable promise that resolves when the cart store is rehydrated from localStorage.
 * Resolve once per app load; same promise is returned on every call.
 */
function getRehydratePromise(): Promise<void> {
  if (!rehydratePromise) {
    rehydratePromise = Promise.resolve(useCartStore.persist.rehydrate()).then(
      () => {},
    );
  }
  return rehydratePromise;
}

/**
 * Suspends until the cart store is rehydrated. Must be used inside a Suspense boundary.
 * Use on the cart page so content doesn't show "Korpa je prazna" before persisted state is loaded.
 */
export function CartRehydrated({ children }: { children: ReactNode }) {
  use(getRehydratePromise());
  return <>{children}</>;
}
