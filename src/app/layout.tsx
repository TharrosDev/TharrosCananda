import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteAnalytics } from "@/components/analytics-beacon";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { organization, organizationJsonLd } from "@/data/organization";
import { researchEmail } from "@/lib/contact";
import { display, sans } from "@/lib/fonts";
import { jsonLd, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tharros Canada | Independent research across Canada and Europe",
    template: "%s | Tharros Canada",
  },
  description:
    "Independent research on trade, defence, energy, industry, technology and public data across Canada and Europe.",
  // Pages set their own Open Graph and Twitter fields through pageMetadata (src/lib/site.ts).
  openGraph: { type: "website", locale: "en_CA", siteName: "Tharros Canada" },
  twitter: { card: "summary_large_image" },
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
  const { "@context": context, ...org } = organizationJsonLd(organization, { url: siteUrl, email });
  const structuredData = {
    "@context": context,
    "@graph": [
      org,
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Tharros Canada",
        inLanguage: "en-CA",
        publisher: { "@id": org["@id"] },
      },
    ],
  };

  return (
    <html
      lang="en-CA"
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${display.variable}`}
    >
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <SiteAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
        />
      </body>
    </html>
  );
}
