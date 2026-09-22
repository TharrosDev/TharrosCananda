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
    default: "Tharros Canada | Independent Canada–Europe research",
    template: "%s | Tharros Canada",
  },
  description:
    "Independent research on trade, defence, energy, industry and technology across Canada and Europe.",
  alternates: { canonical: "/" },
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tharros Canada",
    url: siteUrl,
    description: "Independent research organization focused on Canada–Europe relations.",
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
