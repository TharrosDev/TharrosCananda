import type { Metadata, Viewport } from "next";
import "@fontsource-variable/schibsted-grotesk";
import "@fontsource-variable/source-serif-4/opsz.css";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { researchEmail } from "@/lib/contact";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tharros.ca";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tharros Canada | Commercial research and intelligence connecting Canada and Europe",
    template: "%s | Tharros Canada",
  },
  description:
    "Tharros Canada researches commercial, economic, industrial, technological and strategic developments connecting Canada and Europe, and provides commissioned research and commercial intelligence.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: siteUrl,
    siteName: "Tharros Canada",
    title: "Commercial research and intelligence connecting Canada and Europe.",
    description: "Independent research and commissioned intelligence on trade, defence, energy, industry and technology between Canada and Europe.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tharros Canada",
    description: "Commercial research and intelligence connecting Canada and Europe.",
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tharros Canada",
    url: siteUrl,
    description: "Commercial research and intelligence company focused on Canada–Europe relations.",
    ...(email ? { email } : {}),
  };

  return (
    <html lang="en-CA" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
