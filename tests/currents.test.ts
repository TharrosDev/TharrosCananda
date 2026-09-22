import { describe, expect, it } from "vitest";
import {
  buildCurrentsQuery,
  CurrentsError,
  fetchCurrentsMonitor,
  inferCurrentsTopics,
  parseCurrentsPayload,
} from "../src/lib/currents";

const news = {
  id: "article-1",
  title: "Canada and Europe expand defence procurement cooperation",
  description: "The agreement includes industrial investment and technology.",
  url: "https://example.com/story?utm_source=test",
  language: "en",
  category: ["politics_government", "economy_business_finance"],
  published: "2026-09-22 04:15:00 +0000",
};

describe("Currents Live Monitor adapter", () => {
  it("builds one Canada-Europe Boolean query spanning the monitor subjects", () => {
    const query = buildCurrentsQuery();
    expect(query).toContain("(Canada OR Canadian)");
    expect(query).toContain('"European Union"');
    expect(query).toContain("CETA");
    expect(query).toContain("NATO");
    expect(query).toContain("critical minerals");
    expect(query).toContain("artificial intelligence");
  });

  it("parses direct article URLs and publication times", () => {
    const parsed = parseCurrentsPayload({ status: "ok", news: [news], page: 1 });
    expect(parsed).toHaveLength(1);
    expect(parsed[0]).toMatchObject({
      id: "article-1",
      title: news.title,
      url: "https://example.com/story",
      domain: "example.com",
      language: "en",
      publishedAt: "2026-09-22T04:15:00.000Z",
    });
    expect(parsed[0].topics).toContain("defence-security");
    expect(parsed[0].topics).toContain("trade-economy");
  });

  it("uses descriptions and canonical Currents categories for local classification", () => {
    expect(inferCurrentsTopics(
      "Canadian research partnership",
      "New semiconductor and AI investment with European partners",
      "SCIENCE_TECHNOLOGY ECONOMY_BUSINESS_FINANCE",
    )).toEqual(["trade-economy", "technology-strategic"]);
  });

  it("uses the free-tier-safe page size, Bearer auth and a strict seven-day RFC3339 window", async () => {
    let requestedUrl = "";
    let auth = "";
    const fetcher = (async (input: RequestInfo | URL, init?: RequestInit) => {
      requestedUrl = String(input);
      auth = new Headers(init?.headers).get("Authorization") ?? "";
      return Response.json({ status: "ok", news: [news], page: 1, next_cursor: null });
    }) as typeof fetch;

    const result = await fetchCurrentsMonitor({
      fetcher,
      baseUrl: "https://currents.test",
      apiKey: "test-secret",
      now: () => new Date("2026-09-22T05:00:00Z"),
    });

    const url = new URL(requestedUrl);
    expect(url.pathname).toBe("/v2/search");
    expect(url.searchParams.get("start_date")).toBe("2026-09-15T05:00:00Z");
    expect(url.searchParams.get("end_date")).toBe("2026-09-22T05:00:00Z");
    expect(url.searchParams.get("page_size")).toBe("20");
    expect(url.searchParams.get("page_number")).toBe("1");
    expect(url.searchParams.get("language")).toBe("en");
    expect(url.searchParams.get("type")).toBe("1");
    expect(url.searchParams.has("apiKey")).toBe(false);
    expect(auth).toBe("Bearer test-secret");
    expect(result.articles).toHaveLength(1);
  });

  it("fails clearly when the server key is missing", async () => {
    await expect(fetchCurrentsMonitor({
      fetcher: (async () => Response.json({ status: "ok", news: [] })) as typeof fetch,
      apiKey: "",
    })).rejects.toMatchObject({ code: "not-configured" } satisfies Partial<CurrentsError>);
  });

  it("maps authentication, quota and invalid-request failures", async () => {
    const unauthorized = (async () => Response.json({ status: "error", msg: "Invalid token" }, { status: 401 })) as typeof fetch;
    await expect(fetchCurrentsMonitor({ fetcher: unauthorized, apiKey: "secret", baseUrl: "https://currents.test" }))
      .rejects.toMatchObject({ code: "unauthorized", status: 401 });

    const quota = (async () => Response.json({ status: "error", msg: "Quota exceeded" }, { status: 429 })) as typeof fetch;
    await expect(fetchCurrentsMonitor({ fetcher: quota, apiKey: "secret", baseUrl: "https://currents.test" }))
      .rejects.toMatchObject({ code: "quota", status: 429 });

    const badRequest = (async () => Response.json({ status: "error", msg: "Invalid parameters" }, { status: 400 })) as typeof fetch;
    await expect(fetchCurrentsMonitor({ fetcher: badRequest, apiKey: "secret", baseUrl: "https://currents.test" }))
      .rejects.toMatchObject({ code: "invalid-request", status: 400 });
  });

  it("retries a transient upstream failure once", async () => {
    let attempts = 0;
    const fetcher = (async () => {
      attempts += 1;
      if (attempts === 1) {
        return Response.json({ status: "error", msg: "Temporary backend failure" }, { status: 503 });
      }
      return Response.json({ status: "ok", news: [news], page: 1 });
    }) as typeof fetch;

    const result = await fetchCurrentsMonitor({
      fetcher,
      apiKey: "secret",
      baseUrl: "https://currents.test",
      now: () => new Date("2026-09-22T05:00:00Z"),
      retryDelayMs: 0,
    });

    expect(attempts).toBe(2);
    expect(result.articles).toHaveLength(1);
  });

  it("rejects malformed successful responses instead of inventing coverage", async () => {
    const fetcher = (async () => new Response("<html>bad gateway</html>", {
      status: 200,
      headers: { "Content-Type": "text/html" },
    })) as typeof fetch;

    await expect(fetchCurrentsMonitor({
      fetcher,
      apiKey: "secret",
      baseUrl: "https://currents.test",
    })).rejects.toMatchObject({ code: "invalid-response" });
  });

  it("drops future-dated provider records from the current snapshot", async () => {
    const future = { ...news, id: "future", published: "2026-09-23 04:15:00 +0000" };
    const fetcher = (async () => Response.json({ status: "ok", news: [future, news], page: 1 })) as typeof fetch;

    const result = await fetchCurrentsMonitor({
      fetcher,
      apiKey: "secret",
      baseUrl: "https://currents.test",
      now: () => new Date("2026-09-22T05:00:00Z"),
    });

    expect(result.articles.map((article) => article.id)).toEqual(["article-1"]);
  });
});
