import { SiteHeader } from "@/components/site-header";
import { sanityClient } from "@/lib/sanity/client";
import { HeroSection } from "@/components/landing/hero-section";
import { BenefitsStrip } from "@/components/landing/benefits-strip";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { ProteinSection } from "../components/landing/protein-section";
import { ProteinVsWheySection } from "../components/landing/protein-vs-whey-section";
import { WhoIsItForSection } from "../components/landing/who-is-it-for-section";
import {
  landingPageQuery,
  productsQuery,
  testimonialsQuery,
  whoIsItForItemsQuery,
} from "@/lib/sanity/queries";
import type {
  LandingPage,
  Product,
  Testimonial,
  WhoIsItForItem,
} from "@/lib/sanity/types";

async function getPageData() {
  try {
    const [landingPage, testimonials, products, whoIsItForItems] =
      await Promise.all([
        sanityClient.fetch<LandingPage | null>(landingPageQuery),
        sanityClient.fetch<Testimonial[]>(testimonialsQuery),
        sanityClient.fetch<Product[]>(productsQuery),
        sanityClient.fetch<WhoIsItForItem[]>(whoIsItForItemsQuery),
      ]);
    return { landingPage, testimonials, products, whoIsItForItems };
  } catch (error) {
    console.error("Error fetching CMS data:", error);
    return {
      landingPage: null,
      testimonials: [],
      products: [],
      whoIsItForItems: [],
    };
  }
}

export default async function Home() {
  const { landingPage, testimonials, products, whoIsItForItems } =
    await getPageData();
  const product = products?.[0] ?? null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="w-full py-12">
        <HeroSection landingPage={landingPage} />
        <BenefitsStrip />
        <TestimonialsSection testimonials={testimonials} />
        <ProteinSection product={product} />
        <ProteinVsWheySection />
        <WhoIsItForSection items={whoIsItForItems} />
      </main>
    </div>
  );
}
