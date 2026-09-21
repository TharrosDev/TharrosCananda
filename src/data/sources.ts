export const publicSources = [
  {
    region: "Canada",
    publisher: "Statistics Canada",
    purpose: "Aggregate trade, industry, economic and demographic data; WDS provides machine-readable series and metadata.",
    url: "https://www.statcan.gc.ca/en/developers/wds",
    access: "API",
  },
  {
    region: "Canada",
    publisher: "Innovation, Science and Economic Development Canada",
    purpose: "Canadian Importers Database and public business and industry intelligence.",
    url: "https://ised-isde.canada.ca/site/ised/en/research-and-business-intelligence/canadian-importers-database",
    access: "Public database",
  },
  {
    region: "Canada",
    publisher: "Canada Border Services Agency",
    purpose: "Customs tariff, classification material and importer guidance.",
    url: "https://www.cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/menu-eng.html",
    access: "Public guidance",
  },
  {
    region: "Canada",
    publisher: "Government of Canada Open Data",
    purpose: "Federal dataset discovery and machine-readable metadata across departments and agencies.",
    url: "https://open.canada.ca/en/access-our-application-programming-interface-api",
    access: "CKAN API",
  },
  {
    region: "Canada",
    publisher: "CanadaBuys",
    purpose: "Federal tender notices, awards, contract history and procurement datasets.",
    url: "https://canadabuys.canada.ca/en/procurement-and-contracting-data",
    access: "Open data",
  },
  {
    region: "Europe",
    publisher: "Eurostat",
    purpose: "EU statistical data, including international trade, industry, economy and demographic indicators.",
    url: "https://ec.europa.eu/eurostat/web/user-guides/data-browser/api-data-access",
    access: "REST / SDMX API",
  },
  {
    region: "Europe",
    publisher: "Tenders Electronic Daily (TED)",
    purpose: "Published EU public-procurement notices for search, retrieval and reuse.",
    url: "https://docs.ted.europa.eu/api/latest/search.html",
    access: "Search API",
  },
  {
    region: "Europe",
    publisher: "European Commission Access2Markets",
    purpose: "Tariffs, rules of origin, procedures and market-access information for goods, services and procurement.",
    url: "https://trade.ec.europa.eu/access-to-markets/en/my-trade-assistant",
    access: "Public database",
  },
] as const;

export type PublicSource = (typeof publicSources)[number];
