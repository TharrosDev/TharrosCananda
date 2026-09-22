import type { NextConfig } from "next";

const isProduction=process.env.NODE_ENV==="production";
const contentSecurityPolicy=[
  "default-src 'self'","base-uri 'self'","object-src 'none'","frame-ancestors 'none'","form-action 'self'",
  "img-src 'self' data: blob:","font-src 'self' data:","style-src 'self' 'unsafe-inline'","script-src 'self' 'unsafe-inline'",
  "connect-src 'self'","worker-src 'self' blob:","manifest-src 'self'","upgrade-insecure-requests",
].join("; ");

const nextConfig:NextConfig={
  poweredByHeader:false,reactStrictMode:true,turbopack:{root:process.cwd()},experimental:{typedEnv:true},
  async headers(){return[{source:"/(.*)",headers:[
    {key:"X-Content-Type-Options",value:"nosniff"},{key:"X-Frame-Options",value:"DENY"},
    {key:"Strict-Transport-Security",value:"max-age=63072000; includeSubDomains"},{key:"Referrer-Policy",value:"strict-origin-when-cross-origin"},
    {key:"Permissions-Policy",value:"camera=(), microphone=(), geolocation=(), browsing-topics=()"},{key:"Cross-Origin-Opener-Policy",value:"same-origin"},
    ...(isProduction?[{key:"Content-Security-Policy",value:contentSecurityPolicy}]:[]),
  ]}];},
};
export default nextConfig;
