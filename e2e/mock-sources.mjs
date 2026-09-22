// Stand-in for Statistics Canada WDS and the Open Government catalogue, serving recorded responses
// from tests/fixtures so e2e and visual tests are deterministic. Unknown coordinates return FAILED, like the real WDS.
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
