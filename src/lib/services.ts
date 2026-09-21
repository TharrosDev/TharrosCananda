/** Single source of truth for the commercial research offers, the service pages and the request form. */
export const services = [
  {
    slug: "market-scan",
    name: "Canada Market Scan",
    priceLabel: "Indicative C$250–400",
    question: "Is there a Canadian market worth investigating for this product, and how is it structured?",
    outputs: [
      "Market structure and trade indicators from official sources where available",
      "Customer segments and geographic concentration",
      "Channel, competitor and commercial observations, with open questions",
    ],
    excludes: "Tariff rulings, regulatory or compliance determinations, and demand forecasts.",
    formSummary: "Structure, demand signals, geography, channels and commercial context.",
  },
  {
    slug: "buyer-distributor",
    name: "Buyer & Distributor Intelligence",
    priceLabel: "Indicative C$300–750",
    question: "Which Canadian organizations could buy, import or distribute this product?",
    outputs: [
      "Company, location, website and business type",
      "Why each organization may be relevant",
      "Public evidence and decision-maker information where publicly available",
    ],
    excludes: "Introductions, outreach on your behalf, guaranteed interest or purchased contact lists.",
    formSummary: "A manually verified set of relevant Canadian organizations.",
  },
  {
    slug: "competitor-intelligence",
    name: "Competitor Intelligence",
    priceLabel: "Indicative C$300–600",
    question: "Who already sells a comparable offer in Canada, and how do they position it?",
    outputs: [
      "Competitor and offer landscape",
      "Channel, geography and pricing indicators",
      "Supporting sources, with observations and inferences labelled separately",
    ],
    excludes: "Non-public information, market-share estimates presented as fact, and legal assessments.",
    formSummary: "Offerings, positioning, geography, channels and evidence.",
  },
  {
    slug: "commissioned-research",
    name: "Commissioned Research",
    priceLabel: "Quoted per scope",
    question: "Any commercially relevant Canada–Europe question outside the standard products.",
    outputs: [
      "A written scope agreed before work starts",
      "Sourced findings, with observation and inference kept separate",
      "Stated limitations and the questions that remain open",
    ],
    excludes: "Legal, tax, regulatory, lobbying or investment advice.",
    formSummary: "A custom question in any of the four research areas.",
  },
] as const;

export type Service = (typeof services)[number];
export type ServiceSlug = Service["slug"];

export const notSureNeed = "Not sure yet" as const;
export const researchNeeds = [...services.map((service) => service.name), notSureNeed] as const;
export type ResearchNeed = Service["name"] | typeof notSureNeed;

export const pricingTerms =
  "Prices are indicative. Scope, price and timeline are confirmed in writing before any work starts; work begins only after you approve it.";

export function serviceBySlug(slug: unknown): Service | undefined {
  return typeof slug === "string" ? services.find((service) => service.slug === slug) : undefined;
}

export function needSummary(need: string) {
  return services.find((service) => service.name === need)?.formSummary ?? "Tharros will suggest the smallest useful starting point.";
}
