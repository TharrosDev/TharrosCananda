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
  url?: string;
  period?: string;
  retrievedAt?: string;
};

export type ReportBlock =
  | { kind: "heading"; text: string; number?: number }
  | { kind: "lede"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "findings"; items: { lead: string; text: string }[] }
  | { kind: "callout"; text: string }
  // ponytail: one placeholder figure style; add real chart kinds with the first data-bearing report.
  | { kind: "figure"; caption: string; source: string }
  | { kind: "list"; items: string[] }
  | { kind: "sources"; items: PublicationSource[] }
  | { kind: "columns"; left: ReportBlock[]; right: ReportBlock[] };

export type Publication = {
  slug: string;
  reference: string;
  title: string;
  subtitle?: string;
  type: (typeof publicationTypes)[number]["name"];
  area: ResearchArea["slug"];
  origin: "independent" | "commissioned";
  publishedAt: string;
  authors: string[];
  summary: string;
  tags?: string[];
  sources: PublicationSource[];
  body: ReportBlock[];
  /** Stated limitations quoted verbatim from a supplied PDF; house reports use a "Limitations" heading in `body`. */
  limitations?: string[];
  /** The author's own PDF at public/research/<reference>.pdf, served byte-for-byte (docs/REPORT_REQUIREMENTS.md). `body` stays empty. */
  supplied?: true;
  /** Only true for verified, published work. Gates robots, citation_* meta, sitemap and the PDF's X-Robots-Tag. */
  indexable: boolean;
  featured?: boolean;
  specimen?: boolean;
};

// Verified Tharros Canada research only (docs/REPORT_REQUIREMENTS.md).
// Independent work must use origin: "independent". Use "commissioned" only for work actually commissioned by a client and permitted for publication.
export const publications: Publication[] = [
  {
    slug: "ottawa-traffic-collisions-2017-2024",
    reference: "TC-2026-001",
    title: "Analytical Report: Traffic Collisions by Location 2017-2024 (excluding 2023)",
    type: "Data Note",
    area: "data-quality-validity",
    origin: "independent",
    publishedAt: "2026-09-16",
    authors: ["Magnus Abdelnour"],
    // Verbatim from the PDF's "Fit for Use Assessment".
    summary:
      "This dataset is fit to be used for needs pertaining to geographic distribution, characteristics, and trends in reported traffic collisions in the City of Ottawa. While the dataset is well suited for identifying broader collision trends across Ottawa, the absence of 2023 limits its reliability for continuous analysis and weakens any findings and conclusions that depend on complete 2017 to 2024 comparisons.",
    tags: ["Ottawa", "Traffic collisions", "Open data", "Fitness for use"],
    // Verbatim from "Quality & Limitations" and "Technical Contents".
    limitations: [
      "However, the complete absence of 2023 creates a significant gap and limits the dataset’s usefulness for continuous 2017 to 2024 trend analysis.",
      "However, I found no separate data dictionary or methodological guide.",
    ],
    sources: [
      {
        publisher: "City of Ottawa (Open Ottawa)",
        title: "Traffic Collisions by Location 2017–2024 (excluding 2023)",
        url: "https://open.ottawa.ca/datasets/ottawa::traffic-collisions-by-location-2017-2024-excluding-2023/explore?location=45.280000%2C-75.747200%2C1&showTable=true",
        retrievedAt: "2026-09-13",
      },
      {
        publisher: "City of Ottawa (Open Ottawa)",
        title: "Traffic Collisions by Location 2017–2024 (excluding 2023): About",
        url: "https://open.ottawa.ca/datasets/ottawa::traffic-collisions-by-location-2017-2024-excluding-2023/about",
        retrievedAt: "2026-09-13",
      },
      {
        publisher: "City of Ottawa (ArcGIS)",
        title: "Traffic Collisions by Location 2017–2024 (excluding 2023): ISO-19139 Metadata",
        url: "https://www.arcgis.com/sharing/rest/content/items/710b179eba564aa58fbb3f34d5d599d9/info/metadata/metadata.xml?format=default&output=html",
        retrievedAt: "2026-09-13",
      },
      {
        publisher: "City of Ottawa",
        title: "Open Data Licence Version 2.0",
        url: "https://ottawa.ca/en/city-hall/open-transparent-and-accountable-government/open-data/open-data-licence-version-20",
        retrievedAt: "2026-09-13",
      },
    ],
    body: [],
    indexable: true,
    supplied: true,
  },
];

