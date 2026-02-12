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
    <div className="flex flex-col items-center gap-1 text-center md:gap-3">
      <Image
        src={icon}
        alt=""
        aria-hidden
        className="h-10 w-10 md:h-14 md:w-14 lg:h-16 lg:w-16"
      />
      <p
        className={cn(
          inter.className,
          "text-[10px] leading-[14.3px] font-semibold tracking-[0px] text-center text-foreground md:text-[20px] md:leading-[40px]",
        )}
      >
        {label}
      </p>
    </div>
  );
}

export function BenefitsStrip() {
  return (
    <section aria-label="Benefits strip" className="mt-16 md:mt-30">
      <div className="mx-auto w-full max-w-[95%] lg:max-w-[85%] px-4">
        <h2
          className={cn(
            anton.className,
            "text-center text-[24px] leading-[32px] tracking-[8px] font-normal uppercase text-foreground md:text-[36px] md:leading-[28px] md:tracking-[12px]",
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
          className="pointer-events-none absolute -bottom-44 md:-bottom-20 -left-18 md:-left-30 h-auto w-[280px] lg:w-[480px] z-0"
        />

        <div className="mx-auto w-full max-w-[95%] lg:max-w-[85%] px-4 py-6 pl-0 md:py-10 md:pl-[260px] lg:pl-[320px]">
          <div className="grid grid-cols-3 gap-4 md:gap-6 lg:gap-10">
            {benefits.map((benefit) => (
              <BenefitItem key={benefit.label} {...benefit} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
