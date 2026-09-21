/** Single source of truth for the commercial research offers, the service pages and the request form. */
export const services = [
  {
    slug: "market-scan",
    name: "Canada Market Scan",
    priceLabel: "C$250–400",
    question: "Is there a Canadian market worth investigating for this product, and how is it structured?",
    description:
      "A focused picture of market structure, trade signals, customer segments, geography, channels and commercial considerations.",
    outputs: [
      "Market structure and trade indicators from official sources where available",
      "Customer segments and geographic concentration",
      "Channel, competitor and commercial observations, with open questions",
    ],
    verification: "The HS reference is checked against your product description (not a customs ruling), and each figure is dated and linked to its publisher.",
    excludes: "Tariff rulings, regulatory or compliance determinations, and demand forecasts.",
    formSummary: "Structure, demand signals, geography, channels and commercial context.",
  },
  {
    slug: "buyer-distributor",
    name: "Buyer & Distributor Intelligence",
    priceLabel: "C$300–750",
    question: "Which Canadian organizations could buy, import or distribute this product?",
    description:
      "A manually researched set of Canadian buyers, importers, distributors, retailers or partners relevant to your offer.",
    outputs: [
      "Company, location, website and business type",
      "Why each organization may be relevant",
      "Public evidence and decision-maker information where publicly available",
    ],
    verification: "Each organization is checked by hand against its own public presence before it is included.",
    excludes: "Introductions, outreach on your behalf, guaranteed interest or purchased contact lists.",
    formSummary: "A manually verified set of relevant Canadian organizations.",
  },
  {
    slug: "competitor-intelligence",
    name: "Competitor Intelligence",
    priceLabel: "C$300–600",
    question: "Who already sells a comparable offer in Canada, and how do they position it?",
    description:
      "A sourced review of Canadian competitors, offerings, positioning, channels, geography and observable commercial signals.",
    outputs: [
      "Competitor and offer landscape",
      "Channel, geography and pricing indicators",
      "Supporting sources, with observations and inferences labelled separately",
    ],
    verification: "Claims are tied to a public source; anything inferred is marked as an inference.",
    excludes: "Non-public information, market-share estimates presented as fact, and legal assessments.",
    formSummary: "Offerings, positioning, geography, channels and evidence.",
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
