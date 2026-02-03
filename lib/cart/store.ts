"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartState, CartItem, CheckoutFormData } from "@/lib/cart/types";
import { CART_STORAGE_KEY, DEFAULT_CART_STATE } from "@/lib/cart/types";

type CartStore = CartState & {
  setStep: (step: 1 | 2 | 3) => void;
  addItem: (productId: string, quantity?: number) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  setPromoCode: (code: string) => void;
  setFormData: (data: Partial<CheckoutFormData>) => void;
  setOrderSubmitted: (value: boolean) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  canProceedToStep2: () => boolean;
  canProceedToStep3: () => boolean;
};

function parseStoredItems(items: unknown): CartItem[] {
  if (!Array.isArray(items)) return [];
  return items.filter(
    (i): i is CartItem =>
      i != null &&
      typeof i === "object" &&
      typeof (i as CartItem).productId === "string" &&
      typeof (i as CartItem).quantity === "number",
  );
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_CART_STATE,

      setStep: (step) => set({ step }),

      addItem: (productId, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === productId);
          const items = existing
            ? state.items.map((i) =>
                i.productId === productId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              )
            : [...state.items, { productId, quantity }];
          return { items };
        });
      },

      updateItemQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          ),
        }));
      },

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      setPromoCode: (promoCode) => set({ promoCode }),

      setFormData: (formData) =>
        set((state) => ({
          formData: { ...state.formData, ...formData },
        })),

      setOrderSubmitted: (orderSubmitted) => set({ orderSubmitted }),

      canProceedToStep2: () => {
        const { items } = get();
        return items.length >= 1 && items.every((i) => i.quantity >= 1);
      },

      canProceedToStep3: () => get().orderSubmitted === true,

      goToNextStep: () => {
        const state = get();
        if (state.step === 1) {
          const can =
            state.items.length >= 1 &&
            state.items.every((i) => i.quantity >= 1);
          if (can) set({ step: 2 });
        } else if (state.step === 2 && state.orderSubmitted) {
          set({ step: 3 });
        }
      },

      goToPrevStep: () =>
        set((state) => ({
          step: Math.max(1, state.step - 1) as 1 | 2 | 3,
        })),
    }),
    {
      name: CART_STORAGE_KEY,
      skipHydration: true,
      partialize: (state) => ({
        step: state.step,
        items: state.items,
        promoCode: state.promoCode,
        formData: state.formData,
        orderSubmitted: state.orderSubmitted,
      }),
      merge: (persisted, current) => {
        if (!persisted || typeof persisted !== "object") return current;
        const p = persisted as Record<string, unknown>;
        return {
          ...current,
          step:
            typeof p.step === "number" && p.step >= 1 && p.step <= 3
              ? (p.step as 1 | 2 | 3)
              : current.step,
          items: parseStoredItems(p.items),
          promoCode:
            typeof p.promoCode === "string" ? p.promoCode : current.promoCode,
          formData:
            p.formData && typeof p.formData === "object"
              ? { ...current.formData, ...p.formData }
              : current.formData,
          orderSubmitted:
            typeof p.orderSubmitted === "boolean"
              ? p.orderSubmitted
              : current.orderSubmitted,
        };
      },
    },
  ),
);

/** Hook with same API as old useCart() for drop-in replacement */
export function useCart(): CartStore {
  return useCartStore();
}
