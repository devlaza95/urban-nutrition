import type { SanityImageSource } from "@/lib/sanity/image";

export type LandingPage = {
  hero?: {
    headline?: string;
    subheading?: unknown;
    heroImage?: SanityImageSource;
  };
  nutritionInfo?: unknown;
  allergiesInfo?: unknown;
  deliveryInfo?: unknown;
  returnsInfo?: unknown;
};

export type Testimonial = {
  _id: string;
  name?: string;
  age?: number;
  rating?: number;
  description?: unknown;
  image?: SanityImageSource;
};

export type Product = {
  _id: string;
  name?: string;
  price?: number;
  shortDescription?: string;
  description?: unknown;
  allergiesInfo?: unknown;
  rating?: number;
  images?: SanityImageSource[];
};

export type FaqItem = {
  _id: string;
  title?: string;
  description?: unknown;
};

export type WhoIsItForItem = {
  _id: string;
  title?: string;
  description?: unknown;
  order?: number;
};
