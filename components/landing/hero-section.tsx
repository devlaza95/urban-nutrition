import Image from "next/image";

import { PortableTextRenderer } from "@/components/portable-text";
import { Button } from "@/components/ui/button";
import { anton, inter } from "@/lib/fonts";
import { urlFor } from "@/lib/sanity/image";
import type { LandingPage } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

export function HeroSection({
  landingPage,
}: {
  landingPage: LandingPage | null;
}) {
  return (
    <section id="pocetna" className="relative isolate w-full scroll-mt-32">
      <div aria-hidden className="absolute inset-0 z-0">
        <Image
          src="/hero-background.png"
          alt=""
          fill
          sizes="100vw"
          className="object-contain object-top md:object-cover opacity-10"
          priority
        />
        <div className="absolute inset-0 bg-background/60" />
      </div>

      <div className="mx-auto w-full max-w-[95%] lg:max-w-[85%] px-4">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div
            className={cn(
              "relative z-10 flex flex-col items-center space-y-5 pt-4 md:pt-16 text-center",
              inter.className,
            )}
          >
            <h1
              className={cn(
                anton.className,
                "text-brand text-[59.87px] leading-[68.25px] tracking-[14px] text-center uppercase lg:text-[90px] lg:leading-[1.14] lg:tracking-[0.1495em]",
              )}
            >
              {landingPage?.hero?.headline || "Urban Nutrition"}
            </h1>

            <PortableTextRenderer
              value={landingPage?.hero?.subheading}
              className={cn(
                inter.className,
                "max-w-xl space-y-3 text-[16px] leading-[16px] text-center lg:text-[18px] lg:leading-[28px] [&_p]:!text-foreground",
              )}
            />

            {landingPage?.nutritionInfo ? (
              <PortableTextRenderer
                value={landingPage.nutritionInfo}
                className="max-w-xs text-[16px] leading-[16px] text-center lg:leading-[28px] [&_p]:!text-foreground [&_p]:text-center"
              />
            ) : null}

            <Button
              asChild
              className="mt-2 hidden h-12 rounded-full px-10 text-base font-semibold lg:inline-flex"
            >
              <a href="#protein">KUPI PROTEIN</a>
            </Button>
          </div>

          <div
            className={cn("relative z-10 flex flex-col gap-4", inter.className)}
          >
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl">
                <div className="relative aspect-[3/2] overflow-hidden rounded-3xl">
                  {landingPage?.hero?.heroImage ? (
                    <Image
                      src={urlFor(landingPage.hero.heroImage)
                        .width(1800)
                        .height(1200)
                        .fit("max")
                        .url()}
                      alt={
                        (landingPage.hero.heroImage as { alt?: string })?.alt ||
                        "Prirodni proteinski napitak Urban Nutrition"
                      }
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover object-center"
                      priority
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      Add a hero image in the CMS
                    </div>
                  )}
                </div>
              </div>
              <Image
                src="/Slika hero 2.png"
                alt="Hero"
                width={150}
                height={150}
                className="absolute -bottom-8 -right-2 size-20 object-contain object-center md:-bottom-14 md:-right-14 md:size-auto"
                priority
              />
            </div>

            <div className="order-2 lg:hidden">
              <Button
                asChild
                className="h-12 w-full rounded-full text-base font-semibold"
              >
                <a href="#protein">KUPI PROTEIN</a>
              </Button>
            </div>

            <div className="order-1 space-y-2 text-xs font-medium leading-none lg:order-2 lg:text-base [&_p]:m-0 [&_p]:leading-none [&_p]:!text-foreground">
              {landingPage?.deliveryInfo ? (
                <PortableTextRenderer
                  value={landingPage.deliveryInfo}
                  className="space-y-2"
                />
              ) : null}
              {landingPage?.returnsInfo ? (
                <PortableTextRenderer
                  value={landingPage.returnsInfo}
                  className="space-y-2"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
