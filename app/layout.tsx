import type { Metadata } from "next";
import "./globals.css";
import { anton, geistMono, geistSans, inter } from "@/lib/fonts";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { sanityClient } from "@/lib/sanity/client";
import { landingPageQuery } from "@/lib/sanity/queries";
import type { LandingPage } from "@/lib/sanity/types";

export const metadata: Metadata = {
  title: "Urban Nutrition",
  description: "Urban Nutrition",
};

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
    <html lang="en">
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
