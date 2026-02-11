"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "@/lib/cart/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { anton, inter } from "@/lib/fonts";
import { urlFor } from "@/lib/sanity/image";
import type { Product } from "@/lib/sanity/types";
import { submitOrder } from "@/app/cart/actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

function formatRsd(price: number) {
  return `${price.toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 0 })} RSD`;
}

function getProductWeight(product: Product): string {
  if (
    product.shortDescription &&
    typeof product.shortDescription === "string"
  ) {
    const match = product.shortDescription.match(/\d+\s*g/);
    if (match) return match[0];
  }
  return "500g";
}

const checkoutSchema = z.object({
  ime: z.string().min(1, "Ime je obavezno"),
  prezime: z.string().min(1, "Prezime je obavezno"),
  ulicaIBroj: z.string().min(1, "Ulica i broj su obavezni"),
  postanskiBroj: z.string().min(1, "Poštanski broj je obavezan"),
  grad: z.string().min(1, "Grad je obavezan"),
  drzava: z.string().min(1, "Država je obavezna"),
  email: z.string().email("Unesite ispravnu email adresu"),
  telefon: z.string().min(1, "Telefon je obavezan"),
  paymentMethod: z.enum(["Po preuzimanju", "Platna kartica"]),
  napomena: z.string().optional(),
});

type FormValues = z.infer<typeof checkoutSchema>;

type CheckoutFormStepProps = {
  productsMap: Map<string, Product>;
};

