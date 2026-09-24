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
  // No retrieval or access dates on sources (owner's instruction, 2026-09-24).
};

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
  /** Stated limitations, rephrased faithfully from the PDF for the site. */
  limitations?: string[];
  /** Only true for verified, published work. Gates robots, citation_* meta, sitemap and the PDF's X-Robots-Tag. */
  indexable: boolean;
  featured?: boolean;
};

// Verified Tharros Canada research only. Each report is the author's PDF at public/research/<reference>.pdf, served
// byte-for-byte (docs/REPORT_REQUIREMENTS.md).
// Independent work must use origin: "independent". Use "commissioned" only for work actually commissioned by a client and permitted for publication.
export const publications: Publication[] = [
  {
    slug: "canada-inside-safe",
    reference: "TC-2026-002",
    title:
      "Canada Inside SAFE: What Access to Europe’s €150B Defence Initiative Has Cost, and Who’s Gained So Far",
    type: "Research Report",
    area: "defence-security",
    origin: "independent",
    publishedAt: "2026-09-24",
    authors: ["Magnus Abdelnour"],
    // Rephrased from the PDF's "Overview" and "Conclusion".
    summary:
      "What Canada's place in the EU's €150B SAFE defence initiative has cost so far, and which Canadian firms have gained. Canada has paid a €10 million contribution and owes a 15% fee on Canadian content in qualifying contracts, first billed in March 2027. Nine months on, the only public Canadian SAFE contract is Marconi Technologies' order of tactical radios for Poland, worth over C$10 million, and it is too soon to judge whether the agreement has opened the \"massive new opportunities\" the government announced.",
    tags: ["EU SAFE", "Defence procurement", "Canada–EU", "Defence exports"],
    // Rephrased from "What this report cannot show".
    limitations: [
      "Neither the European Commission nor the Canadian government has published a full list of SAFE contract awards, so Canadian contracts may exist that are not yet public.",
      "The 15% participation fee is not calculated until March 2027, so what Canada will pay beyond the initial €10 million is not yet known.",
      "The export data in Tables 1 to 3 comes from before the first SAFE loans were paid out in May 2026, so it shows demand for Canadian exports rather than the effect of SAFE itself.",
      "The search of the EU's TED portal only picks up notices that mention SAFE directly, and many contracts are never publicly advertised.",
    ],
    sources: [
      {
        publisher: "Bank of Canada",
        title: "Daily Exchange Rates",
        url: "https://www.bankofcanada.ca/rates/exchange/daily-exchange-rates/",
      },
      {
        publisher: "Council of the European Union",
        title:
          "SAFE: Council Adopts €150 Billion Boost for Joint Procurement on European Security and Defence",
        url: "https://www.consilium.europa.eu/en/press/press-releases/2025/05/27/safe-council-adopts-150-billion-boost-for-joint-procurement-on-european-security-and-defence/",
      },
      {
        publisher: "Euronews",
        title:
          "Did the EU Charge the UK Billions More Than Canada to Join Its Defence Loan Scheme?",
        url: "https://www.euronews.com/my-europe/2026/02/20/did-the-eu-charge-the-uk-billions-more-than-canada-to-join-its-defence-loan-scheme",
      },
      {
        publisher: "European Commission, Directorate-General for Defence Industry and Space",
        title: "Poland Receives First €6.6 Billion Payment under SAFE",
        url: "https://defence-industry-space.ec.europa.eu/poland-receives-first-eu66-billion-payment-under-safe-2026-05-29_en",
      },
      {
        publisher: "European Commission, Directorate-General for Defence Industry and Space",
        title: "SAFE | Security Action for Europe",
        url: "https://defence-industry-space.ec.europa.eu/eu-defence-industry/safe-security-action-europe_en",
      },
      {
        publisher: "European Parliament",
        title:
          "Security Action for Europe (SAFE) through the Reinforcement of European Defence Industry Instrument",
        url: "https://www.europarl.europa.eu/legislative-train/theme-a-new-era-for-european-defence-and-security/file-security-action-for-europe-(safe)",
      },
      {
        publisher: "Global Affairs Canada",
        title:
          "Agreement between Canada and the European Union Laying Down the Conditions for the Participation of Canadian Legal Entities and Products Originating in Canada to Procurement under the SAFE Instrument",
        url: "https://www.international.gc.ca/world-monde/international_relations-relations_internationales/eu-ue/text-texte.aspx?lang=eng",
      },
      {
        publisher: "Global Affairs Canada",
        title:
          "Agreement between the European Union and Canada Concerning Participation under the SAFE Instrument",
        url: "https://www.international.gc.ca/world-monde/international_relations-relations_internationales/eu-ue/agreement-accord.aspx?lang=eng",
      },
      {
        publisher: "Global Affairs Canada",
        title:
          "Annual Report on Strategic Goods and Technologies Pursuant to Section 27 of the Export and Import Permits Act – 2024",
        url: "https://international.canada.ca/en/global-affairs/corporate/reports/export-import-controls/strategic-goods-2024",
      },
      {
        publisher: "Global Affairs Canada",
        title:
          "Annual Report on Strategic Goods and Technologies Pursuant to Section 27 of the Export and Import Permits Act – 2025",
        url: "https://international.canada.ca/en/global-affairs/corporate/reports/export-import-controls/strategic-goods-2025",
      },
      {
        publisher:
          "Innovation, Science and Economic Development Canada, Statistics Canada, and Canadian Association of Defence and Security Industries",
        title: "State of Canada’s Defence Industry Report – Spring 2026",
        url: "https://ised-isde.canada.ca/site/ised/sites/default/files/documents/State_of_Defence_2026_eng.pdf",
      },
      {
        publisher: "Liam Nohr, Eastern Europe and Transatlantic Network, Carleton University",
        title: "SAFE Is Not So Safe: The Limits of UK–EU Defence Cooperation",
        url: "https://carleton.ca/eetn/wp-content/uploads/sites/44/2026/03/SAFE-is-not-so-Safe-The-Limits-of-UK%E2%80%93EU-Defence-Cooperation.pdf",
      },
      {
        publisher: "Prime Minister of Canada",
        title:
          "Prime Minister Carney Secures Canada’s Participation in the European Union’s SAFE Initiative",
        url: "https://www.pm.gc.ca/en/news/news-releases/2025/12/01/prime-minister-carney-secures-canadas-participation-european-unions",
      },
      {
        publisher: "Prime Minister of Canada",
        title:
          "Prime Minister Carney Secures New Partnerships in Defence and Critical Minerals at the 2026 G7 Leaders’ Summit",
        url: "https://www.pm.gc.ca/en/news/news-releases/2026/06/17/prime-minister-carney-secures-new-partnerships-defence-and-critical",
      },
      {
        publisher: "Publications Office of the European Union",
        title: "Tenders Electronic Daily (TED)",
        url: "https://ted.europa.eu",
      },
    ],
    indexable: true,
  },
  {
    slug: "ottawa-traffic-collisions-2017-2024",
    reference: "TC-2026-001",
    title: "Analytical Report: Traffic Collisions by Location 2017-2024 (excluding 2023)",
    type: "Data Note",
    area: "data-quality-validity",
    origin: "independent",
    publishedAt: "2026-09-16",
    authors: ["Magnus Abdelnour"],
    // Rephrased from the PDF's "Overview" and "Fit for Use Assessment".
    summary:
      "An assessment of the City of Ottawa's open dataset of 94,406 reported traffic collisions from 2017 to 2024, excluding 2023. The data suits analysis of where and how collisions happen and of broad trends, but the missing 2023 year weakens any continuous 2017 to 2024 comparison.",
    tags: ["Ottawa", "Traffic collisions", "Open data", "Fitness for use"],
    // Rephrased from "Quality & Limitations" and "Technical Contents".
    limitations: [
      "The dataset has no 2023 records, which limits continuous 2017 to 2024 trend analysis.",
      "No separate data dictionary or methodological guide was found for the dataset.",
    ],
    sources: [
      {
        publisher: "City of Ottawa (Open Ottawa)",
        title: "Traffic Collisions by Location 2017–2024 (excluding 2023)",
        url: "https://open.ottawa.ca/datasets/ottawa::traffic-collisions-by-location-2017-2024-excluding-2023/explore?location=45.280000%2C-75.747200%2C1&showTable=true",
      },
      {
        publisher: "City of Ottawa (Open Ottawa)",
        title: "Traffic Collisions by Location 2017–2024 (excluding 2023): About",
        url: "https://open.ottawa.ca/datasets/ottawa::traffic-collisions-by-location-2017-2024-excluding-2023/about",
      },
      {
        publisher: "City of Ottawa (ArcGIS)",
        title: "Traffic Collisions by Location 2017–2024 (excluding 2023): ISO-19139 Metadata",
        url: "https://www.arcgis.com/sharing/rest/content/items/710b179eba564aa58fbb3f34d5d599d9/info/metadata/metadata.xml?format=default&output=html",
      },
      {
        publisher: "City of Ottawa",
        title: "Open Data Licence Version 2.0",
        url: "https://ottawa.ca/en/city-hall/open-transparent-and-accountable-government/open-data/open-data-licence-version-20",
      },
    ],
    indexable: true,
  },
];

export function publicationBySlug(slug: string) {
  return publications.find((publication) => publication.slug === slug);
}

export function publicationByReference(reference: string) {
  const wanted = reference.toUpperCase();
  return publications.find((publication) => publication.reference === wanted);
}
