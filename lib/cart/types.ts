export type CartItem = {
  productId: string;
  quantity: number;
};

export type PaymentMethod = "Po preuzimanju" | "Platna kartica";

export type CheckoutFormData = {
  ime: string;
  prezime: string;
  ulicaIBroj: string;
  postanskiBroj: string;
  grad: string;
  drzava: string;
  email: string;
  telefon: string;
  paymentMethod: PaymentMethod;
  napomena?: string;
};

export type CartState = {
  step: 1 | 2 | 3;
  items: CartItem[];
  promoCode?: string;
  formData?: Partial<CheckoutFormData>;
  orderSubmitted?: boolean;
};

export const CART_STORAGE_KEY = "urban-nutrition-cart";

export const DELIVERY_COST_RSD = 380;

export const DEFAULT_CART_STATE: CartState = {
  step: 1,
  items: [],
  orderSubmitted: false,
};
