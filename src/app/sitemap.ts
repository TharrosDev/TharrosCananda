import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tharros.ca";
  const routes = ["", "/research", "/research-areas", "/research-services", "/request-research", "/market-explorer", "/about", "/how-it-works", "/methodology", "/ecommerce-readiness"];
  return routes.map((route, index) => ({
    url: `${base}${route}`,
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : index < 5 ? 0.9 : 0.6,
  }));
}
