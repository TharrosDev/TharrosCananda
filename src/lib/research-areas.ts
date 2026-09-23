/** The expertise areas that organize commissioned work and future Tharros-produced research. */
export const researchAreas = [
  {
    slug: "trade-economic-integration",
    name: "Trade & Economic Integration",
    scope: "Trade, investment, CETA, market access, digital trade and supply chains.",
    questions: [
      "Where is Canada–EU trade growing for a given product or sector?",
      "How does CETA treatment affect a specific route to market?",
      "Which supply chains link Canadian and European producers?",
    ],
    evidence: [
      "Official trade tables and classifications",
      "Tariff and market-access documentation",
      "Company and supply-chain evidence",
    ],
  },
  {
    slug: "defence-security",
    name: "Defence & Security",
    scope:
      "Defence procurement, defence industry, SAFE, NATO/EU connections and strategic cooperation.",
    questions: [
      "Which Canadian suppliers are positioned for European defence programmes?",
      "How are procurement frameworks on both sides evolving?",
      "Where do defence-industrial partnerships already exist?",
    ],
    evidence: [
      "Procurement and award notices",
      "Programme and budget documentation",
      "Company and industrial-base records",
    ],
  },
  {
    slug: "energy-resources-industry",
    name: "Energy, Resources & Industry",
    scope: "Critical minerals, energy, manufacturing, infrastructure and industrial policy.",
    questions: [
      "Which critical-mineral projects connect Canadian supply to European demand?",
      "How do industrial policies on each side shape investment decisions?",
      "Who are the active buyers, processors and offtakers in a segment?",
    ],
    evidence: [
      "Project and production data",
      "Industrial-policy and infrastructure records",
      "Corporate filings and company announcements",
    ],
  },
  {
    slug: "technology-strategic-industries",
    name: "Technology & Strategic Industries",
    scope: "AI, cyber, space, telecommunications, semiconductors and research cooperation.",
    questions: [
      "Which Canadian and European organizations lead in a technology segment?",
      "How do AI and digital policy differ in ways that affect market entry?",
      "Where is research cooperation producing practical applications?",
    ],
    evidence: [
      "Public company and funding records",
      "Research and programme documentation",
      "Policy, procurement and ecosystem data",
    ],
  },
  {
    slug: "data-quality-validity",
    name: "Data Quality & Validity",
    scope:
      "Public and open datasets: provenance, coverage, gaps, licensing and whether they are fit for a given use.",
    questions: [
      "Can a public dataset support the analysis it is being used for?",
      "Where are the gaps, breaks and definitional changes in a series?",
      "What do the licence and collection method allow and rule out?",
    ],
    evidence: [
      "Dataset metadata and data dictionaries",
      "Collection and methodology documentation",
      "Open-data licences and publisher notes",
    ],
  },
] as const;

export type ResearchArea = (typeof researchAreas)[number];
