"use client";

import * as React from "react";
import Image from "next/image";
import { PortableText } from "next-sanity";

import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { anton, inter } from "@/lib/fonts";
import { urlFor } from "@/lib/sanity/image";
import type { WhoIsItForItem } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

export function WhoIsItForSection({ items }: { items: WhoIsItForItem[] }) {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const pausedRef = React.useRef(false);

  React.useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  React.useEffect(() => {
    if (!api) return;
    if (paused) return;

    const id = window.setInterval(() => {
      if (document.visibilityState === "hidden") return;
      if (pausedRef.current) return;
      api.scrollNext();
    }, 3500);

    return () => window.clearInterval(id);
  }, [api, paused]);

  React.useEffect(() => {
    if (!dragging) return;
    const onUp = () => {
      setDragging(false);
      setPaused(hovered);
    };
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging, hovered]);

  if (!items || items.length === 0) return null;

  return (
    <section id="kome-je-namenjen" className="scroll-mt-24 mt-20 pt-20">
      <div className="mx-auto w-full max-w-[85%] px-6">
        <h2
          className={cn(
            anton.className,
            "text-center text-[46px] leading-[63px] tracking-[0px] font-normal text-foreground",
          )}
        >
          Kome je namenjen?
        </h2>
        <p
          className={cn(
            inter.className,
            "mt-4 text-center text-[16px] leading-[150%] tracking-[0px] font-normal text-foreground",
          )}
        >
          Za sve koji žele kvalitetan protein kao deo uravnotežene ishrane, bez
          komplikacija.
        </p>
      </div>

      <div className="mt-10">
        <div className="mx-auto w-full max-w-[85%] px-6">
          <Carousel
            setApi={setApi}
            opts={{ align: "start", loop: true, dragFree: true }}
            className={cn(dragging ? "cursor-grabbing" : "cursor-grab")}
            onPointerDown={() => {
              setDragging(true);
              setPaused(true);
            }}
            onMouseEnter={() => {
              setHovered(true);
              setPaused(true);
            }}
            onMouseLeave={() => {
              setHovered(false);
              setPaused(false);
            }}
          >
            <CarouselContent className="-ml-6 pb-6">
              {items.map((item) => {
                const order =
                  typeof item.order === "number"
                    ? String(item.order).padStart(2, "0")
                    : undefined;

                return (
                  <CarouselItem
                    key={item._id}
                    className="pl-6 basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <div className="h-full">
                      <div className="h-full overflow-hidden rounded-3xl bg-background shadow-md">
                        <div className="relative h-44 w-full bg-muted">
                          {item.image ? (
                            <Image
                              src={urlFor(item.image)
                                .width(800)
                                .height(520)
                                .fit("crop")
                                .url()}
                              alt={
                                (item.image as unknown as { alt?: string })
                                  ?.alt ||
                                item.title ||
                                "Card image"
                              }
                              fill
                              sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 85vw"
                              className="object-cover"
                            />
                          ) : null}
                        </div>

                        <div className="p-6">
                          {order ? (
                            <div
                              className={cn(
                                inter.className,
                                "text-brand text-[18px] leading-[150%] font-semibold",
                              )}
                            >
                              {order}
                            </div>
                          ) : null}

                          <div
                            className={cn(
                              inter.className,
                              "mt-1 text-[18px] leading-[150%] font-semibold text-brand",
                            )}
                          >
                            {item.title}
                          </div>

                          <div
                            className={cn(
                              inter.className,
                              "mt-4 text-[14px] leading-[150%] font-normal text-foreground/80",
                              "[&_p]:!m-0 [&_p]:!text-[14px] [&_p]:!leading-[150%] [&_p]:!text-foreground/80",
                            )}
                          >
                            <PortableText
                              value={item.description as never}
                              components={{
                                block: {
                                  normal: ({ children }) => <p>{children}</p>,
                                },
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
