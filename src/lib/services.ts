/** Single source of truth for services, service pages and research-request prefill. */
export const buyerIntelligenceTiers = [
  {
    name: "Core",
    maxTargets: 10,
    price: "C$295",
    bestFor: "A focused shortlist for a company validating a Canadian opportunity.",
  },
  {
    name: "Expanded",
    maxTargets: 20,
    price: "C$495",
    bestFor: "Broader coverage across buyer types, provinces or channels.",
  },
  {
    name: "Comprehensive",
    maxTargets: 30,
    price: "C$695",
    bestFor: "A wider market-development effort requiring a larger qualified universe.",
  },
] as const;

export const services = [
  {
    slug: "market-scan",
    name: "Canada / Europe Market Scan",
    priceLabel: "Indicative C$250–400",
    priceFrom: "From C$250",
    group: "Defined research",
    homeFeatured: true,
    flagship: false,
    question:
      "How is your target market structured in Canada or Europe, and what deserves a closer look?",
    outputs: [
      "Market structure and official demand or trade signals where available",
      "Customer groups, geographic concentration and routes to market",
      "Competitors, relevant organizations and open questions requiring verification",
    ],
    excludes:
      "Legal or tariff rulings, regulatory-compliance determinations, and demand forecasts presented as fact.",
    formSummary: "Market structure, signals, geography and channels in Canada or Europe.",
  },
  {
    slug: "buyer-distributor",
    name: "Canadian Buyer Intelligence",
    priceLabel: "Core C$295 · Expanded C$495 · Comprehensive C$695",
    priceFrom: "From C$295",
    group: "Defined research",
    homeFeatured: true,
    flagship: true,
    question:
      "Which Canadian organizations could realistically buy, import, distribute or integrate your product?",
    outputs: [
      "Manually qualified organizations with location, website and business type",
      "A fit rationale and public evidence for each target",
      "Decision-maker or contact research where publicly available",
    ],
    excludes: "Introductions, outreach on your behalf, guaranteed interest or padded lead lists.",
    formSummary:
      "A manually verified set of relevant Canadian buyers, distributors, retailers, integrators or partners.",
  },
  {
    slug: "competitor-intelligence",
    name: "Competitor Intelligence",
    priceLabel: "Indicative C$300–600",
    priceFrom: "From C$300",
    group: "Defined research",
    homeFeatured: true,
    flagship: false,
    question:
      "Who already sells a comparable product in your Canadian or European market, and how are they positioned?",
    outputs: [
      "Competitor and offer landscape",
      "Positioning, geography, channels and visible pricing signals",
      "Supporting sources, with observations and analyst inferences separated",
    ],
    excludes:
      "Non-public information, market-share estimates presented as fact, and legal assessments.",
    formSummary:
      "Offerings, positioning, geography, channels, visible pricing and recent activity.",
  },
  {
    slug: "partner-ecosystem",
    name: "Partner & Ecosystem Research",
    priceLabel: "Quoted by scope",
    priceFrom: "Quoted",
    group: "Custom & partner research",
    homeFeatured: false,
    flagship: false,
    question:
      "Which distributors, suppliers, institutions, primes or associations matter to your Canada–Europe question?",
    outputs: [
      "Relevant organizations and actors on either side of the Atlantic",
      "Role, relevance and relationship mapping",
      "Sources and stated confidence or uncertainty where evidence is incomplete",
    ],
    excludes:
      "Introductions, endorsement claims, non-public relationship data or guaranteed partnership outcomes.",
    formSummary: "Relevant organizations and ecosystem actors with sourced fit rationale.",
  },
  {
    slug: "commissioned-research",
    name: "Commissioned Research",
    priceLabel: "Quoted per scope",
    priceFrom: "Quoted",
    group: "Custom & partner research",
    homeFeatured: true,
    flagship: false,
    question: "What does the available evidence say about a specific Canada–Europe question?",
    outputs: [
      "A written scope agreed before work starts",
      "Sourced findings with fact, interpretation and uncertainty kept distinct",
      "Stated limitations and the questions that remain open",
    ],
    excludes: "Legal, tax, regulatory, lobbying, investment or other licensed professional advice.",
    formSummary: "A custom Canada–Europe question across the four research pillars.",
  },
  {
    slug: "white-label-research",
    name: "White-label Research",
    priceLabel: "Project or recurring arrangement",
    priceFrom: "Arranged",
    group: "Custom & partner research",
    homeFeatured: false,
    flagship: false,
    question:
      "Does your firm need research capacity behind a client engagement, without hiring in-house analysts?",
    outputs: [
      "Research adapted to the partner firm's agreed scope and deliverable format",
      "Company mapping, background research, data notes or recurring research updates",
      "Source records, limitations and hand-off material suitable for partner workflows",
    ],
    excludes:
      "Claims of partnership, client ownership or endorsement beyond the actual engagement.",
    formSummary:
      "External research capacity for consultancies, export advisers and professional firms.",
  },
] as const;

export const serviceGroups = [
  { name: "Defined research", description: "Fixed starting points for common market questions." },
  {
    name: "Custom & partner research",
    description: "Scoped work for broader questions and external research support.",
  },
] as const;

export type Service = (typeof services)[number];
export type ServiceSlug = Service["slug"];
export const notSureNeed = "Not sure yet" as const;
export const researchNeeds = [...services.map((service) => service.name), notSureNeed] as const;
export type ResearchNeed = Service["name"] | typeof notSureNeed;
export const pricingTerms =
  "Defined services show indicative or founding prices. Scope, price and timing are confirmed in writing before work starts.";

export function serviceBySlug(slug: unknown): Service | undefined {
  return typeof slug === "string" ? services.find((service) => service.slug === slug) : undefined;
}
export function needSummary(need: string) {
  return (
    services.find((service) => service.name === need)?.formSummary ??
    "Tharros will suggest the smallest useful starting point."
  );
}
