import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/src/components/analytics/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Hathaway Journey - Explore More, Create Memories",
    template: "%s | Hathaway Journey",
  },
  description: "Temukan pengalaman perjalanan terbaik bersama Hathaway Journey. Kami hadir untuk mewujudkan perjalanan impian Anda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        {/* Scroll-reveal elements start hidden via CSS; without JavaScript, show them right away. */}
        <noscript>
          <style>{'.reveal{opacity:1!important;transform:none!important}'}</style>
        </noscript>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-brand-light text-brand-dark`}>
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
