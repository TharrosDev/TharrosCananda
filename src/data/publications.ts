import type { ResearchArea } from "@/lib/research-areas";

export const publicationTypes = [
  { name: "Intelligence Briefs", description: "Short analyses of a single development and what it means commercially." },
  { name: "Research Reports", description: "Longer, sourced studies of a sector, policy or relationship." },
  { name: "Market Notes", description: "Focused notes on a market, segment or route to market." },
  { name: "Data Notes", description: "One dataset or indicator, explained with its source and limits." },
  { name: "Sector Analyses", description: "Structure, actors and trends across a Canada–Europe sector." },
] as const;

export type PublicationSource = {
  publisher: string;
  title: string;
  url: string;
  period?: string;
  retrievedAt?: string;
};

export type PublicationSection = {
  heading: string;
  paragraphs: string[];
};

export type Publication = {
  slug: string;
  title: string;
  type: (typeof publicationTypes)[number]["name"];
  area: ResearchArea["slug"];
  publishedAt: string;
  authors: string[];
  summary: string;
  executiveSummary: string;
  keyFindings: string[];
  methodology: string;
  limitations: string[];
  sources: PublicationSource[];
  sections?: PublicationSection[];
  tags?: string[];
  pdfUrl?: string;
  featured?: boolean;
};

// Intentionally empty until verified Tharros Canada research is actually published.
// Add complete real entries here. The archive and /research/[slug] article route update automatically.
export const publications: Publication[] = [];

export function publicationBySlug(slug: string) {
  return publications.find((publication) => publication.slug === slug);
}
