import { renderTemplate, htmlToText } from "../template-loader";
import { DELIVERY_COST_RSD } from "@/lib/cart/types";

export type OrderItemEmail = {
  name: string;
  quantity: number;
  price: number;
  total: number;
};

export type OrderNotificationData = {
  ime: string;
  prezime: string;
  ulicaIBroj: string;
  postanskiBroj: string;
  grad: string;
  drzava: string;
  email: string;
  telefon: string;
  paymentMethod: string;
  napomena?: string;
  items: OrderItemEmail[];
  deliveryCost: number;
  totalWithDelivery: number;
  submittedDate: string;
};

export function getOrderNotificationEmail(data: OrderNotificationData) {
  const templateData = {
    ...data,
    items: data.items.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      price: i.price.toLocaleString("en-US", {
        useGrouping: false,
        maximumFractionDigits: 0,
      }),
      total: (i.price * i.quantity).toLocaleString("en-US", {
        useGrouping: false,
        maximumFractionDigits: 0,
      }),
    })),
    deliveryCost: data.deliveryCost.toLocaleString("en-US", {
      useGrouping: false,
      maximumFractionDigits: 0,
    }),
    totalWithDelivery: data.totalWithDelivery.toLocaleString("en-US", {
      useGrouping: false,
      maximumFractionDigits: 0,
    }),
  };
  const html = renderTemplate("order-notification", templateData);

  const text = htmlToText(html);

  return {
    subject: `Nova narudžbina - ${data.ime} ${data.prezime} - Urban Nutrition`,
    html,
    text,
  };
}
