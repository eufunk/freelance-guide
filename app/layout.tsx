import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { BottomNav } from "@/components/layout/bottom-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

import "./globals.css";

// next/font downloads the fonts at build time and serves them from our own
// domain, so visitors' browsers never contact Google (GDPR).
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Freelance Guide",
    template: "%s | Freelance Guide",
  },
  description: "Schritt für Schritt vom IT-Profi zum Freelancer – bis zum ersten Kunden.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        {/* Bottom padding keeps content clear of the fixed mobile navigation. */}
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <div className="pb-20 md:pb-0">
          <SiteFooter />
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
