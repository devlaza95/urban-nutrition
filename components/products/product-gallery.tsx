"use client";

import * as React from "react";
import Image from "next/image";
import { ZoomInIcon, ZoomOutIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { urlFor, type SanityImageSource } from "@/lib/sanity/image";

export function ProductGallery({
  images,
  productName,
}: {
  images: SanityImageSource[];
  productName: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [zoom, setZoom] = React.useState<number[]>([100]);

  const activeImage = images?.[activeIndex];

  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-3">
      <button
        type="button"
        className="group relative w-full overflow-hidden rounded-lg border bg-muted"
        onClick={() => {
          setOpen(true);
          setZoom([100]);
        }}
      >
        <Image
          src={urlFor(activeImage).width(1200).height(900).fit("crop").url()}
          alt={productName}
          width={1200}
          height={900}
          className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute right-2 top-2 rounded-md bg-background/80 px-2 py-1 text-xs text-foreground backdrop-blur">
          Click to zoom
        </div>
      </button>

      {images.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              className={cn(
                "shrink-0 overflow-hidden rounded-md border",
                idx === activeIndex ? "border-foreground" : "border-border",
              )}
              onClick={() => setActiveIndex(idx)}
            >
              <Image
                src={urlFor(img).width(200).height(200).fit("crop").url()}
                alt={`${productName} image ${idx + 1}`}
                width={200}
                height={200}
                className="size-16 object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>{productName}</DialogTitle>
          </DialogHeader>

          <div className="px-6 pb-6">
            <div className="relative overflow-hidden rounded-lg border bg-black">
              <div className="flex items-center justify-center">
                <div
                  className="origin-center"
                  style={{
                    transform: `scale(${(zoom?.[0] ?? 100) / 100})`,
                    transition: "transform 120ms ease-out",
                  }}
                >
                  <Image
                    src={urlFor(activeImage)
                      .width(1800)
                      .height(1350)
                      .fit("max")
                      .url()}
                    alt={productName}
                    width={1800}
                    height={1350}
                    className="max-h-[70vh] w-auto object-contain"
                    priority
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm text-muted-foreground">
                  Zoom: {Math.round(zoom?.[0] ?? 100)}%
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setZoom(([v]) => [Math.max(50, (v ?? 100) - 10)])
                    }
                  >
                    <ZoomOutIcon />
                    <span className="sr-only">Zoom out</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setZoom(([v]) => [Math.min(250, (v ?? 100) + 10)])
                    }
                  >
                    <ZoomInIcon />
                    <span className="sr-only">Zoom in</span>
                  </Button>
                </div>
              </div>

              <Slider
                value={zoom}
                min={50}
                max={250}
                step={1}
                onValueChange={setZoom}
              />

              {images.length > 1 ? (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={cn(
                        "shrink-0 overflow-hidden rounded-md border",
                        idx === activeIndex
                          ? "border-foreground"
                          : "border-border",
                      )}
                      onClick={() => {
                        setActiveIndex(idx);
                        setZoom([100]);
                      }}
                    >
                      <Image
                        src={urlFor(img)
                          .width(200)
                          .height(200)
                          .fit("crop")
                          .url()}
                        alt={`${productName} zoom image ${idx + 1}`}
                        width={200}
                        height={200}
                        className="size-16 object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
