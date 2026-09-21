import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/newsreader";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { researchEmail } from "@/lib/contact";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tharros.ca";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tharros Canada | Canadian market intelligence for European businesses",
    template: "%s | Tharros Canada",
  },
  description:
    "Canadian market research for European companies: demand, market structure, buyers, distributors, competitors and routes to market, researched before you commit.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: siteUrl,
    siteName: "Tharros Canada",
    title: "Understand the Canadian market before you enter it.",
    description: "Canadian market intelligence and commercial research for European companies evaluating Canada.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tharros Canada",
    description: "Canadian market intelligence for European companies evaluating Canada.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3f0e8",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const email = researchEmail();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tharros Canada",
    url: siteUrl,
    description: "Independent Canadian market research for European companies evaluating Canada.",
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
