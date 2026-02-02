import Image, { type StaticImageData } from "next/image";

import { anton, inter } from "@/lib/fonts";
import { cn } from "@/lib/utils";

import goatImage from "@/public/mil 3d.png";
import vitaminAbsorptionIcon from "@/public/vitamin absorption.png";
import lowerAllergyRiskIcon from "@/public/lower allergy risk.png";
import nutritiousIcon from "@/public/nutritious.png";

type Benefit = {
  icon: StaticImageData;
  label: string;
};

const benefits: Benefit[] = [
  { icon: vitaminAbsorptionIcon, label: "Bolja apsorpcija vitamina" },
  { icon: lowerAllergyRiskIcon, label: "Manji rizik od alergije" },
  { icon: nutritiousIcon, label: "Bogat hranjivim materijama" },
];

function BenefitItem({ icon, label }: Benefit) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <Image
        src={icon}
        alt=""
        aria-hidden
        className="h-14 w-14 md:h-16 md:w-16"
      />
      <p
        className={cn(
          inter.className,
          "text-[20px] leading-[40px] tracking-[0px] font-semibold text-foreground",
        )}
      >
        {label}
      </p>
    </div>
  );
}

export function BenefitsStrip() {
  return (
    <section aria-label="Benefits strip" className="mt-28">
      <div className="mx-auto w-full max-w-[85%] px-6">
        <h2
          className={cn(
            anton.className,
            "text-center text-[36px] leading-[28px] tracking-[12px] font-normal uppercase text-foreground",
          )}
        >
          NOVA DIMENZIJA PRIRODNOG PROTEINA
        </h2>
      </div>

      <div className="relative left-1/2 mt-6 w-screen -translate-x-1/2 bg-[#DAD7FF]">
        <Image
          src={goatImage}
          alt=""
          aria-hidden
          priority
          className="pointer-events-none absolute bottom-0 -left-10 h-auto w-[180px] lg:w-[380px] lg:-translate-x-16"
        />

        <div className="mx-auto w-full max-w-[85%] px-6 py-10 pl-[110px] sm:pl-[220px] md:pl-[260px] lg:pl-[320px]">
          <div className="grid gap-10 sm:grid-cols-3 sm:gap-6 md:gap-10">
            {benefits.map((benefit) => (
              <BenefitItem key={benefit.label} {...benefit} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
