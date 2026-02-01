import type { Metadata } from "next";
import "./globals.css";
import { anton, geistMono, geistSans, inter } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Urban Nutrition",
  description: "Urban Nutrition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
