import Image from "next/image";
import * as LucideIcons from "lucide-react";

import { anton, inter } from "@/lib/fonts";
import type { LandingPage } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

type SocialPlatform = NonNullable<
  NonNullable<LandingPage["footer"]>["socialLinks"]
>[number]["platform"];

const FOOTER_LINKS: Array<{ label: string; href: `#${string}` }> = [
  { label: "Početna", href: "#pocetna" },
  { label: "Zadovoljni klijenti", href: "#zadovoljni-klijenti" },
  { label: "Kome je namenjen", href: "#kome-je-namenjen" },
  { label: "Protein", href: "#protein" },
  { label: "FAQ", href: "#faq" },
  { label: "Kontakt", href: "#kontakt" },
];

function getSocialIcon(platform: SocialPlatform | undefined) {
  const icons = LucideIcons as unknown as Record<string, unknown>;

  const iconNameByPlatform: Record<string, string> = {
    facebook: "Facebook",
    instagram: "Instagram",
    youtube: "Youtube",
    linkedin: "Linkedin",
    x: "Twitter",
    tiktok: "Tiktok",
  };

  const desired = platform ? iconNameByPlatform[platform] : undefined;
  const fallback =
    (icons.Link as unknown) ??
    (icons.LinkIcon as unknown) ??
    (icons.ExternalLink as unknown) ??
    (icons.ExternalLinkIcon as unknown);

  return (desired ? icons[desired] : undefined) ?? fallback;
}

export function SiteFooter({
  landingPage,
}: {
  landingPage: LandingPage | null;
}) {
  const socialLinks = landingPage?.footer?.socialLinks || [];
  const contact = landingPage?.footer?.contact;

  return (
    <footer id="kontakt" className="relative mt-24 bg-brand text-white">
      <div className="pointer-events-none absolute -top-36 right-0 z-10 w-[320px] sm:-top-48 sm:w-[420px] lg:-top-69 lg:w-[520px]">
        <Image
          src="/goat-milk-bottle-goat-white-background%201.png"
          alt=""
          aria-hidden
          width={1040}
          height={760}
          className="h-auto w-full"
          priority={false}
        />
      </div>

      <div className="mx-auto w-full max-w-[85%] px-6 pb-20 pt-14 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr_0.9fr] lg:items-start">
          <div className="space-y-6">
            <Image
              src="/Logo.png"
              alt="Urban Nutrition"
              width={220}
              height={70}
              className="h-auto w-[180px] sm:w-[220px]"
            />

            <p
              className={cn(
                inter.className,
                "max-w-sm text-[16px] leading-[24px] font-normal text-white/90",
              )}
            >
              Nova dimenzija prirodnog proteina
            </p>

            {socialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((item, idx) => {
                  const Icon = getSocialIcon(item.platform) as
                    | React.ComponentType<{ className?: string }>
                    | undefined;
                  return (
                    <a
                      key={`${item.platform ?? "social"}-${idx}`}
                      href={item.url || "#"}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/95 text-brand transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                      aria-label={item.platform || "social link"}
                    >
                      {Icon ? <Icon className="h-5 w-5" /> : null}
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="space-y-5">
            <div
              className={cn(
                anton.className,
                "text-[18px] leading-[18px] tracking-[-0.2px] font-normal text-white",
              )}
            >
              Korisni linkovi
            </div>
            <nav className="flex flex-col gap-3" aria-label="Footer">
              {FOOTER_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    inter.className,
                    "text-[14px] leading-[14px] tracking-[-0.2px] font-normal text-white/90 transition-opacity hover:opacity-80",
                  )}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-5">
            <div
              className={cn(
                anton.className,
                "text-[18px] leading-[18px] tracking-[-0.2px] font-normal text-white",
              )}
            >
              Kontaktirajte nas
            </div>

            <div className={cn(inter.className, "space-y-3 text-white/90")}>
              {contact?.phone ? (
                <a
                  href={`tel:${contact.phone}`}
                  className="block text-[14px] leading-[14px] tracking-[-0.2px] hover:opacity-80"
                >
                  {contact.phone}
                </a>
              ) : null}
              {contact?.email ? (
                <a
                  href={`mailto:${contact.email}`}
                  className="block text-[14px] leading-[14px] tracking-[-0.2px] hover:opacity-80"
                >
                  {contact.email}
                </a>
              ) : null}
              {contact?.location ? (
                <div className="text-[14px] leading-[14px] tracking-[-0.2px]">
                  {contact.location}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex items-start gap-6 lg:justify-end">
            <Image
              src="/Slika%20hero%202.png"
              alt="Certification badge"
              width={128}
              height={128}
              className="h-16 w-16 sm:h-20 sm:w-20"
            />
            <Image
              src="/brcs.png"
              alt="BRCS certified"
              width={128}
              height={128}
              className="h-auto w-[100px]"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
