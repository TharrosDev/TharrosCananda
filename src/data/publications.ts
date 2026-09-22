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
};

// Independent work must use origin: "independent". Use "commissioned" only for work actually commissioned by a client and permitted for publication.
export const publications: Publication[] = [
  {
    slug: "example-report",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    type: "Research Report",
    area: "trade-economic-integration",
    origin: "independent",
    publishedAt: "2026-09-01",
    authors: ["Tharros Canada"],
    summary:
      "Sed posuere consectetur est at lobortis: vestibulum id ligula porta felis euismod semper, cras mattis consectetur purus sit amet fermentum.",
    executiveSummary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Maecenas faucibus mollis interdum, nulla vitae elit libero, a pharetra augue. Donec ullamcorper nulla non metus auctor fringilla.",
    keyFindings: [
      "Lorem ipsum dolor sit amet. Consectetur adipiscing elit, integer posuere erat a ante venenatis dapibus.",
      "Maecenas faucibus mollis interdum. Nulla vitae elit libero, a pharetra augue donec ullamcorper.",
      "Vestibulum id ligula porta. Felis euismod semper, cras mattis consectetur purus sit amet.",
    ],
    methodology:
      "Curabitur blandit tempus porttitor. Nullam quis risus eget urna mollis ornare vel eu leo. Etiam porta sem malesuada magna mollis euismod. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.",
    limitations: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Integer posuere erat a ante venenatis dapibus.",
      "Donec ullamcorper nulla non metus auctor fringilla.",
    ],
    sources: [
      {
        publisher: "Publisher",
        title: "Dataset or document title",
        url: "https://example.com/source-1",
        period: "Reference period",
        retrievedAt: "2026-09-01",
      },
      {
        publisher: "Publisher",
        title: "Dataset or document title",
        url: "https://example.com/source-2",
        period: "Reference period",
        retrievedAt: "2026-09-01",
      },
      {
        publisher: "Publisher",
        title: "Dataset or document title",
        url: "https://example.com/source-3",
        period: "Reference period",
        retrievedAt: "2026-09-01",
      },
    ],
    suggestedCitation:
      "Tharros Canada. (2026, September 1). Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tharros Canada Research Report.",
    tags: ["Trade & Economic Integration"],
  },
];

export function publicationBySlug(slug: string) {
  return publications.find((publication) => publication.slug === slug);
}
