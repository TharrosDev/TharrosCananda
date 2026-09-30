import type { NextConfig } from "next";
import { publications } from "./src/data/publications";
import reportAssets from "./src/data/report-pdf.json";

// Non-indexable reports keep their PDF, cover and generated social image out of search engines too.
const unindexed = publications.filter((p) => !p.indexable);
const noindexFiles = unindexed.flatMap((p) => {
  const asset = (reportAssets as Record<string, { file: string; cover: string }>)[p.slug];
  return asset ? [asset.file, asset.cover] : [];
});

const isProduction = process.env.NODE_ENV === "production";
// ponytail: script-src keeps 'unsafe-inline' for Next's inline bootstrap scripts. A nonce would force every
// page to render dynamically; React escapes all provider text and JSON-LD escapes "<" (src/lib/site.ts).
const cspDirectives = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
];
// Preview deployments only: sources the Vercel toolbar needs (vercel.com/docs/vercel-toolbar/managing-toolbar).
const vercelToolbarSources: Record<string, string> = {
  "img-src": "https://vercel.live https://vercel.com",
  "font-src": "https://vercel.live https://assets.vercel.com",
  "style-src": "https://vercel.live",
  "script-src": "https://vercel.live",
  "connect-src": "https://vercel.live wss://ws-us3.pusher.com",
};
const contentSecurityPolicy = (
  process.env.VERCEL_ENV === "preview"
    ? [
        ...cspDirectives.map((d) => {
          const extra = vercelToolbarSources[d.split(" ")[0]];
          return extra ? `${d} ${extra}` : d;
        }),
        "frame-src 'self' https://vercel.live",
      ]
    : cspDirectives
).join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: { root: process.cwd() },
  // Retired service pages send existing links to the research archive and methodology.
  async redirects() {
    return [
      {
        source: "/ecommerce-readiness",
        destination: "/research",
        permanent: true,
      },
      { source: "/research-services", destination: "/research", permanent: true },
      { source: "/request-research", destination: "/research", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          ...(isProduction
            ? [{ key: "Content-Security-Policy", value: contentSecurityPolicy }]
            : []),
        ],
      },
      ...noindexFiles.map((source) => ({
        source,
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      })),
      ...unindexed.map((p) => ({
        source: `/research/${p.slug}/:path*`,
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      })),
      // next/image serves covers from /_next/image?url=<file>: gate that URL too.
      ...noindexFiles.map((file) => ({
        source: "/_next/image",
        has: [
          {
            type: "query" as const,
            key: "url",
            value: file.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          },
        ],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      })),
    ];
  },
};
export default nextConfig;
