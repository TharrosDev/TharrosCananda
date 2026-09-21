/** The four research areas that organize both commissioned work and Tharros-produced research. */
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
  },
  {
    slug: "defence-security",
    name: "Defence & Security",
    scope: "Defence procurement, defence industry, SAFE, NATO/EU connections and strategic cooperation.",
    questions: [
      "Which Canadian suppliers are positioned for European defence programmes?",
      "How are procurement frameworks on both sides evolving?",
      "Where do defence-industrial partnerships already exist?",
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
  },
  {
    slug: "technology-strategic-industries",
    name: "Technology & Strategic Industries",
    scope: "AI, cyber, space, telecommunications, semiconductors and research cooperation.",
    questions: [
      "Which Canadian and European organizations lead in a technology segment?",
      "How do AI and digital policy differ in ways that affect market entry?",
      "Where is research cooperation turning into commercial activity?",
    ],
  },
] as const;

export type ResearchArea = (typeof researchAreas)[number];
