// Stand-in for Statistics Canada WDS, Open Government catalogue and Currents News API.
// Recorded/controlled responses keep e2e and visual tests deterministic.
import { createServer } from "node:http";
import { readFileSync } from "node:fs";

const port = Number(process.argv[2] ?? 4010);
const load = (name) => JSON.parse(readFileSync(new URL(`../tests/fixtures/${name}.json`, import.meta.url), "utf8"));
const metadata = load("statcan/getCubeMetadata");
const pools = { getDataFromCubePidCoordAndLatestNPeriods: load("statcan/getDataFromCubePidCoordAndLatestNPeriods"), getSeriesInfoFromCubePidCoord: load("statcan/getSeriesInfoFromCubePidCoord") };
const openData = load("open-data-search");

createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://mock");
  if (url.pathname === "/health") return res.end("ok");
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    res.setHeader("Content-Type", "application/json");
    const method = url.pathname.split("/").pop();

    if (url.pathname === "/v2/search") {
      if (req.headers.authorization !== "Bearer playwright-test-key") {
        res.statusCode = 401;
        return res.end(JSON.stringify({ status: "error", msg: "Invalid token" }));
      }
      if (!url.searchParams.get("query")?.includes("Canada") || !url.searchParams.get("start_date") || !url.searchParams.get("end_date")) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ status: "error", msg: "Invalid parameters" }));
      }
      const samples = [
        {
          id: "trade-1",
          title: "Canada and European firms deepen transatlantic trade links",
          description: "Companies are reviewing investment and export opportunities under CETA.",
          url: "https://example-trade.eu/story-trade",
          language: "en",
          category: ["economy_business_finance"],
          published: new Date(Date.now() - 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\.\d{3}Z$/, " +0000"),
        },
        {
          id: "defence-1",
          title: "Canadian and European defence suppliers expand cooperation",
          description: "The industrial agreement covers NATO procurement and security supply chains.",
          url: "https://example-defence.eu/story-defence",
          language: "en",
          category: ["politics_government"],
          published: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\.\d{3}Z$/, " +0000"),
        },
        {
          id: "industry-1",
          title: "Critical minerals partnership links Canadian projects with Europe",
          description: "Energy and mining projects are seeking European industrial partners.",
          url: "https://example-industry.eu/story-industry",
          language: "en",
          category: ["environment", "economy_business_finance"],
          published: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\.\d{3}Z$/, " +0000"),
        },
        {
          id: "tech-1",
          title: "Canada and Europe discuss strategic technology cooperation",
          description: "AI, cyber and semiconductor research are part of the talks.",
          url: "https://example-tech.eu/story-technology",
          language: "en",
          category: ["science_technology"],
          published: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\.\d{3}Z$/, " +0000"),
        },
      ];
      return res.end(JSON.stringify({ status: "ok", page: 1, next_cursor: null, news: samples }));
    }

    if (url.pathname.endsWith("/package_search")) return res.end(JSON.stringify(openData));
    if (method === "getCubeMetadata") return res.end(JSON.stringify(metadata));
    if (method in pools) {
      const requested = JSON.parse(body || "[]");
      return res.end(JSON.stringify(requested.map(({ coordinate }) =>
        pools[method].find((item) => item.object.coordinate === coordinate) ??
        { status: "FAILED", object: { responseStatusCode: 2, productId: 12100174, coordinate, vectorId: 0, vectorDataPoint: [] } })));
    }
    res.statusCode = 404;
    res.end("{}");
  });
}).listen(port, "127.0.0.1");
