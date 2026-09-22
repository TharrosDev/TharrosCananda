import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { SiteAnalytics } from "@/components/analytics-beacon";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { organization, organizationJsonLd } from "@/data/organization";
import { researchEmail } from "@/lib/contact";
import { jsonLd, siteUrl } from "@/lib/site";

// Self-hosted at build time with preload and a metric-matched fallback (no layout shift on swap).
const sans = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-sans" });
const display = Source_Serif_4({ subsets: ["latin"], axes: ["opsz"], variable: "--font-display" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tharros Canada | Independent Canada–Europe research",
    template: "%s | Tharros Canada",
  },
  description:
    "Independent research on trade, defence, energy, industry and technology across Canada and Europe.",
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: siteUrl,
    siteName: "Tharros Canada",
    title: "Independent Canada–Europe research.",
    description: "Research on trade, defence, energy, industry and technology across Canada and Europe.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tharros Canada",
    description: "Independent Canada–Europe research.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f1ea",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const email = researchEmail();
  const structuredData = organizationJsonLd(organization, { url: siteUrl, email });

  return (
    <html lang="en-CA" data-scroll-behavior="smooth" className={`${sans.variable} ${display.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <SiteAnalytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
      </body>
    </html>
  );
}
