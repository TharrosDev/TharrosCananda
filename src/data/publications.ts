import type { ResearchArea } from "@/lib/research-areas";

export const publicationTypes = [
  { name: "Intelligence Briefs", description: "Short analyses of a single development and what it means commercially." },
  { name: "Research Reports", description: "Longer, sourced studies of a sector, policy or relationship." },
  { name: "Market Notes", description: "Focused notes on a market, segment or route to market." },
  { name: "Data Notes", description: "One dataset or indicator, explained with its source and limits." },
  { name: "Sector Analyses", description: "Structure, actors and trends across a Canada–Europe sector." },
] as const;

export type Publication = {
  slug: string;
  title: string;
  type: (typeof publicationTypes)[number]["name"];
  area: ResearchArea["slug"];
  /** ISO 8601 publication date. */
  publishedAt: string;
  summary: string;
  url: string;
};

// ponytail: empty until the first piece is published; add entries here and the Research page lists them.
// Only internally initiated work belongs here, labelled "Independent research by Tharros Canada".
export const publications: Publication[] = [];
