/** Single source of truth for services, the services page, the home index and research-request prefill. */
export const services = [
  {
    slug: "custom-research",
    name: "Custom & Partner Research",
    flagship: true,
    question:
      "Research on a Canada–Europe question you define, or research capacity behind your own client work.",
  },
  {
    slug: "market-assessment",
    name: "Market Assessment",
    flagship: false,
    question:
      "How a market is structured in Canada or Europe, who already competes in it and what deserves a closer look.",
  },
  {
    slug: "buyer-partner-research",
    name: "Buyer & Partner Research",
    flagship: false,
    question:
      "Which organizations could realistically buy, distribute, integrate or partner on what you offer.",
  },
] as const;

export type Service = (typeof services)[number];
export type ServiceSlug = Service["slug"];
export const notSureNeed = "Not sure yet" as const;
export const researchNeeds = [...services.map((service) => service.name), notSureNeed] as const;
export type ResearchNeed = Service["name"] | typeof notSureNeed;

export function serviceBySlug(slug: unknown): Service | undefined {
  return typeof slug === "string" ? services.find((service) => service.slug === slug) : undefined;
}
