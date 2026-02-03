"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cart/store";

/** Rehydrates persisted cart state on the client to avoid SSR hydration mismatch. */
export function CartStoreHydration() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);
  return null;
}
