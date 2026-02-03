import Image from "next/image";
import { ContactForm } from "@/components/forms/contact-form";
import { anton, inter } from "@/lib/fonts";
import { Toaster } from "@/components/ui/sonner";

export default function ContactPage() {
  return (
    <div className="min-h-[100dvh-40px] bg-background text-foreground">
      <main className="relative w-full bg-white">
        <div
          className="pointer-events-none absolute inset-0 select-none overflow-hidden opacity-[0.03]"
          aria-hidden
        >
          <Image
            src="/hero-background.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <section className="relative mx-auto w-full max-w-[95%] px-4 py-16 lg:max-w-[85%] lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h1
              className={`${anton.className} text-[28px] font-normal leading-tight tracking-normal md:text-[36px] lg:text-[46px] lg:leading-[83.72px]`}
            >
              Kontakt
            </h1>
            <p
              className={`${inter.className} mt-3 text-base font-normal leading-[100%] tracking-[-0.39px] text-muted-foreground lg:text-[18px]`}
            >
              Pošaljite nam poruku
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-2xl rounded-xl p-6 md:p-8">
            <ContactForm />
          </div>
        </section>
      </main>
      <Toaster richColors position="top-center" />
    </div>
  );
}
