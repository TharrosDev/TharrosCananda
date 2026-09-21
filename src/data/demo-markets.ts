import { demoSource } from "@/data/sources";
import type { DemoMarketResult } from "@/types/market";

export const demoMarkets: DemoMarketResult[] = [
  {
    slug: "industrial-led-lighting",
    query: "Industrial LED lighting",
    hsCode: "9405.11",
    hsDescription: "Electric ceiling or wall lighting fittings designed for use solely with LED sources",
    country: "Germany",
    unit: "Illustrative index (2020 = 100)",
    trend: [
      { year: "2020", value: 100 },
      { year: "2021", value: 111 },
      { year: "2022", value: 127 },
      { year: "2023", value: 134 },
      { year: "2024", value: 146 },
    ],
    provinces: [
      { province: "Ontario", value: 42 },
      { province: "Quebec", value: 24 },
      { province: "British Columbia", value: 18 },
      { province: "Alberta", value: 11 },
    ],
    routes: [
      {
        name: "Distributor",
        fit: "Strong signal",
        rationale: "A practical route where specification, installation and after-sales support matter.",
      },
      {
        name: "Direct B2B",
        fit: "Worth testing",
        rationale: "May fit suppliers with a defined industrial or institutional buyer segment.",
      },
      {
        name: "E-commerce",
        fit: "Context dependent",
        rationale: "Requires a clear position on certification, fulfilment and technical support.",
      },
    ],
    resources: [
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
    source: demoSource,
    interpretation:
      "This structure is designed to connect a trade signal to geographic concentration, routes to market and the official resources needed for the next investigation.",
    limitations: [
      "Values are synthetic and do not represent current Canadian imports.",
      "An HS heading may include products that differ from your specific offer.",
      "A market signal is not proof of accessible demand or product compliance.",
    ],
  },
  {
    slug: "specialty-food-packaging",
    query: "Specialty food packaging",
    hsCode: "3923.10",
    hsDescription: "Boxes, cases, crates and similar articles of plastics",
    country: "Italy",
    unit: "Illustrative index (2020 = 100)",
    trend: [
      { year: "2020", value: 100 },
      { year: "2021", value: 106 },
      { year: "2022", value: 119 },
      { year: "2023", value: 116 },
      { year: "2024", value: 129 },
    ],
    provinces: [
      { province: "Ontario", value: 39 },
      { province: "Quebec", value: 27 },
      { province: "British Columbia", value: 16 },
      { province: "Alberta", value: 10 },
    ],
    routes: [
      {
        name: "Direct B2B",
        fit: "Strong signal",
        rationale: "Useful where the offer is specified directly by a food producer or contract packer.",
      },
      {
        name: "Distributor",
        fit: "Worth testing",
        rationale: "Can reduce commercial reach and inventory friction across a wide geography.",
      },
      {
        name: "Marketplace",
        fit: "Context dependent",
        rationale: "More suitable for standardized stock formats than custom industrial supply.",
      },
    ],
    resources: [
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
    source: demoSource,
    interpretation:
      "The category needs separation between standardized packaging demand and bespoke commercial relationships before a route can be prioritized.",
    limitations: [
      "Values are synthetic and do not represent current Canadian imports.",
      "The HS example is broader than food-contact packaging alone.",
      "Food-contact, labelling and environmental requirements require product-specific review.",
    ],
  },
];

const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");

export function findDemoMarket(input: string): DemoMarketResult | null {
  const normalized = normalize(input);
  if (!normalized) return null;

  return (
    demoMarkets.find(
      (market) =>
        normalize(market.query).includes(normalized) ||
        normalized.includes(normalize(market.query)) ||
        market.hsCode.replace(".", "").startsWith(normalized.replace(".", "")),
    ) ?? null
  );
}
