"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart/store";
import { Toaster } from "@/components/ui/sonner";
import { CheckoutStepIndicator } from "@/components/cart/checkout-step-indicator";
import { CartStep } from "@/components/cart/cart-step";
import { CheckoutFormStep } from "@/components/cart/checkout-form-step";
import { OrderConfirmationStep } from "@/components/cart/order-confirmation-step";
import type { Product } from "@/lib/sanity/types";

function useCartProducts(productIds: string[]) {
  const idsKey = productIds.length > 0 ? productIds.join(",") : "";
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productIds.length === 0) return;
    let cancelled = false;
    setLoading(true);
    fetch("/api/cart-products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: productIds }),
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Product[]) => {
        if (!cancelled) {
          setFetchedProducts(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFetchedProducts([]);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
    // idsKey is a stable string derived from productIds; using productIds would re-run every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  return {
    products: productIds.length === 0 ? [] : fetchedProducts,
    loading: productIds.length > 0 && loading,
  };
}

/** Normalize Sanity _id so cart productId (with or without "drafts.") finds the product */
function productMapKey(_id: string): string {
  return _id.startsWith("drafts.") ? _id.slice(7) : _id;
}

export default function CartPage() {
  const { step, items, orderSubmitted } = useCart();
  const productIds = items.map((i) => i.productId);
  const { products, loading } = useCartProducts(productIds);
  const productsMap = new Map(
    products.map((p) => [productMapKey(p._id), p] as const),
  );

  const effectiveStep = step === 3 && !orderSubmitted ? 2 : step;

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <main className="relative w-full bg-white">
        <div
          className="pointer-events-none absolute inset-0 select-none overflow-hidden opacity-[0.03]"
          aria-hidden
        >
          <Image
            src="/hero-background.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <section className="relative mx-auto w-full max-w-[95%] px-4 py-8 lg:max-w-[85%] lg:py-12">
          <CheckoutStepIndicator currentStep={effectiveStep} />

          <div className="mx-auto max-w-4xl">
            {effectiveStep === 1 && (
              <CartStep productsMap={productsMap} productsLoading={loading} />
            )}
            {effectiveStep === 2 && (
              <CheckoutFormStep
                productsMap={productsMap}
                productsLoading={loading}
              />
            )}
            {effectiveStep === 3 && <OrderConfirmationStep />}
          </div>
        </section>
      </main>
      <Toaster richColors position="top-center" />
    </div>
  );
}
