import type { ResearchArea } from "@/lib/research-areas";

export const publicationTypes = [
  { name: "Tharros Insight", description: "Short, focused analysis of a current Canada–Europe development." },
  { name: "Tharros Brief", description: "Substantial sourced analysis of a defined commercial, economic, industrial, technological or strategic question." },
  { name: "Tharros Data Note", description: "Chart- or dataset-led analysis with concise interpretation and explicit source limits." },
  { name: "Tharros Report", description: "Occasional long-form research on a major Canada–Europe subject." },
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
  origin: "independent" | "commissioned";
  publishedAt: string;
  authors: string[];
  summary: string;
  executiveSummary: string;
  keyFindings: string[];
  methodology: string;
  limitations: string[];
  sources: PublicationSource[];
  suggestedCitation: string;
  sections?: PublicationSection[];
  tags?: string[];
  pdfUrl?: string;
  featured?: boolean;
};

// Intentionally empty until verified Tharros Canada research is actually published.
// Independent work must use origin: "independent". Use "commissioned" only for work actually commissioned by a client and permitted for publication.
export const publications: Publication[] = [];

export function publicationBySlug(slug: string) {
  return publications.find((publication) => publication.slug === slug);
}
