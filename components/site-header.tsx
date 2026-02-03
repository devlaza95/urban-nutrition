"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Početna", href: "#pocetna" },
  { label: "Zadovoljni klijenti", href: "#zadovoljni-klijenti" },
  { label: "Protein", href: "#protein" },
  { label: "Kome je namenjen", href: "#kome-je-namenjen" },
  { label: "FAQ", href: "#faq" },
  { label: "Kontakt", href: "/contact" },
];

/** Hash links live on home; from other pages navigate to /#section so the section is reachable. */
function resolveNavHref(href: string): string {
  return href.startsWith("#") ? `/${href}` : href;
}

const linkClass =
  "rounded-md px-2 py-2 text-base font-medium text-foreground transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";
const mobileLinkClass =
  "rounded-md px-3 py-2 text-base font-medium text-foreground/90 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

export function SiteHeader({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);

  return (
    <header className={cn("sticky top-0 z-50 w-full bg-background", className)}>
      <div className="mx-auto flex h-24 w-full max-w-[95%] lg:max-w-[85%] items-center justify-between gap-6 px-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          aria-label="Urban Nutrition - Početna"
        >
          <Image
            src="/Logo%20crni.png"
            alt="Urban Nutrition"
            width={180}
            height={44}
            priority
            className="h-10 w-auto md:h-12"
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={resolveNavHref(item.href)}
              className={linkClass}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            className="inline-flex h-12 rounded-full px-8 text-base font-semibold"
          >
            <Link href="/#protein">KUPI PROTEIN</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <MenuIcon className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0">
              <div className="flex h-full flex-col p-6">
                <div className="flex items-center justify-between gap-4">
                  <Link
                    href="/"
                    className="flex items-center gap-3 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    aria-label="Urban Nutrition - Početna"
                    onClick={() => setOpen(false)}
                  >
                    <Image
                      src="/Logo%20crni.png"
                      alt="Urban Nutrition"
                      width={180}
                      height={44}
                      className="h-8 w-auto"
                    />
                  </Link>
                </div>

                <div className="mt-8 flex flex-col gap-1">
                  {NAV_ITEMS.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={resolveNavHref(item.href)}
                        className={mobileLinkClass}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </div>

                <div className="mt-auto pt-6">
                  <SheetClose asChild>
                    <Button
                      asChild
                      className="h-12 w-full rounded-full text-base font-semibold"
                    >
                      <Link href="/#protein">KUPI PROTEIN</Link>
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
