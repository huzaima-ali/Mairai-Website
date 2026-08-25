import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/content";
import {
  CANONICAL_ORIGIN,
  jsonLdScript,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import { MotionProvider } from "@/components/animations/MotionProvider";
import { LenisProvider } from "@/components/animations/LenisProvider";
import { AlertBar } from "@/components/layout/AlertBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Inter stands in for "Google Sans" (the Figma font, not freely distributable).
const sans = Inter({ subsets: ["latin"], display: "swap", variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_ORIGIN),
  title: {
    default: "AI Development & Product Engineering Company | Mirai Studios",
    template: `%s | Mirai Studios`,
  },
  description: SITE.description,
  alternates: { canonical: CANONICAL_ORIGIN },
  openGraph: {
    type: "website",
    url: CANONICAL_ORIGIN,
    siteName: SITE.name,
    title: "AI Development & Product Engineering Company | Mirai Studios",
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Development & Product Engineering Company | Mirai Studios",
    description: SITE.description,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body className="min-h-dvh bg-background font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript([organizationJsonLd(), websiteJsonLd()])}
        />
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <MotionProvider>
          <LenisProvider>
            <AlertBar />
            <Navbar />
            <main>{children}</main>
            <Footer />
          </LenisProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
