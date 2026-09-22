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
      "science_technology economy_business_finance",
    )).toEqual(["trade-economy", "technology-strategic"]);
  });

  it("sends the API key only in the Authorization header and applies a strict seven-day window", async () => {
    let requestedUrl = "";
    let auth = "";
    const fetcher = (async (input: RequestInfo | URL, init?: RequestInit) => {
      requestedUrl = String(input);
      auth = new Headers(init?.headers).get("Authorization") ?? "";
      return Response.json({ status: "ok", news: [news], page: 1 });
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

  it("maps authentication and quota failures without exposing secrets", async () => {
    const unauthorized = (async () => Response.json({ status: "error", msg: "Invalid token" }, { status: 401 })) as typeof fetch;
    await expect(fetchCurrentsMonitor({ fetcher: unauthorized, apiKey: "secret", baseUrl: "https://currents.test" }))
      .rejects.toMatchObject({ code: "unauthorized" });

    const quota = (async () => Response.json({ status: "error", msg: "Quota exceeded" }, { status: 429 })) as typeof fetch;
    await expect(fetchCurrentsMonitor({ fetcher: quota, apiKey: "secret", baseUrl: "https://currents.test" }))
      .rejects.toMatchObject({ code: "quota" });
  });

  it("retries a 400 response with the conservative page size", async () => {
    const requestedSizes: string[] = [];
    const fetcher = (async (input: RequestInfo | URL) => {
      const url = new URL(String(input));
      requestedSizes.push(url.searchParams.get("page_size") ?? "");
      if (requestedSizes.length === 1) {
        return Response.json({ status: "error", msg: "Invalid parameters" }, { status: 400 });
      }
      return Response.json({ status: "ok", news: [news], page: 1 });
    }) as typeof fetch;

    const result = await fetchCurrentsMonitor({
      fetcher,
      apiKey: "secret",
      baseUrl: "https://currents.test",
      now: () => new Date("2026-09-22T05:00:00Z"),
    });

    expect(requestedSizes).toEqual(["100", "30"]);
    expect(result.articles).toHaveLength(1);
  });
});
