import type { SourceMetadata } from "@/types/market";

export const publicSources = [
  {
    publisher: "Statistics Canada",
    purpose: "Aggregate trade, industry and economic data",
    url: "https://www.statcan.gc.ca/en/developers/wds",
  },
  {
    publisher: "Innovation, Science and Economic Development Canada",
    purpose: "Canadian Importers Database and trade intelligence",
    url: "https://ised-isde.canada.ca/site/ised/en/research-and-business-intelligence/canadian-importers-database",
  },
  {
    publisher: "Canada Border Services Agency",
    purpose: "Customs tariff and importer guidance",
    url: "https://www.cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/menu-eng.html",
  },
  {
    publisher: "Government of Canada Open Data",
    purpose: "Public datasets and licence information",
    url: "https://open.canada.ca/en/open-government-licence-canada",
  },
] as const;

export const demoSource: SourceMetadata = {
  publisher: "Tharros Canada",
  dataset: "Market Explorer demonstration structure",
  url: "/methodology#demonstration-data",
  period: "Illustrative five-year sequence",
  lastUpdated: "Not applicable — demonstration values",
  retrievedAt: "Not applicable",
  licence: "Demonstration content",
  notes:
    "The figures in this preview are synthetic. They demonstrate the intended output structure and are not current Canadian trade statistics.",
};
