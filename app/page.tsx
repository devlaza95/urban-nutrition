import { SiteHeader } from "@/components/site-header";
import { sanityClient } from "@/lib/sanity/client";
import { HeroSection } from "@/components/landing/hero-section";
import { BenefitsStrip } from "@/components/landing/benefits-strip";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { ProteinSection } from "../components/landing/protein-section";
import {
  landingPageQuery,
  productsQuery,
  testimonialsQuery,
} from "@/lib/sanity/queries";
import type { LandingPage, Product, Testimonial } from "@/lib/sanity/types";

async function getPageData() {
  try {
    const [landingPage, testimonials, products] = await Promise.all([
      sanityClient.fetch<LandingPage | null>(landingPageQuery),
      sanityClient.fetch<Testimonial[]>(testimonialsQuery),
      sanityClient.fetch<Product[]>(productsQuery),
    ]);
    return { landingPage, testimonials, products };
  } catch (error) {
    console.error("Error fetching CMS data:", error);
    return {
      landingPage: null,
      testimonials: [],
      products: [],
    };
  }
}

export default async function Home() {
  const { landingPage, testimonials, products } = await getPageData();
  const product = products?.[0] ?? null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="w-full py-12">
        <HeroSection landingPage={landingPage} />
        <BenefitsStrip />
        <TestimonialsSection testimonials={testimonials} />
        <ProteinSection product={product} />
      </main>
    </div>
  );
}
