import type { MetadataRoute } from "next";
import { allPublications } from "@/data/publications";
import { reportAsset } from "@/lib/reports";
import { siteUrl as base } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/research-services",
    "/research",
    "/request-research",
    "/about",
    "/how-it-works",
    "/methodology",
    "/privacy",
    "/accessibility",
    "/copyright",
  ];
  const core = routes.map((route, index) => ({
    url: `${base}${route}`,
    changeFrequency: (index === 0 || route === "/research" ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: index === 0 ? 1 : index < 6 ? 0.9 : 0.6,
  }));
  const research = allPublications
    .filter((p) => p.indexable)
    .flatMap((p) => {
      const asset = reportAsset(p.slug);
      const lastModified = new Date(p.publishedAt);
      const page = { url: `${base}/research/${p.slug}`, lastModified, changeFrequency: "monthly" as const, priority: 0.8 };
      return asset ? [page, { url: `${base}${asset.file}`, lastModified, changeFrequency: "yearly" as const, priority: 0.6 }] : [page];
    });
  return [...core, ...research];
}
