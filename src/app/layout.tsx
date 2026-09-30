import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteAnalytics } from "@/components/analytics-beacon";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { organization, organizationJsonLd } from "@/data/organization";
import { publishing } from "@/data/publishing";
import { researchEmail } from "@/lib/contact";
import { display, sans } from "@/lib/fonts";
import { jsonLd, siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Publish your undergraduate work`,
    template: `%s | ${siteName}`,
  },
  description: publishing.description,
  // Pages set their own Open Graph and Twitter fields through pageMetadata (src/lib/site.ts).
  openGraph: { type: "website", locale: "en_CA", siteName },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#151515",
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
        name: siteName,
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
        <noscript>
          <style>
            {
              "@media(max-width:1020px){.menu-toggle{display:none!important}.main-nav{position:static!important;display:flex!important;height:auto!important;padding:0!important;border:0!important}.nav-shell{flex-wrap:wrap;padding-block:16px}.nav-links{display:flex!important;flex-wrap:wrap;gap:4px}.nav-links a{font-size:16px!important;min-height:44px}.nav-description,.nav-project-note{display:none!important}}"
            }
          </style>
        </noscript>
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
