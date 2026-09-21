import { demoSource } from "@/data/sources";
import type { MarketDataProvider, MarketResult } from "@/types/market";

const sample = [demoSource.id];
const syntheticValues = "Values are synthetic and do not represent current Canadian imports.";

export const demoMarkets: MarketResult[] = [
  {
    status: "demo",
    slug: "industrial-led-lighting",
    query: "Industrial LED lighting",
    hsCode: "9405.11",
    hsDescription: "Electric ceiling or wall lighting fittings designed for use solely with LED sources",
    trend: {
      sourceIds: sample,
      unit: "Illustrative index (2020 = 100)",
      points: [
        { year: "2020", value: 100 },
        { year: "2021", value: 111 },
        { year: "2022", value: 127 },
        { year: "2023", value: 134 },
        { year: "2024", value: 146 },
      ],
      limitations: [syntheticValues],
    },
    provinces: {
      sourceIds: sample,
      unit: "Illustrative share of value (%)",
      shares: [
        { province: "Ontario", value: 42 },
        { province: "Quebec", value: 24 },
        { province: "British Columbia", value: 18 },
        { province: "Alberta", value: 11 },
      ],
      limitations: ["Provincial shares are illustrative and do not reflect where goods are ultimately used."],
    },
    routes: {
      sourceIds: sample,
      items: [
        {
          name: "Distributor",
          question: "How much do specification, installation and after-sales support shape buying decisions?",
        },
        {
          name: "Direct B2B",
          question: "Is there a defined industrial or institutional buyer segment that purchases directly?",
        },
        {
          name: "E-commerce",
          question: "What would certification, fulfilment and technical support require for online sales?",
        },
      ],
    },
    resources: {
      sourceIds: sample,
      items: [
        {
          label: "Canadian customs tariff",
          url: "https://www.cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/menu-eng.html",
          publisher: "CBSA",
        },
        {
          label: "Canadian Importers Database",
          url: "https://ised-isde.canada.ca/site/ised/en/research-and-business-intelligence/canadian-importers-database",
          publisher: "ISED",
        },
        {
          label: "CETA rules of origin",
          url: "https://www.international.gc.ca/trade-commerce/trade-agreements-accords-commerciaux/agr-acc/ceta-aecg/text-texte/P1.aspx?lang=eng",
          publisher: "Global Affairs Canada",
        },
      ],
    },
    sources: [demoSource],
    interpretation:
      "This sample shows how a trade signal can be read alongside geographic concentration, possible routes to market and the official resources a real investigation would start from.",
    limitations: [
      "An HS heading may include products that differ from your specific offer.",
      "A market signal is not proof of accessible demand or product compliance.",
    ],
  },
  {
    status: "demo",
    slug: "specialty-food-packaging",
    query: "Specialty food packaging",
    hsCode: "3923.10",
    hsDescription: "Boxes, cases, crates and similar articles of plastics",
    trend: {
      sourceIds: sample,
      unit: "Illustrative index (2020 = 100)",
      points: [
        { year: "2020", value: 100 },
        { year: "2021", value: 106 },
        { year: "2022", value: 119 },
        { year: "2023", value: 116 },
        { year: "2024", value: 129 },
      ],
      limitations: [syntheticValues],
    },
    provinces: {
      sourceIds: sample,
      unit: "Illustrative share of value (%)",
      shares: [
        { province: "Ontario", value: 39 },
        { province: "Quebec", value: 27 },
        { province: "British Columbia", value: 16 },
        { province: "Alberta", value: 10 },
      ],
      limitations: ["Provincial shares are illustrative and do not reflect where goods are ultimately used."],
    },
    routes: {
      sourceIds: sample,
      items: [
        {
          name: "Direct B2B",
          question: "Is the packaging specified directly by food producers or contract packers?",
        },
        {
          name: "Distributor",
          question: "Would a distributor reduce reach and inventory friction across a wide geography?",
        },
        {
          name: "Marketplace",
          question: "Are standardized stock formats relevant, or is supply mostly custom?",
        },
      ],
    },
    resources: {
      sourceIds: sample,
      items: [
        {
          label: "Packaging and labelling requirements",
          url: "https://inspection.canada.ca/en/food-labels/labelling/industry",
          publisher: "CFIA",
        },
        {
          label: "Canadian Importers Database",
          url: "https://ised-isde.canada.ca/site/ised/en/research-and-business-intelligence/canadian-importers-database",
          publisher: "ISED",
        },
        {
          label: "Canada tariff finder",
          url: "https://www.tariffinder.ca/en/",
          publisher: "Government of Canada",
        },
      ],
    },
    sources: [demoSource],
    interpretation:
      "This sample shows why standardized packaging demand and bespoke commercial relationships need to be separated before any route can be compared.",
    limitations: [
      "The HS example is broader than food-contact packaging alone.",
      "Food-contact, labelling and environmental requirements require product-specific review.",
    ],
  },
];

const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");

export function findDemoMarket(input: string): MarketResult | null {
  const normalized = normalize(input);
  if (!normalized) return null;
  const digits = normalized.replace(/[.\s]/g, "");

  return (
    demoMarkets.find(
      (market) =>
        normalize(market.query).includes(normalized) ||
        normalized.includes(normalize(market.query)) ||
        (/^\d{4,}$/.test(digits) && market.hsCode.replace(".", "").startsWith(digits)),
    ) ?? null
  );
}

export const demoProvider: MarketDataProvider = {
  status: "demo",
  listSamples: () => demoMarkets,
  async search(query) {
    const result = findDemoMarket(query);
    return result ? { kind: "found", result } : { kind: "not-found", query: query.trim() };
  },
};
