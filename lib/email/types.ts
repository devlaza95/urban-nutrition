/**
 * Shared types for order-related emails.
 * Extend OrderEmailPayload with optional fields (e.g. orderId, trackingUrl)
 * when adding new email types (shipping notification, reminder, etc.).
 */

export type OrderItemEmail = {
  name: string;
  quantity: number;
  price: number;
  total: number;
};

export type OrderEmailPayload = {
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
  /** Optional: for future order confirmation / tracking emails */
  orderId?: string;
  /** Optional: for future shipping notification */
  trackingUrl?: string;
  /** Optional: for future estimated delivery */
  estimatedDelivery?: string;
};
