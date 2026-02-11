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
  seo?: {
    ogImage?: SanityImageSource;
    seoTitle?: string;
    seoDescription?: string;
  };
  footer?: {
    socialLinks?: Array<{
      platform?:
        | "facebook"
        | "instagram"
        | "youtube"
        | "linkedin"
        | "x"
        | "tiktok";
      url?: string;
    }>;
    contact?: {
      phone?: string;
      email?: string;
      location?: string;
    };
  };
};

export type Testimonial = {
  _id: string;
  name?: string;
  age?: number;
  occupation?: string;
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
  productInformation?: unknown;
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
  image?: SanityImageSource;
  order?: number;
};
