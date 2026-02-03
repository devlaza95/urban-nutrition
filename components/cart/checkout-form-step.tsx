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
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { anton, inter } from "@/lib/fonts";
import { urlFor } from "@/lib/sanity/image";
import type { Product } from "@/lib/sanity/types";
import { submitOrder } from "@/app/cart/actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
  productsLoading?: boolean;
};

export function CheckoutFormStep({
  productsMap,
  productsLoading,
}: CheckoutFormStepProps) {
  const {
    items,
    formData,
    setFormData,
    setStep,
    setOrderSubmitted,
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
        setOrderSubmitted(true);
        setStep(3);
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
    <div className="space-y-8">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="bg-[#65609d] px-4 py-3 text-white">
          <div className="grid grid-cols-12 gap-4">
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
                className="grid grid-cols-12 gap-4 items-center px-4 py-4"
              >
                <div className="col-span-5 flex items-center gap-4">
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
                <div className="col-span-2 flex items-center justify-center gap-1">
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
                <div className="col-span-2 text-center">
                  <span className={cn(inter.className, "text-foreground")}>
                    {formatRsd(price)}
                  </span>
                </div>
                <div className="col-span-3 text-right">
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-2xl border border-border bg-secondary/30 p-6">
            <h3
              className={cn(
                anton.className,
                "mb-4 text-lg font-normal text-foreground",
              )}
            >
              PRIMALAC RAČUNA
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="ime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(inter.className)}>Ime:</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prezime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(inter.className)}>
                      Prezime:
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="ulicaIBroj"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel className={cn(inter.className)}>
                    Ulica i broj:
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      className="bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="postanskiBroj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(inter.className)}>
                      Poštanski broj:
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Poštanski broj i mesto"
                        disabled={isPending}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="grad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(inter.className)}>Grad:</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="drzava"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel className={cn(inter.className)}>Država:</FormLabel>
                  <FormControl>
                    <NativeSelect
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                      disabled={isPending}
                      className="w-full bg-background"
                    >
                      <NativeSelectOption value="Srbija">
                        Srbija
                      </NativeSelectOption>
                    </NativeSelect>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(inter.className)}>
                      E-mail:
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        disabled={isPending}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(inter.className)}>
                      Telefon:
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-secondary/30 p-6">
            <h3
              className={cn(
                anton.className,
                "mb-2 text-lg font-normal text-foreground",
              )}
            >
              NAČIN ISPORUKE
            </h3>
            <p className={cn(inter.className, "text-foreground")}>
              Kurirska služba BEX
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-secondary/30 p-6">
            <h3
              className={cn(
                anton.className,
                "mb-4 text-lg font-normal text-foreground",
              )}
            >
              ZA PLAĆANJE
            </h3>
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex flex-col gap-3"
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
                      <div className="flex items-center gap-2">
                        <RadioGroupItem
                          value="Platna kartica"
                          id="payment-card"
                          disabled
                        />
                        <Label
                          htmlFor="payment-card"
                          className={cn(
                            inter.className,
                            "cursor-not-allowed font-normal text-muted-foreground",
                          )}
                        >
                          Platna kartica (uskoro)
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="rounded-2xl border border-border bg-secondary/30 p-6">
            <h3
              className={cn(
                anton.className,
                "mb-4 text-lg font-normal text-foreground",
              )}
            >
              NAPOMENA UZ NARUDŽBINU
            </h3>
            <FormField
              control={form.control}
              name="napomena"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Dodatne napomene..."
                      className="min-h-24 bg-background"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
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
