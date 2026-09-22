import { describe, expect, it } from "vitest";
import {
  buildGdeltMonitorQuery,
  fetchGdeltMonitor,
  inferMonitorTopics,
  parseGdeltArticles,
} from "../src/lib/gdelt";

const article = {
  url: "https://example.com/story?utm_source=test",
  title: "Canada and Europe expand defence procurement",
  seendate: "20260922T041500Z",
  domain: "example.com",
  language: "English",
  sourcecountry: "Canada",
};

describe("GDELT adapter", () => {
  it("uses one broad Canada-Europe query spanning the four research areas", () => {
    const query = buildGdeltMonitorQuery();
    expect(query).toContain("(Canada OR Canadian)");
    expect(query).toContain("(Europe OR European");
    expect(query).toContain("CETA");
    expect(query).toContain("NATO");
    expect(query).toContain("critical minerals");
    expect(query).toContain("artificial intelligence");
  });

  it("parses article metadata, strips tracking parameters and keeps GDELT index time", () => {
    const parsed = parseGdeltArticles({ articles: [article] });
    expect(parsed).toHaveLength(1);
    expect(parsed[0]).toMatchObject({
      title: article.title,
      url: "https://example.com/story",
      domain: "example.com",
      sourceCountry: "Canada",
      language: "English",
      seenAt: "2026-09-22T04:15:00.000Z",
      timestampKind: "indexed",
      urlKind: "publisher",
      topics: ["defence-security"],
    });
  });

  it("treats a valid empty payload as no coverage rather than malformed data", () => {
    expect(parseGdeltArticles({})).toEqual([]);
    expect(parseGdeltArticles({ articles: [] })).toEqual([]);
  });

  it("infers multiple research areas from headlines", () => {
    expect(inferMonitorTopics("Critical minerals and defence procurement link Canada with Europe")).toEqual([
      "defence-security",
      "energy-industry",
    ]);
  });

  it("retries a transient upstream failure once", async () => {
    let calls = 0;
    let requested = "";
    const fetcher = (async (input: RequestInfo | URL) => {
      calls += 1;
      requested = String(input);
      if (calls === 1) return new Response("busy", { status: 503 });
      return Response.json({ articles: [article] });
    }) as typeof fetch;

    const result = await fetchGdeltMonitor({
      fetcher,
      baseUrl: "https://gdelt.test/doc",
      retries: 1,
      sleep: async () => {},
      now: () => new Date("2026-09-22T04:20:00Z"),
    });

    expect(calls).toBe(2);
    expect(requested).toContain("mode=artlist");
    expect(requested).toContain("maxrecords=160");
    expect(result.articles).toHaveLength(1);
  });

  it("does not retry a non-retryable client error", async () => {
    let calls = 0;
    const fetcher = (async () => {
      calls += 1;
      return new Response("bad query", { status: 400 });
    }) as typeof fetch;

    await expect(fetchGdeltMonitor({
      fetcher,
      baseUrl: "https://gdelt.test/doc",
      retries: 1,
      sleep: async () => {},
    })).rejects.toThrow(/HTTP 400/);
    expect(calls).toBe(1);
  });

  it("rejects non-JSON success responses instead of fabricating coverage", async () => {
    const fetcher = (async () => new Response("<html>busy</html>", { status: 200 })) as typeof fetch;
    await expect(fetchGdeltMonitor({
      fetcher,
      baseUrl: "https://gdelt.test/doc",
      retries: 0,
    })).rejects.toThrow(/non-JSON/);
  });
});
