"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { anton, inter } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export function OrderConfirmationStep() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-12">
      <div
        className="pointer-events-none absolute inset-0 select-none opacity-[0.04]"
        aria-hidden
      >
        <div
          className={cn(
            anton.className,
            "flex h-full w-full flex-wrap content-center justify-center gap-4 break-all text-6xl font-normal text-foreground",
          )}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i}>URBAN NUTRITION</span>
          ))}
        </div>
      </div>

      <div className="relative space-y-6 text-center">
        <p
          className={cn(
            inter.className,
            "text-base text-foreground md:text-lg",
          )}
        >
          Hvala vam na poverenju. Vaša porudžbina je uspešno primljena i
          trenutno je u obradi. Detalje kupovine poslali smo vam na email.
        </p>

        <h1
          className={cn(
            anton.className,
            "text-3xl font-normal text-[#65609d] md:text-4xl lg:text-5xl",
          )}
        >
          HVALA NA KUPOVINI!
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-8 pt-6">
          <div className="relative h-48 w-40 shrink-0 md:h-56 md:w-48">
            <Image
              src="/powder and spoon.png"
              alt=""
              fill
              className="object-contain"
              sizes="(max-width: 768px) 160px, 192px"
            />
          </div>
          <div className="relative h-48 w-40 shrink-0 md:h-56 md:w-48">
            <Image
              src="/goat-milk-bottle-goat-white-background 1.png"
              alt=""
              fill
              className="object-contain"
              sizes="(max-width: 768px) 160px, 192px"
            />
          </div>
        </div>

        <div className="pt-6">
          <Button
            asChild
            className="h-12 rounded-full px-10 text-base font-semibold"
          >
            <Link href="/">Nazad na početnu</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
