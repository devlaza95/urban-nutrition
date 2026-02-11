import type {
  FaqItem,
  LandingPage,
  Product,
  Testimonial,
} from "@/lib/sanity/types";
import { getImageUrl } from "@/lib/sanity/image";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://urbannutrition.rs";

export function getOrganizationJsonLd(landingPage: LandingPage | null) {
  const contact = landingPage?.footer?.contact;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Urban Nutrition",
    url: siteUrl,
    telephone: contact?.phone,
    email: contact?.email,
    address: contact?.location
      ? {
          "@type": "PostalAddress",
          streetAddress: contact.location,
        }
      : undefined,
  };
}

export function getProductJsonLd(
  product: Product | null,
  testimonials: Testimonial[],
) {
  if (!product) return null;

  const image =
    product.images && product.images.length > 0
      ? product.images
          .map((img) => getImageUrl(img))
          .filter((url): url is string => Boolean(url))
      : undefined;

  const ratings = testimonials
    .map((t) => t.rating)
    .filter((r): r is number => typeof r === "number" && r > 0);

  const aggregateRating =
    ratings.length > 0
      ? {
          "@type": "AggregateRating",
          ratingValue:
            ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length,
          reviewCount: ratings.length,
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image,
    brand: {
      "@type": "Brand",
      name: "Urban Nutrition",
    },
    offers:
      typeof product.price === "number"
        ? {
            "@type": "Offer",
            priceCurrency: "RSD",
            price: product.price,
            availability: "https://schema.org/InStock",
            url: siteUrl,
          }
        : undefined,
    aggregateRating,
  };
}

export function getFaqJsonLd(items: FaqItem[]) {
  if (!items || items.length === 0) return null;

  const getAnswerText = (description: FaqItem["description"]): string => {
    if (!description || !Array.isArray(description)) return "";

    // Very lightweight Portable Text -> plain text extraction:
    return description
      .map((block) => {
        if (!block || typeof block !== "object") return "";
        const maybeChildren = (block as { children?: unknown }).children;
        if (!Array.isArray(maybeChildren)) return "";
        return maybeChildren
          .map((child) => {
            const text = (child as { text?: unknown }).text;
            return typeof text === "string" ? text : "";
          })
          .join("");
      })
      .join("\n\n")
      .trim();
  };

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.title,
      acceptedAnswer: {
        "@type": "Answer",
        text: getAnswerText(item.description),
      },
    })),
  };
}
