"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart/store";
import { Button } from "@/components/ui/button";
import { anton, inter } from "@/lib/fonts";
import { urlFor } from "@/lib/sanity/image";
import type { Product } from "@/lib/sanity/types";
import { DELIVERY_COST_RSD } from "@/lib/cart/types";
import { cn } from "@/lib/utils";

function formatRsd(price: number) {
  return `${price.toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 0 })} RSD`;
}

function getProductWeight(product: Product): string {
  if (
    product.shortDescription &&
    typeof product.shortDescription === "string"
  ) {
    const match = product.shortDescription.match(/\d+\s*g/);
    if (match) return match[0];
  }
  return "500g";
}

type CartStepProps = {
  productsMap: Map<string, Product>;
  productsLoading?: boolean;
};

export function CartStep({ productsMap, productsLoading }: CartStepProps) {
  const {
    items,
    promoCode,
    setPromoCode,
    updateItemQuantity,
    goToNextStep,
    canProceedToStep2,
  } = useCart();

  const subtotal = items.reduce((sum, item) => {
    const product = productsMap.get(item.productId);
    const price = product?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const allProductsLoaded = items.every((item) =>
    productsMap.has(item.productId),
  );

  if (items.length === 0) {
    return (
      <div
        className={cn(
          inter.className,
          "rounded-2xl bg-secondary/50 p-8 text-center text-muted-foreground",
        )}
      >
        <p className="mb-4">
          Korpa je prazna. Dodajte proizvod da biste nastavili.
        </p>
        <Button
          asChild
          className="h-12 rounded-full px-10 text-base font-semibold"
        >
          <Link href="/#protein">Dodaj protein</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="bg-[#65609d] px-4 py-3 text-white">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-5">
              <span className={cn(anton.className, "text-sm font-normal")}>
                Naziv proizvoda
              </span>
            </div>
            <div className="col-span-2 text-center">
              <span className={cn(anton.className, "text-sm font-normal")}>
                Količina
              </span>
            </div>
            <div className="col-span-2 text-center">
              <span className={cn(anton.className, "text-sm font-normal")}>
                Cena/kom
              </span>
            </div>
            <div className="col-span-3 text-right">
              <span className={cn(anton.className, "text-sm font-normal")}>
                Ukupno za plaćanje
              </span>
            </div>
          </div>
        </div>
        <div className="divide-y divide-border">
          {productsLoading && !allProductsLoaded ? (
            <div className="px-4 py-8 text-center">
              <p className={cn(inter.className, "text-muted-foreground")}>
                Učitavanje proizvoda...
              </p>
            </div>
          ) : (
            items.map((item) => {
              const product = productsMap.get(item.productId);
              if (!product) return null;
              const price = product.price ?? 0;
              const total = price * item.quantity;
              const image = product.images?.[0];
              return (
                <div
                  key={item.productId}
                  className="grid grid-cols-12 gap-4 items-center px-4 py-4"
                >
                  <div className="col-span-5 flex items-center gap-4">
                    {image ? (
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={urlFor(image).width(80).height(80).url()}
                          alt={product.name ?? "Product"}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    ) : null}
                    <div>
                      <p
                        className={cn(
                          inter.className,
                          "font-medium text-foreground",
                        )}
                      >
                        {product.name}
                      </p>
                      <p
                        className={cn(
                          inter.className,
                          "text-sm text-muted-foreground",
                        )}
                      >
                        {getProductWeight(product)}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center justify-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-full border-brand/30 bg-secondary/50"
                      onClick={() =>
                        updateItemQuantity(
                          item.productId,
                          Math.max(1, item.quantity - 1),
                        )
                      }
                    >
                      −
                    </Button>
                    <span
                      className={cn(
                        inter.className,
                        "min-w-[2ch] text-center font-medium",
                      )}
                    >
                      {item.quantity}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-full border-brand/30 bg-secondary/50"
                      onClick={() =>
                        updateItemQuantity(item.productId, item.quantity + 1)
                      }
                    >
                      +
                    </Button>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className={cn(inter.className, "text-foreground")}>
                      {formatRsd(price)}
                    </span>
                  </div>
                  <div className="col-span-3 text-right">
                    <span
                      className={cn(
                        inter.className,
                        "font-medium text-foreground",
                      )}
                    >
                      {formatRsd(total)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <p className="leading-7 text-primary">
        Za 3+ poručenih proizvoda poštarina je besplatna!
      </p>
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-secondary/30 px-4 py-3">
        <label
          htmlFor="promo-code"
          className={cn(inter.className, "font-medium text-foreground")}
        >
          PROMO KOD:
        </label>
        <input
          id="promo-code"
          type="text"
          value={promoCode ?? ""}
          onChange={(e) => setPromoCode(e.target.value)}
          className={cn(
            "h-10 flex-1 min-w-[200px] rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
          )}
          placeholder="Unesite promo kod"
        />
      </div>

      <div className="rounded-2xl bg-[#65609d] px-4 py-4 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className={cn(anton.className, "text-lg")}>UKUPNO</span>
          <div className="text-right">
            <p className={cn(inter.className, "font-semibold")}>
              {formatRsd(subtotal)}
            </p>
            <p className={cn(inter.className, "text-sm opacity-90")}>
              + dostava {DELIVERY_COST_RSD} RSD
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          className="h-12 rounded-full px-10 text-base font-semibold"
          onClick={goToNextStep}
          disabled={
            !canProceedToStep2() || productsLoading || !allProductsLoaded
          }
        >
          NASTAVI
        </Button>
      </div>
    </div>
  );
}
