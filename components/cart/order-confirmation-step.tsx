"use client";

import Image from "next/image";
import { anton, inter } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export function OrderConfirmationStep() {
  return (
    <div className="relative overflow-hidden p-8 md:p-12">
      <div className="relative z-10 space-y-6 text-center">
        <p
          className={cn(
            inter.className,
            "text-center text-base font-normal leading-[1.5] text-foreground",
          )}
        >
          Hvala vam na poverenju. Vaša porudžbina je uspešno primljena i
          trenutno je u obradi. Detalje kupovine poslali smo vam na email.
        </p>

        <h1
          className={cn(
            anton.className,
            "whitespace-nowrap text-center text-[#65609d] font-normal uppercase align-middle tracking-[14.95px]",
          )}
          style={{
            fontSize: "clamp(2.5rem, 50vw, 100px)",
            lineHeight: "1.14",
          }}
        >
          HVALA NA KUPOVINI!
        </h1>

        <div className="flex items-center justify-center -mt-32">
          <div className="relative h-[min(58vh,480px)] w-[min(92vw,420px)] shrink-0 md:h-[min(62vh,560px)] md:w-[min(82vw,500px)]">
            <Image
              src="/powder and spoon.png"
              alt=""
              width={1200}
              height={1000}
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
