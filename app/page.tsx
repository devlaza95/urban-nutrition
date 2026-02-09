import { sanityClient } from "@/lib/sanity/client";
import { ScrollToHash } from "@/components/scroll-to-hash";
import { HeroSection } from "@/components/landing/hero-section";
import { BenefitsStrip } from "@/components/landing/benefits-strip";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { ProteinSection } from "../components/landing/protein-section";
import { ProteinVsWheySection } from "../components/landing/protein-vs-whey-section";
import { WhoIsItForSection } from "../components/landing/who-is-it-for-section";
import { FaqSection } from "../components/landing/faq-section";
import {
  faqItemsQuery,
  landingPageQuery,
  productsQuery,
  testimonialsQuery,
  whoIsItForItemsQuery,
} from "@/lib/sanity/queries";
import type {
  FaqItem,
  LandingPage,
  Product,
  Testimonial,
  WhoIsItForItem,
} from "@/lib/sanity/types";

export const revalidate = 0; // Disable caching to see CMS changes immediately

async function getPageData() {
  try {
    const [landingPage, testimonials, products, whoIsItForItems, faqItems] =
      await Promise.all([
        sanityClient.fetch<LandingPage | null>(landingPageQuery),
        sanityClient.fetch<Testimonial[]>(testimonialsQuery),
        sanityClient.fetch<Product[]>(productsQuery),
        sanityClient.fetch<WhoIsItForItem[]>(whoIsItForItemsQuery),
        sanityClient.fetch<FaqItem[]>(faqItemsQuery),
      ]);
    return { landingPage, testimonials, products, whoIsItForItems, faqItems };
  } catch (error) {
    console.error("Error fetching CMS data:", error);
    return {
      landingPage: null,
      testimonials: [],
      products: [],
      whoIsItForItems: [],
      faqItems: [],
    };
  }
}

export default async function Home() {
  const { landingPage, testimonials, products, whoIsItForItems, faqItems } =
    await getPageData();
  const product = products?.[0] ?? null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollToHash />
      <main className="w-full py-12">
        <HeroSection landingPage={landingPage} />
        <BenefitsStrip />
        <TestimonialsSection testimonials={testimonials} />
        <ProteinSection product={product} />
        <ProteinVsWheySection />
        <WhoIsItForSection items={whoIsItForItems} />
        <FaqSection items={faqItems} />
      </main>
    </div>
  );
}
