"use client";

import { use, useEffect, useState, type ReactNode } from "react";
import { useCartStore } from "@/lib/cart/store";

let rehydratePromise: Promise<void> | null = null;

/**
 * Returns a stable promise that resolves when the cart store is rehydrated from localStorage.
 * Resolve once per app load; same promise is returned on every call.
 * On the server (prerender), returns an already-resolved promise so we never access .persist.
 */
function getRehydratePromise(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }
  if (!rehydratePromise) {
    rehydratePromise = Promise.resolve(
      useCartStore.persist?.rehydrate?.() ?? Promise.resolve(),
    ).then(() => {});
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

/**
 * Non-Suspense hook that returns true once the cart store has been rehydrated
 * from localStorage on the client. Useful for components like the header that
 * need to avoid reading stale (empty) cart state on first paint.
 */
export function useCartHydration(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    getRehydratePromise().then(() => {
      if (mounted) {
        setHydrated(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return hydrated;
}
