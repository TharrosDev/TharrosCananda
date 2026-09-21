import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tharros.ca";
  const routes = ["", "/market-explorer", "/research-services", "/how-it-works", "/about", "/request-research", "/methodology", "/ecommerce-readiness"];
  return routes.map((route, index) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : route === "/market-explorer" ? 0.9 : 0.7,
  }));
}
