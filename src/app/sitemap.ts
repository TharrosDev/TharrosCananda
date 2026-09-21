import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tharros.ca";
  const routes = [
    "",
    "/research-services",
    "/research-areas",
    "/research",
    "/market-explorer",
    "/request-research",
    "/about",
    "/how-it-works",
    "/methodology",
    "/privacy",
    "/accessibility",
  ];
  return routes.map((route, index) => ({
    url: `${base}${route}`,
    changeFrequency: index === 0 ? "weekly" : route === "/research" ? "weekly" : "monthly",
    priority: index === 0 ? 1 : index < 6 ? 0.9 : 0.6,
  }));
}
