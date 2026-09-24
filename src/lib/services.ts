/** What can be commissioned: the commission page, the home index and research-request prefill read this. */
export const services = [
  {
    slug: "custom-research",
    name: "Custom & Partner Research",
    question:
      "Research on a Canada–Europe question you define, or research capacity behind your own client work.",
    deliverables: [
      "A written report answering the agreed question",
      "Executive summary and key findings",
      "Source register with stated limitations",
    ],
  },
  {
    slug: "market-assessment",
    name: "Market Assessment",
    question:
      "How a market is structured in Canada or Europe, who already competes in it and what deserves a closer look.",
    deliverables: [
      "Market structure and size from public data",
      "Map of incumbents and competitors",
      "Segments that merit a closer look",
    ],
  },
  {
    slug: "buyer-partner-research",
    name: "Buyer & Partner Research",
    question:
      "Which organizations could realistically buy, distribute, integrate or partner on what you offer.",
    deliverables: [
      "Ranked list of candidate organizations",
      "Fit rationale for each entry",
      "A public source behind every entry",
    ],
  },
] as const;

/** Shown wherever commissioning is offered: commissioned work belongs to the client, so the public archive does not reflect it. */
export const commissionPrivacy =
  "Commissioned work stays private to the client who commissioned it and is published only if that client asks.";

/** The commissioning sequence, shown on the services page and How it works. */
export const commissionSteps = [
  ["Describe the question", "The subject, what you need to know and the decision it supports."],
  ["Agree the scope", "A written reply with deliverable, sources, exclusions, price and timing."],
  [
    "Research and verify",
    "Public sources are collected with provenance; findings are checked by hand.",
  ],
  [
    "Receive the findings",
    "A concise output with linked sources, stated limitations and open questions.",
  ],
] as const;

/** The commissioning boundary, shown on How it works and About. */
export const provides = [
  "Market, buyer and competitor research",
  "Sector, policy and industry analysis",
  "Public-source data with provenance",
] as const;
export const doesNotProvide = [
  "Legal, tax or regulatory advice",
  "Lobbying or advocacy",
  "Investment advice",
  "Customs brokerage or compliance determinations",
] as const;

export type Service = (typeof services)[number];
export type ServiceSlug = Service["slug"];
export const notSureNeed = "Not sure yet" as const;
export const researchNeeds = [...services.map((service) => service.name), notSureNeed] as const;
export type ResearchNeed = Service["name"] | typeof notSureNeed;

export function serviceBySlug(slug: unknown): Service | undefined {
  return typeof slug === "string" ? services.find((service) => service.slug === slug) : undefined;
}
