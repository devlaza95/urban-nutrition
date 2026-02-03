import { renderTemplate, htmlToText } from "../template-loader";
import type { OrderEmailPayload } from "../types";

export function getOrderNotificationEmail(data: OrderEmailPayload) {
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
