export const publicSources = [
  {
    region: "Canada",
    publisher: "Statistics Canada",
    seat: "Ottawa",
    purpose:
      "Aggregate trade, industry, economic and demographic data; WDS provides machine-readable series and metadata.",
    url: "https://www.statcan.gc.ca/en/developers/wds",
    access: "API",
  },
  {
    region: "Canada",
    publisher: "Innovation, Science and Economic Development Canada",
    seat: "Ottawa",
    purpose: "Canadian Importers Database and public business and industry intelligence.",
    url: "https://ised-isde.canada.ca/site/ised/en/research-and-business-intelligence/canadian-importers-database",
    access: "Public database",
  },
  {
    region: "Canada",
    publisher: "Canada Border Services Agency",
    seat: "Ottawa",
    purpose: "Customs tariff, classification material and importer guidance.",
    url: "https://www.cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/menu-eng.html",
    access: "Public guidance",
  },
  {
    region: "Canada",
    publisher: "Government of Canada Open Data",
    seat: "Ottawa",
    purpose:
      "Federal dataset discovery and machine-readable metadata across departments and agencies.",
    url: "https://open.canada.ca/en/access-our-application-programming-interface-api",
    access: "CKAN API",
  },
  {
    region: "Canada",
    publisher: "CanadaBuys",
    seat: "Gatineau",
    purpose: "Federal tender notices, awards, contract history and procurement datasets.",
    url: "https://canadabuys.canada.ca/en/procurement-and-contracting-data",
    access: "Open data",
  },
  {
    region: "Provincial & municipal",
    publisher: "Ontario Data Catalogue",
    seat: "Toronto",
    purpose: "Provincial datasets and metadata from Ontario ministries and agencies.",
    url: "https://data.ontario.ca/",
    access: "CKAN API",
  },
  {
    region: "Provincial & municipal",
    publisher: "City of Ottawa Open Data",
    seat: "Ottawa",
    purpose:
      "Municipal datasets, including traffic collisions, as ArcGIS feature layers and CSV, GeoJSON or KML downloads.",
    url: "https://open.ottawa.ca/",
    access: "Open data portal",
  },
  {
    region: "Europe",
    publisher: "Eurostat",
    seat: "Luxembourg",
    purpose:
      "EU statistical data, including international trade, industry, economy and demographic indicators.",
    url: "https://ec.europa.eu/eurostat/web/user-guides/data-browser/api-data-access",
    access: "REST / SDMX API",
  },
  {
    region: "Europe",
    publisher: "Tenders Electronic Daily (TED)",
    seat: "Luxembourg",
    purpose: "Published EU public-procurement notices for search, retrieval and reuse.",
    url: "https://docs.ted.europa.eu/api/latest/search.html",
    access: "Search API",
  },
  {
    region: "Europe",
    publisher: "European Commission Access2Markets",
    seat: "Brussels",
    purpose:
      "Tariffs, rules of origin, procedures and market-access information for goods, services and procurement.",
    url: "https://trade.ec.europa.eu/access-to-markets/en/my-trade-assistant",
    access: "Public database",
  },
] as const;

export type PublicSource = (typeof publicSources)[number];

export type Seat = PublicSource["seat"];

/**
 * Where the listed publishers are based, placed on the Atlantic map frame (orthographic, centred 30°N 35°W: the
 * homepage map's projection, solved from its Ottawa and Brussels anchors). Every seat above must belong to a place;
 * tests/methodology.test.ts checks it.
 */
export const seatPlaces = [
  { key: "ottawa", name: "Ottawa–Gatineau", seats: ["Ottawa", "Gatineau"], x: 67.1, y: 235.5 },
  { key: "toronto", name: "Toronto", seats: ["Toronto"], x: 36.1, y: 242.9 },
  { key: "brussels", name: "Brussels", seats: ["Brussels"], x: 616.2, y: 186.4 },
  { key: "luxembourg", name: "Luxembourg", seats: ["Luxembourg"], x: 632.8, y: 194.0 },
] as const satisfies readonly {
  key: string;
  name: string;
  seats: readonly Seat[];
  x: number;
  y: number;
}[];
