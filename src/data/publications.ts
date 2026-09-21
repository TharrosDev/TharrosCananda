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
  publishedAt: string;
  summary: string;
  url: string;
  author?: string;
  tags?: string[];
  pdfUrl?: string;
  featured?: boolean;
};

// This remains empty until verified Tharros Canada research is actually published.
// Add real entries here; the archive UI will automatically expose search and filters.
export const publications: Publication[] = [];
