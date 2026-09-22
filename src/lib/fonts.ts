import { Schibsted_Grotesk, Source_Serif_4 } from "next/font/google";

// Self-hosted at build time with preload and a metric-matched fallback (no layout shift on swap).
export const sans = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-sans" });
export const display = Source_Serif_4({ subsets: ["latin"], axes: ["opsz"], variable: "--font-display" });
