import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hathaway Journey - Explore More, Create Memories",
  description: "Temukan pengalaman perjalanan terbaik bersama Hathaway Journey. Kami hadir untuk mewujudkan perjalanan impian Anda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-brand-light text-brand-dark`}>
        {children}
      </body>
    </html>
  );
}
