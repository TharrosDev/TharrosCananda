import type { MetadataRoute } from "next";
import { publications } from "@/data/publications";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tharros.ca";
  const routes = [
    "",
    "/research-services",
    "/research",
    "/market-explorer",
    "/request-research",
    "/about",
    "/how-it-works",
    "/methodology",
    "/privacy",
    "/accessibility",
  ];
  const core = routes.map((route, index) => ({
    url: `${base}${route}`,
    changeFrequency: (index === 0 || route === "/research" ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: index === 0 ? 1 : index < 6 ? 0.9 : 0.6,
  }));
  const research = publications.map((publication) => ({
    url: `${base}/research/${publication.slug}`,
    lastModified: new Date(publication.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  return [...core, ...research];
}
