import { Schibsted_Grotesk, Space_Grotesk } from "next/font/google";

// Self-hosted at build time with preload and a metric-matched fallback (no layout shift on swap).
export const sans = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-sans" });
export const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});
