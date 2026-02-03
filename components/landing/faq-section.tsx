import Image from "next/image";

import { PortableTextRenderer } from "@/components/portable-text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { anton, inter } from "@/lib/fonts";
import type { FaqItem } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

import handAndPowderSpoon from "@/public/hand and powder spoon.png";

function splitAlternating<T>(items: T[]) {
  const left: T[] = [];
  const right: T[] = [];
  items.forEach((item, idx) => (idx % 2 === 0 ? left : right).push(item));
  return { left, right };
}

function FaqAccordionColumn({
  items,
  columnId,
}: {
  items: FaqItem[];
  columnId: string;
}) {
  return (
    <Accordion type="multiple" className="space-y-5">
      {items.map((item) => {
        const value = `${columnId}-${item._id}`;
        return (
          <AccordionItem
            key={item._id}
            value={value}
            className="border-0 rounded-2xl bg-brand px-3 md:px-6"
          >
            <AccordionTrigger
              className={cn(
                inter.className,
                "items-center rounded-2xl px-2 py-3 md:py-6 text-[18px] font-medium text-white no-underline hover:no-underline",
                "[&>svg]:size-9 [&>svg]:rounded-full [&>svg]:bg-white [&>svg]:text-brand [&>svg]:p-2 [&>svg]:translate-y-0",
              )}
            >
              {item.title}
            </AccordionTrigger>
            <AccordionContent
              className={cn(
                inter.className,
                "px-2 pb-6 text-[18px] leading-[150%] font-normal text-white/95",
              )}
            >
              <PortableTextRenderer
                value={item.description}
                className="[&_p]:!m-0 [&_p]:!text-[18px] [&_p]:!leading-[150%] [&_p]:!text-white/95"
              />
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export function FaqSection({ items }: { items: FaqItem[] }) {
  if (!items || items.length === 0) return null;

  const { left, right } = splitAlternating(items);

  return (
    <section id="faq" className="relative scroll-mt-32 mt-32 pb-40">
      {/* decorative image leaking from the left */}
      <Image
        src={handAndPowderSpoon}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -left-0 -top-32 hidden h-auto w-[320px] md:block"
        priority={false}
      />

      <div className="mx-auto w-full max-w-[95%] lg:max-w-[85%] px-4">
        <h2
          className={cn(
            anton.className,
            "text-center text-[46px] leading-[63px] tracking-[0px] font-normal text-foreground",
          )}
        >
          Često postavljana pitanja
        </h2>
        <p
          className={cn(
            inter.className,
            "mx-auto mt-4 max-w-3xl text-center text-[16px] leading-[150%] tracking-[0px] font-normal text-foreground",
          )}
        >
          Pripremili smo odgovore na pitanja koja nam kupci najčešće
          postavljaju, kako biste brzo i lako pronašli sve potrebne informacije.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <FaqAccordionColumn items={left} columnId="left" />
          <FaqAccordionColumn items={right} columnId="right" />
        </div>
      </div>
    </section>
  );
}
