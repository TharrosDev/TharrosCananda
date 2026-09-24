import type { MetadataRoute } from "next";
import { publications } from "@/data/publications";
import { reportAsset } from "@/lib/reports";
import { coreRoutes, siteUrl as base } from "@/lib/site";

// ponytail: one date for all core pages; bump it when their copy changes so crawlers revisit.
const pagesUpdated = new Date("2026-09-23");

export default function sitemap(): MetadataRoute.Sitemap {
  const core = coreRoutes.map((route, index) => ({
    url: `${base}${route}`,
    lastModified: pagesUpdated,
    changeFrequency: (index === 0 || route === "/research" ? "weekly" : "monthly") as
      "weekly" | "monthly",
    priority: index === 0 ? 1 : index < 6 ? 0.9 : 0.6,
  }));
  const research = publications
    .filter((p) => p.indexable)
    .flatMap((p) => {
      const asset = reportAsset(p.slug);
      const lastModified = new Date(p.publishedAt);
      const page = {
        url: `${base}/research/${p.slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      };
      return asset
        ? [
            page,
            {
              url: `${base}${asset.file}`,
              lastModified,
              changeFrequency: "yearly" as const,
              priority: 0.6,
            },
          ]
        : [page];
    });
  return [...core, ...research];
}