export function CheckoutFormStep({ productsMap }: CheckoutFormStepProps) {
  const {
    items,
    formData,
    setFormData,
    completeOrderAndShowConfirmation,
    updateItemQuantity,
    goToPrevStep,
  } = useCart();

  const [isPending, setIsPending] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      ime: formData?.ime ?? "",
      prezime: formData?.prezime ?? "",
      ulicaIBroj: formData?.ulicaIBroj ?? "",
      postanskiBroj: formData?.postanskiBroj ?? "",
      grad: formData?.grad ?? "",
      drzava: formData?.drzava ?? "Srbija",
      email: formData?.email ?? "",
      telefon: formData?.telefon ?? "",
      paymentMethod: (formData?.paymentMethod ??
        "Po preuzimanju") as FormValues["paymentMethod"],
      napomena: formData?.napomena ?? "",
    },
  });

  useEffect(() => {
    const sub = form.watch((values) => {
      setFormData({
        ime: values.ime,
        prezime: values.prezime,
        ulicaIBroj: values.ulicaIBroj,
        postanskiBroj: values.postanskiBroj,
        grad: values.grad,
        drzava: values.drzava,
        email: values.email,
        telefon: values.telefon,
        paymentMethod: values.paymentMethod,
        napomena: values.napomena,
      });
    });
    return () => sub.unsubscribe();
  }, [form, setFormData]);

  const onSubmit = async (data: FormValues) => {
    setIsPending(true);
    try {
      const orderItems = items.map((item) => {
        const product = productsMap.get(item.productId);
        return {
          productId: item.productId,
          quantity: item.quantity,
          name: product?.name,
          price: product?.price,
        };
      });

      const result = await submitOrder({
        items: orderItems,
        formData: {
          ...data,
          paymentMethod: data.paymentMethod,
        },
      });

      if (result.success) {
        completeOrderAndShowConfirmation();
      } else {
        toast.error(result.error);
      }
    } finally {
      setIsPending(false);
    }
  };

  if (items.length === 0) {
    return (
      <div
        className={cn(
          inter.className,
          "rounded-2xl bg-secondary/50 p-8 text-center text-muted-foreground",
        )}
      >
        Korpa je prazna. Vratite se na korpu i dodajte proizvod.
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <div className="overflow-hidden border border-border bg-card">
        <div className="bg-[#65609d] px-4 py-3 text-white">
          <div className="hidden grid-cols-12 gap-4 md:grid">
            <div className="col-span-5">
              <span className={cn(anton.className, "text-sm font-normal")}>
                Naziv proizvoda
              </span>
            </div>
            <div className="col-span-2 text-center">
              <span className={cn(anton.className, "text-sm font-normal")}>
                Količina
              </span>
            </div>
            <div className="col-span-2 text-center">
              <span className={cn(anton.className, "text-sm font-normal")}>
                Cena/kom
              </span>
            </div>
            <div className="col-span-3 text-right">
              <span className={cn(anton.className, "text-sm font-normal")}>
                Ukupno za plaćanje
              </span>
            </div>
          </div>
        </div>
        <div className="divide-y divide-border">
          {items.map((item) => {
            const product = productsMap.get(item.productId);
            if (!product) return null;
            const price = product.price ?? 0;
            const total = price * item.quantity;
            const image = product.images?.[0];
            return (
              <div
                key={item.productId}
                className="grid grid-cols-1 items-start gap-4 px-4 py-4 md:grid-cols-12 md:items-center"
              >
                <div className="flex items-center gap-4 md:col-span-5">
                  {image ? (
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={urlFor(image).width(80).height(80).url()}
                        alt={product.name ?? "Product"}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  ) : null}
                  <div>
                    <p
                      className={cn(
                        inter.className,
                        "font-medium text-foreground",
                      )}
                    >
                      {product.name}
                    </p>
                    <p
                      className={cn(
                        inter.className,
                        "text-sm text-muted-foreground",
                      )}
                    >
                      {getProductWeight(product)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-start gap-2 md:col-span-2 md:justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full border-brand/30 bg-secondary/50"
                    onClick={() =>
                      updateItemQuantity(
                        item.productId,
                        Math.max(1, item.quantity - 1),
                      )
                    }
                  >
                    −
                  </Button>
                  <span
                    className={cn(
                      inter.className,
                      "min-w-[2ch] text-center font-medium",
                    )}
                  >
                    {item.quantity}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full border-brand/30 bg-secondary/50"
                    onClick={() =>
                      updateItemQuantity(item.productId, item.quantity + 1)
                    }
                  >
                    +
                  </Button>
                </div>
                <div className="text-left md:col-span-2 md:text-center">
                  <span className={cn(inter.className, "text-foreground")}>
                    {formatRsd(price)}
                  </span>
                </div>
                <div className="text-right md:col-span-3">
                  <span
                    className={cn(
                      inter.className,
                      "font-medium text-foreground",
                    )}
                  >
                    {formatRsd(total)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 bg-[#E9E9E9] px-5 py-6"
        >
          {/* Two-column layout: section title left, content right (per PDF design) */}
          <p className="leading-7 text-primary">
            Za 3+ poručenih proizvoda poštarina je besplatna!
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,max-content)_1fr] md:gap-8 md:items-start">
            <h3
              className={cn(
                anton.className,
                "text-lg font-semibold uppercase text-foreground pt-1",
              )}
            >
              PRIMALAC RAČUNA
            </h3>
            <div className="border border-border w-full bg-[#DCD8FE] p-5 space-y-4">
              <FormField
                control={form.control}
                name="ime"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-6 md:justify-between gap-4 md:gap-0">
                    <FormLabel className={cn(inter.className)}>Ime:</FormLabel>
                    <FormControl className="col-span-5">
                      <Input
                        {...field}
                        placeholder="Ime *"
                        disabled={isPending}
                        className="bg-background border-none"
                      />
                    </FormControl>
                    <FormMessage className="col-span-6" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prezime"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-6 md:justify-between gap-4 md:gap-0">
                    <FormLabel className={cn(inter.className)}>
                      Prezime:
                    </FormLabel>
                    <FormControl className="col-span-5">
                      <Input
                        {...field}
                        placeholder="Prezime *"
                        disabled={isPending}
                        className="bg-background border-none"
                      />
                    </FormControl>
                    <FormMessage className="col-span-6" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ulicaIBroj"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-6 md:justify-between gap-4 md:gap-0">
                    <FormLabel className={cn(inter.className)}>
                      Ulica i broj:
                    </FormLabel>
                    <FormControl className="col-span-5">
                      <Input
                        {...field}
                        placeholder="Ulica i broj *"
                        disabled={isPending}
                        className="bg-background border-none"
                      />
                    </FormControl>
                    <FormMessage className="col-span-6" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postanskiBroj"
                render={({ field }) => (
                  <FormItem className="w-full grid grid-cols-1 md:grid-cols-6 md:justify-between gap-4 md:gap-0">
                    <FormLabel className={cn(inter.className)}>
                      Poštanski broj:
                    </FormLabel>
                    <FormControl className="col-span-5">
                      <Input
                        {...field}
                        placeholder="Poštanski broj *"
                        disabled={isPending}
                        className="bg-background border-none"
                      />
                    </FormControl>
                    <FormMessage className="col-span-6" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="grad"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-6 md:justify-between gap-4 md:gap-0">
                    <FormLabel className={cn(inter.className)}>Grad:</FormLabel>
                    <FormControl className="col-span-5">
                      <Input
                        {...field}
                        placeholder="Grad *"
                        disabled={isPending}
                        className="bg-background border-none"
                      />
                    </FormControl>
                    <FormMessage className="col-span-6" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="drzava"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-6 md:justify-between gap-4 md:gap-0">
                    <FormLabel className={cn(inter.className)}>
                      Država:
                    </FormLabel>
                    <FormControl className="col-span-5 w-full">
                      <Select
                        value={field.value ?? "Srbija"}
                        onValueChange={field.onChange}
                        disabled={isPending}
                      >
                        <SelectTrigger className="w-full col-span-5 bg-background border-none">
                          <SelectValue placeholder="Država *" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Srbija">Srbija</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="col-span-6" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-6 md:justify-between gap-4 md:gap-0">
                    <FormLabel className={cn(inter.className)}>
                      E-mail:
                    </FormLabel>
                    <FormControl className="col-span-5">
                      <Input
                        type="email"
                        {...field}
                        placeholder="E-mail *"
                        disabled={isPending}
                        className="bg-background border-none"
                      />
                    </FormControl>
                    <FormMessage className="col-span-6" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefon"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-6 md:justify-between gap-4 md:gap-0">
                    <FormLabel className={cn(inter.className)}>
                      Telefon:
                    </FormLabel>
                    <FormControl className="col-span-5">
                      <Input
                        {...field}
                        placeholder="Telefon *"
                        disabled={isPending}
                        className="bg-background border-none"
                      />
                    </FormControl>
                    <FormMessage className="col-span-6" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Separator className="my-4 bg-foreground" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,max-content)_1fr] md:gap-8 md:items-center">
            <h3
              className={cn(
                anton.className,
                "text-lg font-semibold uppercase text-foreground pt-1",
              )}
            >
              NAČIN ISPORUKE
            </h3>
            <div className="rounded-2xl border border-border w-full">
              <p className={cn(inter.className, "text-foreground")}>
                Kurirskom službom
              </p>
            </div>
          </div>
          <Separator className="my-4 bg-foreground" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,max-content)_1fr] md:gap-8 md:items-start">
            <h3
              className={cn(
                anton.className,
                "text-lg font-semibold uppercase text-foreground pt-1",
              )}
            >
              ZA PLAĆANJE
            </h3>
            <div className="rounded-2xl border border-border w-full">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex flex-col gap-3 [&_[data-slot=radio-group-indicator]_svg]:fill-green-600"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem
                            value="Po preuzimanju"
                            id="payment-cod"
                          />
                          <Label
                            htmlFor="payment-cod"
                            className={cn(
                              inter.className,
                              "cursor-pointer font-normal",
                            )}
                          >
                            Po preuzimanju
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="col-span-6" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Separator className="my-4 bg-foreground" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,max-content)_1fr] md:gap-8 md:items-start">
            <h3
              className={cn(
                anton.className,
                "text-lg font-semibold uppercase text-foreground pt-1",
              )}
            >
              NAPOMENA UZ NARUDŽBINU
            </h3>
            <div className="rounded-2xl border border-border w-full">
              <FormField
                control={form.control}
                name="napomena"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Dodatne napomene..."
                        className="min-h-24 w-full bg-background"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage className="col-span-6" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Separator className="my-4 bg-foreground" />

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-full px-8"
              onClick={goToPrevStep}
              disabled={isPending}
            >
              Nazad
            </Button>
            <Button
              type="submit"
              className="h-12 rounded-full px-10 text-base font-semibold"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Šaljem...
                </>
              ) : (
                "NASTAVI"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export function CheckoutFormStepPlaceholder() {
  return <div>Step 2 – Unos podataka (placeholder)</div>;
}
