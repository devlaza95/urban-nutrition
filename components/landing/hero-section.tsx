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
    <section
      id="pocetna"
      className="relative isolate w-full overflow-hidden scroll-mt-32"
    >
      <div aria-hidden className="absolute inset-0 z-0">
        <Image
          src="/hero-background.png"
          alt=""
          fill
          sizes="100vw"
          className="object-fill opacity-10"
          priority
        />
        <div className="absolute inset-0 bg-background/60" />
      </div>

      <div className="mx-auto w-full max-w-[85%] px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div
            className={cn(
              "relative z-10 flex flex-col items-center space-y-5 pt-16 text-center",
              inter.className,
            )}
          >
            <h1
              className={cn(
                anton.className,
                "text-brand text-5xl leading-[1.14] tracking-[0.08em] uppercase sm:text-6xl lg:text-[100px] lg:tracking-[0.1495em]",
              )}
            >
              {landingPage?.hero?.headline || "Urban Nutrition"}
            </h1>

            <PortableTextRenderer
              value={landingPage?.hero?.subheading}
              className="max-w-xl space-y-3 text-base font-normal leading-7 lg:text-[18px] [&_p]:!text-foreground"
            />

            {landingPage?.nutritionInfo ? (
              <PortableTextRenderer
                value={landingPage.nutritionInfo}
                className="max-w-xl text-[14px] font-normal leading-7 [&_p]:!text-foreground"
              />
            ) : null}

            <Button
              asChild
              className="mt-2 h-12 rounded-full px-10 text-base font-semibold"
            >
              <a href="#protein">KUPI PROTEIN</a>
            </Button>

            {landingPage?.allergiesInfo ? (
              <PortableTextRenderer
                value={landingPage.allergiesInfo}
                className="max-w-xl text-[14px] font-normal leading-7 [&_p]:!text-foreground"
              />
            ) : null}
          </div>

          <div className={cn("relative z-10 space-y-4", inter.className)}>
            <div className="relative overflow-hidden rounded-3xl">
              <div className="relative aspect-[3/2] overflow-hidden rounded-3xl">
                {landingPage?.hero?.heroImage ? (
                  <Image
                    src={urlFor(landingPage.hero.heroImage)
                      .width(1800)
                      .height(1200)
                      .fit("clip")
                      .url()}
                    alt="Hero"
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

            <div className="space-y-2 text-base font-medium leading-none [&_p]:m-0 [&_p]:leading-none [&_p]:!text-foreground">
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
