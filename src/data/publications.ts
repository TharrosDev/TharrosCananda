import type { ResearchArea } from "@/lib/research-areas";

export const publicationTypes = [
  {
    name: "Intelligence Brief",
    description: "A concise review of a current Canada–Europe development.",
  },
  { name: "Research Report", description: "Sourced analysis of a defined Canada–Europe question." },
  { name: "Market Note", description: "A focused review of market structure or movement." },
  {
    name: "Data Note",
    description:
      "Chart- or dataset-led analysis with concise interpretation and explicit source limits.",
  },
  {
    name: "Sector Analysis",
    description:
      "A structured view of an industry, ecosystem or strategic sector across Canada and Europe.",
  },
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
  specimen?: boolean;
};

// Intentionally empty until verified Tharros Canada research is actually published.
// Independent work must use origin: "independent". Use "commissioned" only for work actually commissioned by a client and permitted for publication.
export const publications: Publication[] = [];

export const researchSpecimenPublication: Publication = {
  slug: "example-report",
  title: "Example research report layout",
  type: "Research Report",
  area: "trade-economic-integration",
  origin: "independent",
  publishedAt: "2026-09-01",
  authors: ["Tharros Canada"],
  summary:
    "A clearly labelled specimen showing how a published report appears in the archive and how its evidence, findings, methodology and sources are structured.",
  executiveSummary: "Placeholder specimen content only.",
  keyFindings: [],
  methodology: "Placeholder specimen content only.",
  limitations: ["This is a layout specimen, not a Tharros Canada research finding."],
  sources: [],
  suggestedCitation: "Not applicable. This is a layout specimen.",
  tags: ["Example layout", "Publication structure"],
  specimen: true,
};

export function publicationBySlug(slug: string) {
  return publications.find((publication) => publication.slug === slug);
}
