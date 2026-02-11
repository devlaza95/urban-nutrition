import type { Metadata } from "next";
import "./globals.css";
import { anton, geistMono, geistSans, inter } from "@/lib/fonts";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { sanityClient } from "@/lib/sanity/client";
import { landingPageQuery } from "@/lib/sanity/queries";
import type { LandingPage } from "@/lib/sanity/types";
import { getImageUrl } from "@/lib/sanity/image";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export async function generateMetadata(): Promise<Metadata> {
  let landingPage: LandingPage | null = null;

  try {
    landingPage = await sanityClient.fetch<LandingPage | null>(
      landingPageQuery,
    );
  } catch (error) {
    console.error("Error fetching metadata CMS data:", error);
  }

  const seo = landingPage?.seo;

  const defaultTitle = "Prirodni proteinski napitak | Urban Nutrition";
  const defaultDescription =
    "Urban Nutrition donosi prirodni proteinski napitak za teretanu i svakodnevnu upotrebu – podrška za mišićnu masu, regeneraciju i zdravo telo.";

  const title = seo?.seoTitle?.trim() || defaultTitle;
  const description = seo?.seoDescription?.trim() || defaultDescription;

  const ogImageFromCms = seo?.ogImage;
  const ogImageUrlFromCms = getImageUrl(ogImageFromCms);

  // Optional static fallback if no CMS image is configured.
  const ogImageUrl = ogImageUrlFromCms ?? `${siteUrl}/og-default.jpg`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: "%s | Urban Nutrition",
    },
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: siteUrl,
      siteName: "Urban Nutrition",
      locale: "sr_RS",
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
    alternates: {
      canonical: siteUrl,
    },
  };
}

export const revalidate = 0; // Disable caching to see CMS changes immediately

async function getLandingPageForFooter() {
  try {
    return await sanityClient.fetch<LandingPage | null>(landingPageQuery);
  } catch (error) {
    console.error("Error fetching footer CMS data:", error);
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const landingPage = await getLandingPageForFooter();

  return (
    <html lang="sr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} ${inter.variable} antialiased`}
      >
        <SiteHeader />
        {children}
        <SiteFooter landingPage={landingPage} />
      </body>
    </html>
  );
}
