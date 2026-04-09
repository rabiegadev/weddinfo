import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import { ScrollBackdrop } from "@/components/scroll-backdrop";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Weddinfo — wizytówki weselne",
    template: "%s — Weddinfo",
  },
  description:
    "Złóż zapytanie o wizytówkę weselną: harmonogram, lokalizacja, RSVP i kontakt dla gości.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} h-full scroll-smooth antialiased`}
    >
      <body className="bg-weddinfo-app relative flex min-h-full flex-col text-[var(--foreground)]">
        <ScrollBackdrop />
        <SiteHeader />
        <div className="flex flex-1 flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
