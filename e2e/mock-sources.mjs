// Stand-in for the Currents News API. Controlled responses keep e2e and visual tests deterministic.
import { createServer } from "node:http";

const port = Number(process.argv[2] ?? 4010);
const rfc3339 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://mock");
  if (url.pathname === "/health") return res.end("ok");
  req.resume();
  req.on("end", () => {
    res.setHeader("Content-Type", "application/json");

    if (url.pathname === "/v2/search") {
      if (req.headers.authorization !== "Bearer playwright-test-key") {
        res.statusCode = 401;
        return res.end(JSON.stringify({ status: "error", msg: "Invalid token" }));
      }

      const query = url.searchParams.get("query") ?? "";
      const startDate = url.searchParams.get("start_date") ?? "";
      const endDate = url.searchParams.get("end_date") ?? "";
      const start = Date.parse(startDate);
      const end = Date.parse(endDate);
      const validWindow =
        rfc3339.test(startDate) &&
        rfc3339.test(endDate) &&
        Number.isFinite(start) &&
        Number.isFinite(end) &&
        end >= start &&
        end - start <= 7 * 24 * 60 * 60 * 1000;
      const validRequest =
        query.includes("Canada") &&
        url.searchParams.get("language") === "en" &&
        url.searchParams.get("type") === "1" &&
        url.searchParams.get("page_number") === "1" &&
        url.searchParams.get("page_size") === "20" &&
        !url.searchParams.has("apiKey") &&
        validWindow;

      if (!validRequest) {
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
          published: new Date(Date.now() - 60 * 60 * 1000)
            .toISOString()
            .replace("T", " ")
            .replace(/\.\d{3}Z$/, " +0000"),
        },
        {
          id: "defence-1",
          title: "Canadian and European defence suppliers expand cooperation",
          description:
            "The industrial agreement covers NATO procurement and security supply chains.",
          url: "https://example-defence.eu/story-defence",
          language: "en",
          category: ["politics_government"],
          published: new Date(Date.now() - 2 * 60 * 60 * 1000)
            .toISOString()
            .replace("T", " ")
            .replace(/\.\d{3}Z$/, " +0000"),
        },
        {
          id: "industry-1",
          title: "Critical minerals partnership links Canadian projects with Europe",
          description: "Energy and mining projects are seeking European industrial partners.",
          url: "https://example-industry.eu/story-industry",
          language: "en",
          category: ["environment", "economy_business_finance"],
          published: new Date(Date.now() - 3 * 60 * 60 * 1000)
            .toISOString()
            .replace("T", " ")
            .replace(/\.\d{3}Z$/, " +0000"),
        },
        {
          id: "tech-1",
          title: "Canada and Europe discuss strategic technology cooperation",
          description: "AI, cyber and semiconductor research are part of the talks.",
          url: "https://example-tech.eu/story-technology",
          language: "en",
          category: ["science_technology"],
          published: new Date(Date.now() - 4 * 60 * 60 * 1000)
            .toISOString()
            .replace("T", " ")
            .replace(/\.\d{3}Z$/, " +0000"),
        },
      ];
      return res.end(JSON.stringify({ status: "ok", page: 1, next_cursor: null, news: samples }));
    }

    res.statusCode = 404;
    res.end("{}");
  });
}).listen(port, "127.0.0.1");
