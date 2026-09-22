import type { NextConfig } from "next";
import { allPublications } from "./src/data/publications";
import reportAssets from "./src/data/report-pdf.json";

// Non-indexable reports (e.g. the lorem specimen) keep their PDF and cover out of search engines too.
const noindexFiles = allPublications
  .filter((p) => !p.indexable)
  .flatMap((p) => {
    const asset = (reportAssets as Record<string, { file: string; cover: string }>)[p.slug];
    return asset ? [asset.file, asset.cover] : [];
  });

const isProduction=process.env.NODE_ENV==="production";
// ponytail: script-src keeps 'unsafe-inline' for Next's inline bootstrap scripts. A nonce would force every
// page to render dynamically; React escapes all provider text and JSON-LD escapes "<" (src/lib/site.ts).
const contentSecurityPolicy=[
  "default-src 'self'","base-uri 'self'","object-src 'none'","frame-ancestors 'none'","form-action 'self'",
  "img-src 'self' data: blob:","font-src 'self' data:","style-src 'self' 'unsafe-inline'","script-src 'self' 'unsafe-inline'",
  "connect-src 'self'","worker-src 'self' blob:","manifest-src 'self'","upgrade-insecure-requests",
].join("; ");

const nextConfig:NextConfig={
  poweredByHeader:false,reactStrictMode:true,turbopack:{root:process.cwd()},
  // Retired route: the cross-border checklist folded into the Canada Market Scan. 308 keeps old links and search results working.
  async redirects(){return[{source:"/ecommerce-readiness",destination:"/research-services#market-scan",permanent:true}];},
  async headers(){return[{source:"/(.*)",headers:[
    {key:"X-Content-Type-Options",value:"nosniff"},{key:"X-Frame-Options",value:"DENY"},
    {key:"Strict-Transport-Security",value:"max-age=63072000; includeSubDomains"},{key:"Referrer-Policy",value:"strict-origin-when-cross-origin"},
    {key:"Permissions-Policy",value:"camera=(), microphone=(), geolocation=(), browsing-topics=()"},{key:"Cross-Origin-Opener-Policy",value:"same-origin"},
    ...(isProduction?[{key:"Content-Security-Policy",value:contentSecurityPolicy}]:[]),
  ]},
  ...noindexFiles.map((source)=>({source,headers:[{key:"X-Robots-Tag",value:"noindex, nofollow"}]})),
  ];},
};
export default nextConfig;
