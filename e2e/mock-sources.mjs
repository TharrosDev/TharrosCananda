// Stand-in for Statistics Canada WDS, Open Government catalogue and GDELT DOC API.
// Recorded/controlled responses keep e2e and visual tests deterministic.
import { createServer } from "node:http";
import { readFileSync } from "node:fs";

const port = Number(process.argv[2] ?? 4010);
const load = (name) => JSON.parse(readFileSync(new URL(`../tests/fixtures/${name}.json`, import.meta.url), "utf8"));
const metadata = load("statcan/getCubeMetadata");
const pools = { getDataFromCubePidCoordAndLatestNPeriods: load("statcan/getDataFromCubePidCoordAndLatestNPeriods"), getSeriesInfoFromCubePidCoord: load("statcan/getSeriesInfoFromCubePidCoord") };
const openData = load("open-data-search");
const gdeltStamp = (hoursAgo) => new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://mock");
  if (url.pathname === "/health") return res.end("ok");
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    res.setHeader("Content-Type", "application/json");
    const method = url.pathname.split("/").pop();

    if (url.pathname === "/api/v2/doc/doc") {
      const query = url.searchParams.get("query") ?? "";
      const topic = query.includes("NATO") ? "defence" : query.includes("critical minerals") ? "industry" : query.includes("artificial intelligence") ? "technology" : "trade";
      const samples = {
        trade: [
          ["Canada and European firms deepen transatlantic trade links", "example-trade.eu", "Germany", "English", 1],
          ["CETA businesses review new export opportunities", "example-commerce.ca", "Canada", "English", 8],
        ],
        defence: [
          ["Canadian and European defence suppliers expand cooperation", "example-defence.eu", "Belgium", "English", 2],
          ["NATO industrial talks bring Canadian and European firms together", "example-security.ca", "Canada", "English", 10],
        ],
        industry: [
          ["Critical minerals partnership links Canadian projects with Europe", "example-industry.eu", "France", "English", 3],
          ["European manufacturers examine Canadian clean energy supply", "example-energy.ca", "Canada", "English", 12],
        ],
        technology: [
          ["Canada and Europe discuss strategic technology cooperation", "example-tech.eu", "Netherlands", "English", 4],
          ["Canadian AI companies look to European research partnerships", "example-ai.ca", "Canada", "English", 14],
        ],
      };
      return res.end(JSON.stringify({
        articles: samples[topic].map(([title, domain, sourcecountry, language, hoursAgo], index) => ({
          title,
          domain,
          sourcecountry,
          language,
          seendate: gdeltStamp(hoursAgo),
          url: "https://" + domain + "/story-" + topic + "-" + index,
        })),
      }));
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
