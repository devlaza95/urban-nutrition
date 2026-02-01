import { SiteHeader } from "@/components/site-header";
import { sanityClient } from "@/lib/sanity/client";
import { HeroSection } from "@/components/landing/hero-section";
import { landingPageQuery } from "@/lib/sanity/queries";
import type { LandingPage } from "@/lib/sanity/types";

async function getPageData() {
  try {
    const landingPage = await sanityClient.fetch<LandingPage | null>(
      landingPageQuery,
    );
    return { landingPage };
  } catch (error) {
    console.error("Error fetching CMS data:", error);
    return {
      landingPage: null,
    };
  }
}

export default async function Home() {
  const { landingPage } = await getPageData();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="w-full py-12">
        <HeroSection landingPage={landingPage} />
      </main>
    </div>
  );
}
