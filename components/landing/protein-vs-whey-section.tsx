import Image from "next/image";

import { Button } from "@/components/ui/button";
import { anton, inter } from "@/lib/fonts";
import { cn } from "@/lib/utils";

import backgroundAbstract from "@/public/background abstract.png";
import powderAndSpoon from "@/public/powder and spoon.png";
import proteinGym from "@/public/protein-gym 1.png";

type ComparisonRow = {
  label: string;
  goat: string;
  whey: string;
};

const rows: ComparisonRow[] = [
  {
    label: "IZVOR PROTEINA:",
    goat: "100% KOZJE MLEKO",
    whey: "surutka iz kravljeg mleka",
  },
  {
    label: "SASTAV I DODACI:",
    goat: "fokus na jednostavnoj deklaraciji (bez dodatog šećera, zaslađeno stevijom)",
    whey: "zavisi od brenda (često više aroma, zaslađivača i dodataka)",
  },
  {
    label: "UKUS:",
    goat: "blag, prirodniji profil ukusa",
    whey: "često jače aromatizovan i “sladak” profil",
  },
  {
    label: "RUTINA U DANU:",
    goat: "odličan kao dnevni protein (shake, kaša, smuti)",
    whey: "često biran posle treninga, ali koristi se i tokom dana",
  },
  {
    label: "LAKTOZA / ALERGENI:",
    goat: "sadrži laktozu (alergen: mleko)",
    whey: "najčešće sadrži laktozu (alergen: mleko) — nivo zavisi od tipa i brenda",
  },
  {
    label: "ZA KOGA JE KOJI IZBOR:",
    goat: "ako želiš premium alternativu, blaži ukus i “clean label” osećaj",
    whey: "ako želiš klasičan, široko dostupan proteinski izbor",
  },
];

function rowShapeClasses(idx: number, total: number) {
  const isFirst = idx === 0;
  const isLast = idx === total - 1;
  return cn(
    isFirst && "rounded-t-2xl",
    isLast && "rounded-b-2xl",
    !isLast && "border-b",
  );
}

export function ProteinVsWheySection() {
  return (
    <section className="relative overflow-hidden bg-background py-32">
      {/* background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src={backgroundAbstract}
          alt=""
          fill
          sizes="100vw"
          className="object-fill opacity-80"
          priority={false}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[95%] lg:max-w-[85%] px-4">
        <h2
          className={cn(
            anton.className,
            "text-center text-[32px] leading-[38px] md:text-[38px] md:leading-[44px] lg:text-[46px] lg:leading-[83.72px] tracking-[0px] font-normal text-foreground",
          )}
        >
          Goat Power Protein vs Whey — u čemu je razlika?
        </h2>

        <p
          className={cn(
            inter.className,
            "mt-4 text-center text-[16px] leading-[100%] md:text-[17px] lg:text-[18px] tracking-[0px] font-normal text-foreground",
          )}
        >
          Nije poenta da je jedno “bolje”. Poenta je da izabereš protein koji ti
          najviše prija i uklapa se u tvoju rutinu.
        </p>

        <div className="relative mt-10">
          {/* decorative overlays */}
          <Image
            src={powderAndSpoon}
            alt=""
            aria-hidden
            className="md:z-20 pointer-events-none absolute -left-54 top-32 md:left-14 md:-top-24 h-auto md:w-64 lg:w-[360px]"
          />
          <Image
            src={proteinGym}
            alt=""
            aria-hidden
            className="z-0 md:z-20 pointer-events-none absolute -right-32 -top-24 md:-right-54 h-auto md:w-64 lg:w-[360px]"
          />

          {/* Desktop/tablet grid */}
          <div className="hidden relative lg:grid lg:grid-cols-[240px_1fr_1fr] lg:gap-x-10 z-10">
            <div />

            <div
              className={cn(
                anton.className,
                "text-center text-[32px] leading-[83px] tracking-[0px] font-normal text-foreground",
              )}
            >
              GOAT POWER
            </div>
            <div
              className={cn(
                anton.className,
                "text-center text-[32px] leading-[83px] tracking-[0px] font-normal text-foreground",
              )}
            >
              WHEY
            </div>

            {rows.map((row, idx) => (
              <div key={row.label} className="contents">
                <div
                  className={cn(
                    anton.className,
                    "flex h-[83px] w-full text-center items-center pr-4 text-[18px] leading-[83px] tracking-[0px] font-normal text-foreground",
                  )}
                >
                  {row.label}
                </div>

                <div
                  className={cn(
                    anton.className,
                    "flex h-[83px] items-center justify-center px-6 text-center text-[16px] leading-[23px] tracking-[0px] font-normal",
                    "bg-[#65609d] text-white border-white/20",
                    rowShapeClasses(idx, rows.length),
                  )}
                >
                  {row.goat}
                </div>

                <div
                  className={cn(
                    anton.className,
                    "flex h-[83px] items-center justify-center px-6 text-center text-[16px] leading-[23px] tracking-[0px] font-normal",
                    "bg-[#dad7ff] text-foreground border-foreground/15",
                    rowShapeClasses(idx, rows.length),
                  )}
                >
                  {row.whey}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile layout */}
          <div className="space-y-5 relative lg:hidden z-10">
            <div className="grid grid-cols-2 gap-4">
              <div
                className={cn(
                  anton.className,
                  "text-center text-[22px] leading-[28px] font-normal text-foreground",
                )}
              >
                GOAT POWER
              </div>
              <div
                className={cn(
                  anton.className,
                  "text-center text-[22px] leading-[28px] font-normal text-foreground",
                )}
              >
                WHEY
              </div>
            </div>

            {rows.map((row) => (
              <div key={row.label} className="space-y-2 w-full">
                <div
                  className={cn(
                    inter.className,
                    "text-[14px] font-bold text-center text-foreground",
                  )}
                >
                  {row.label}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={cn(
                      anton.className,
                      "rounded-xl bg-[#65609d] px-4 py-4 text-center text-[16px] leading-[23px] tracking-[0px] font-normal text-white",
                    )}
                  >
                    {row.goat}
                  </div>
                  <div
                    className={cn(
                      anton.className,
                      "rounded-xl bg-[#dad7ff] px-4 py-4 text-center text-[16px] leading-[23px] tracking-[0px] font-normal text-foreground",
                    )}
                  >
                    {row.whey}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA + disclaimer */}
          <div className="mt-10 grid gap-8 relative lg:grid-cols-2 lg:items-end z-10">
            <div className="space-y-4">
              <div
                className={cn(
                  inter.className,
                  "text-[20px] leading-[1.2] font-semibold text-foreground",
                )}
              >
                Spreman da probaš premium kozji protein?
              </div>
              <Button className="h-12 rounded-full px-10 text-base font-semibold">
                KUPI PROTEIN
              </Button>
            </div>

            <div
              className={cn(
                inter.className,
                "text-right text-[14px] leading-[1.3] font-normal text-foreground/80 self-start mt-2",
              )}
            >
              Oba proizvoda su iz mleka i sadrže alergene. Individualna
              tolerancija može da varira.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
