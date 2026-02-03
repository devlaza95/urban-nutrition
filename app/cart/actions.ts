"use server";

import { z } from "zod";
import { sanitizeEmailAddress } from "@/lib/email/transporter";
import { sendOrderEmails } from "@/lib/email/order-emails";
import { DELIVERY_COST_RSD } from "@/lib/cart/types";

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1),
  name: z.string().optional(),
  price: z.number().min(0).optional(),
});

const checkoutFormSchema = z.object({
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

const submitOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Korpa je prazna"),
  formData: checkoutFormSchema,
});

export type SubmitOrderResult =
  | { success: true }
  | { success: false; error: string };

export async function submitOrder(
  data: z.infer<typeof submitOrderSchema>,
): Promise<SubmitOrderResult> {
  const parsed = submitOrderSchema.safeParse(data);
  if (!parsed.success) {
    const first = Object.values(parsed.error.flatten().fieldErrors).flat()[0];
    return { success: false, error: first ?? "Proverite unos." };
  }

  const { items, formData } = parsed.data;

  let sanitizedEmail: string;
  try {
    sanitizedEmail = sanitizeEmailAddress(formData.email);
  } catch {
    return { success: false, error: "Neispravna email adresa." };
  }

  const orderItems = items.map((i) => ({
    name: i.name ?? "Proizvod",
    quantity: i.quantity,
    price: i.price ?? 0,
    total: (i.price ?? 0) * i.quantity,
  }));

  const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalWithDelivery = subtotal + DELIVERY_COST_RSD;

  const submittedDate = new Date().toLocaleString("sr-Latn");

  const orderPayload = {
    ...formData,
    email: sanitizedEmail,
    items: orderItems,
    deliveryCost: DELIVERY_COST_RSD,
    totalWithDelivery,
    submittedDate,
  };

  try {
    await sendOrderEmails(orderPayload);
    return { success: true };
  } catch (err) {
    console.error("Order email error:", err);
    return {
      success: false,
      error:
        "Došlo je do greške pri slanju narudžbine. Pokušajte ponovo kasnije.",
    };
  }
}
