"use client";

import * as React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { PortableText } from "next-sanity";

import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { anton, inter } from "@/lib/fonts";
import { urlFor } from "@/lib/sanity/image";
import type { Testimonial } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

function Stars({ rating }: { rating?: number }) {
  const r = Math.max(0, Math.min(5, Math.round(rating ?? 0)));
  return (
    <div className="inline-flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < r;
        return (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              filled ? "fill-brand text-brand" : "text-brand/40",
            )}
          />
        );
      })}
    </div>
  );
}

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [snapCount, setSnapCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    const update = () => setSelectedIndex(api.selectedScrollSnap());
    setSnapCount(api.scrollSnapList().length);
    update();
    api.on("select", update);
    api.on("reInit", () => {
      setSnapCount(api.scrollSnapList().length);
      update();
    });
    return () => {
      api.off("select", update);
    };
  }, [api]);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="zadovoljni-klijenti" className="scroll-mt-24 mt-20 pt-20">
      <div className="mx-auto w-full max-w-[95%] lg:max-w-[85%] px-4">
        <h2
          className={cn(
            anton.className,
            "text-center text-[46px] leading-[83px] tracking-[0px] font-normal text-foreground",
          )}
        >
          Zadovoljni klijenti
        </h2>
      </div>

      <div className="mt-10">
        <div className="mx-auto w-full max-w-[95%] lg:max-w-[85%] px-4">
          <Carousel setApi={setApi} opts={{ align: "start", loop: true }}>
            <CarouselContent className="-ml-6 pb-6 h-full">
              {testimonials.map((t) => (
                <CarouselItem
                  key={t._id}
                  className="pl-6 basis-full sm:basis-1/2 lg:basis-1/3 2xl:basis-1/4"
                >
                  <div className="relative h-full">
                    <div className="rounded-3xl shadow-sm h-full">
                      <div className="rounded-t-3xl bg-[#F4F4F4] px-6 pt-6 pb-10">
                        <div className="flex items-start gap-5">
                          <div className="relative h-24 w-24 overflow-hidden rounded-3xl bg-muted sm:h-28 sm:w-28">
                            {t.image ? (
                              <Image
                                src={urlFor(t.image)
                                  .width(240)
                                  .height(240)
                                  .url()}
                                alt={t.name || "Customer"}
                                fill
                                sizes="112px"
                                className="object-cover object-top"
                              />
                            ) : null}
                          </div>

                          <div className="min-w-0 pt-1">
                            <div
                              className={cn(
                                anton.className,
                                "text-[18px] leading-[18px] font-normal text-foreground",
                              )}
                            >
                              {t.name}
                            </div>
                            <div
                              className={cn(
                                inter.className,
                                "mt-2 text-[14px] leading-[14px] font-normal text-muted-foreground",
                              )}
                            >
                              {typeof t.age === "number"
                                ? `${t.age} godina`
                                : null}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-background px-10 py-4 shadow-md">
                          <Stars rating={t.rating} />
                        </div>

                        <div className="rounded-b-3xl bg-background px-6 pt-12 pb-8 text-center">
                          <div
                            className={cn(
                              inter.className,
                              "text-[16px] leading-[16px] tracking-[0px] font-normal text-foreground",
                              "[&_p]:!m-0 [&_p]:!text-[16px] [&_p]:!leading-[16px] [&_p]:!text-foreground",
                            )}
                          >
                            <PortableText
                              value={t.description as never}
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
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {snapCount > 1 ? (
            <div className="mt-8 flex items-center justify-center gap-3">
              {Array.from({ length: snapCount }).map((_, i) => {
                const active = i === selectedIndex;
                return (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    className={cn(
                      "h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                      active
                        ? "w-14 bg-brand"
                        : "w-10 bg-brand/30 hover:bg-brand/40",
                    )}
                    onClick={() => api?.scrollTo(i)}
                  />
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