const lorem = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Maecenas faucibus mollis interdum, nulla vitae elit libero, a pharetra augue. Donec ullamcorper nulla non metus auctor fringilla.",
  "Vestibulum id ligula porta felis euismod semper. Cras mattis consectetur purus sit amet fermentum. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum, sed posuere consectetur est at lobortis.",
  "Curabitur blandit tempus porttitor. Nullam quis risus eget urna mollis ornare vel eu leo. Etiam porta sem malesuada magna mollis euismod. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.",
];
const placeholderSource = {
  publisher: "Publisher",
  title: "Dataset or document title",
  // ponytail: reserved example domain and a fixed date so the specimen passes the same source checks as real work.
  url: "https://example.org/",
  period: "Reference period",
  retrievedAt: "2026-09-01",
};

// A layout specimen, not a publication: placeholder text only, never indexable.
export const researchSpecimenPublication: Publication = {
  slug: "example-report",
  reference: "TC-EX-000",
  title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  subtitle:
    "Sed posuere consectetur est at lobortis: vestibulum id ligula porta felis euismod semper.",
  type: "Research Report",
  area: "trade-economic-integration",
  origin: "independent",
  publishedAt: "2026-09-01",
  authors: ["Author Name"],
  summary:
    "A clearly labelled specimen showing how a published report appears and how its evidence, findings, methodology and sources are structured. Placeholder text only.",
  tags: ["Example layout", "Publication structure"],
  sources: [placeholderSource],
  indexable: false,
  specimen: true,
  body: [
    { kind: "heading", text: "Executive summary" },
    { kind: "lede", text: lorem[0] },
    {
      kind: "columns",
      left: [
        { kind: "heading", text: "Key findings" },
        {
          kind: "findings",
          items: [
            {
              lead: "Lorem ipsum dolor sit amet.",
              text: "Consectetur adipiscing elit, integer posuere erat a ante venenatis dapibus.",
            },
            {
              lead: "Maecenas faucibus mollis interdum.",
              text: "Nulla vitae elit libero, a pharetra augue donec ullamcorper.",
            },
            {
              lead: "Vestibulum id ligula porta.",
              text: "Felis euismod semper, cras mattis consectetur purus sit amet.",
            },
          ],
        },
      ],
      right: [
        {
          kind: "figure",
          caption: "Lorem ipsum dolor sit amet (illustrative placeholder, no data).",
          source: "Publisher, dataset, period.",
        },
      ],
    },
    { kind: "heading", number: 1, text: "Lorem ipsum dolor sit amet" },
    { kind: "paragraph", text: lorem[1] },
    { kind: "paragraph", text: lorem[2] },
    {
      kind: "callout",
      text: "Observation. Nullam quis risus eget urna mollis ornare vel eu leo, etiam porta sem malesuada magna.",
    },
    { kind: "heading", number: 2, text: "Methodology" },
    { kind: "paragraph", text: lorem[2] },
    {
      kind: "columns",
      left: [
        { kind: "heading", number: 3, text: "Limitations" },
        {
          kind: "list",
          items: [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "Integer posuere erat a ante venenatis dapibus.",
            "Donec ullamcorper nulla non metus auctor fringilla.",
          ],
        },
      ],
      right: [
        { kind: "heading", number: 4, text: "Sources" },
        { kind: "sources", items: [placeholderSource, placeholderSource, placeholderSource] },
      ],
    },
  ],
};

export const allPublications: Publication[] = [...publications, researchSpecimenPublication];

export function publicationBySlug(slug: string) {
  return allPublications.find((publication) => publication.slug === slug);
}

export function publicationByReference(reference: string) {
  const wanted = reference.toUpperCase();
  return allPublications.find((publication) => publication.reference === wanted);
}
