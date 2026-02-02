import { SiteHeader } from "@/components/site-header";
import { sanityClient } from "@/lib/sanity/client";
import { HeroSection } from "@/components/landing/hero-section";
import { BenefitsStrip } from "@/components/landing/benefits-strip";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { landingPageQuery, testimonialsQuery } from "@/lib/sanity/queries";
import type { LandingPage, Testimonial } from "@/lib/sanity/types";

async function getPageData() {
  try {
    const [landingPage, testimonials] = await Promise.all([
      sanityClient.fetch<LandingPage | null>(landingPageQuery),
      sanityClient.fetch<Testimonial[]>(testimonialsQuery),
    ]);
    return { landingPage, testimonials };
  } catch (error) {
    console.error("Error fetching CMS data:", error);
    return {
      landingPage: null,
      testimonials: [],
    };
  }
}

export default async function Home() {
  const { landingPage, testimonials } = await getPageData();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="w-full py-12">
        <HeroSection landingPage={landingPage} />
        <BenefitsStrip />
        <TestimonialsSection testimonials={testimonials} />
      </main>
    </div>
  );
}
