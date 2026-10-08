import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/src/components/analytics/GoogleAnalytics";
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, DEFAULT_TITLE, SITE_NAME, SITE_URL } from "@/src/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ["paket tour luar negeri", "tour luar negeri", "paket wisata", "travel agent", "Hathaway Journey"],
  openGraph: { type: "website", locale: "id_ID", siteName: SITE_NAME, title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, images: [DEFAULT_OG_IMAGE] },
  twitter: { card: "summary_large_image", title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, images: [DEFAULT_OG_IMAGE.url] },
  // Indexing is the default; only allow large image previews. (Not-found pages get Next's own "noindex".)
  robots: { googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
  // Google Search Console "HTML tag" verification (optional).
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#082A63",
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
