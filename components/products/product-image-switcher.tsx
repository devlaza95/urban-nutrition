"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { urlFor, type SanityImageSource } from "@/lib/sanity/image";

function getAlt(img: SanityImageSource, fallback: string) {
  const anyImg = img as unknown as { alt?: string; caption?: string };
  return anyImg?.alt || anyImg?.caption || fallback;
}

export function ProductImageSwitcher({
  images,
  productName,
  className,
}: {
  images?: SanityImageSource[];
  productName: string;
  className?: string;
}) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const safeImages = images ?? [];
  const activeImage = safeImages[activeIndex];

  if (safeImages.length === 0) {
    return (
      <div
        className={cn(
          "flex aspect-[4/3] w-full items-center justify-center rounded-3xl bg-muted text-sm text-muted-foreground",
          className,
        )}
      >
        Add product images in the CMS
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative overflow-hidden rounded-3xl bg-muted">
        <div className="relative aspect-[3/3] md:aspect-[4/3] w-full">
          <Image
            src={urlFor(activeImage).width(1400).height(1050).fit("crop").url()}
            alt={getAlt(activeImage, productName)}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
            priority={false}
          />
        </div>
      </div>

      {safeImages.length > 1 ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {safeImages.map((img, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "shrink-0 overflow-hidden rounded-lg border bg-background focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                  isActive ? "border-foreground" : "border-border",
                )}
                aria-label={`Select image ${idx + 1}`}
              >
                <Image
                  src={urlFor(img).width(240).height(240).fit("crop").url()}
                  alt={getAlt(img, `${productName} thumbnail ${idx + 1}`)}
                  width={240}
                  height={240}
                  className="h-16 w-16 object-cover"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
