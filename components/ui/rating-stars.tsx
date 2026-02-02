"use client";

import * as React from "react";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  className,
  starClassName,
  max = 5,
  size = 16,
}: {
  rating?: number;
  className?: string;
  starClassName?: string;
  max?: number;
  size?: number;
}) {
  const r = Math.max(0, Math.min(max, Math.round(rating ?? 0)));

  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      aria-label={`Rating ${r} out of ${max}`}
    >
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < r;
        return (
          <Star
            key={i}
            className={cn(
              "shrink-0",
              filled ? "fill-brand text-brand" : "text-brand/40",
              starClassName,
            )}
            style={{ width: size, height: size }}
            aria-hidden
          />
        );
      })}
    </div>
  );
}
