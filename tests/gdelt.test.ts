import { describe, expect, it } from "vitest";
import {
  buildGdeltFallbackQuery,
  buildGdeltQuery,
  fetchGdeltTopic,
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
  it("builds bounded Canada-Europe topic queries", () => {
    expect(buildGdeltQuery("trade-economy")).toMatch(/^Canada Europe \(trade OR CETA/);
    expect(buildGdeltFallbackQuery()).toContain("Canada Europe");
  });

  it("parses article metadata, strips tracking parameters and keeps GDELT index time", () => {
    const parsed = parseGdeltArticles({ articles: [article] }, "defence-security");
    expect(parsed).toHaveLength(1);
    expect(parsed[0]).toMatchObject({
      title: article.title,
      url: "https://example.com/story",
      domain: "example.com",
      sourceCountry: "Canada",
      language: "English",
      seenAt: "2026-09-22T04:15:00.000Z",
      topics: ["defence-security"],
    });
  });

  it("treats a valid empty payload as no coverage rather than a provider failure", () => {
    expect(parseGdeltArticles({}, "trade-economy")).toEqual([]);
    expect(parseGdeltArticles({ articles: [] }, "trade-economy")).toEqual([]);
  });

  it("infers research areas for broad fallback headlines", () => {
    expect(inferMonitorTopics("Critical minerals and defence procurement link Canada with Europe")).toEqual([
      "defence-security",
      "energy-industry",
    ]);
  });

  it("retries transient upstream failures and then returns coverage", async () => {
    let calls = 0;
    let requested = "";
    const fetcher = (async (input: RequestInfo | URL) => {
      calls += 1;
      requested = String(input);
      if (calls === 1) return new Response("busy", { status: 503 });
      return Response.json({ articles: [article] });
    }) as typeof fetch;

    const result = await fetchGdeltTopic("defence-security", {
      fetcher,
      baseUrl: "https://gdelt.test/doc",
      retries: 1,
      sleep: async () => {},
      now: () => new Date("2026-09-22T04:20:00Z"),
    });

    expect(calls).toBe(2);
    expect(requested).toContain("mode=artlist");
    expect(requested).toContain("timespan=7d");
    expect(result.retrievedAt).toBe("2026-09-22T04:20:00.000Z");
    expect(result.articles).toHaveLength(1);
  });

  it("does not retry a non-retryable client error", async () => {
    let calls = 0;
    const fetcher = (async () => {
      calls += 1;
      return new Response("bad query", { status: 400 });
    }) as typeof fetch;

    await expect(fetchGdeltTopic("trade-economy", {
      fetcher,
      baseUrl: "https://gdelt.test/doc",
      retries: 1,
      sleep: async () => {},
    })).rejects.toThrow(/HTTP 400/);
    expect(calls).toBe(1);
  });

  it("rejects non-JSON success responses instead of fabricating coverage", async () => {
    const fetcher = (async () => new Response("<html>busy</html>", { status: 200 })) as typeof fetch;
    await expect(fetchGdeltTopic("trade-economy", {
      fetcher,
      baseUrl: "https://gdelt.test/doc",
      retries: 0,
    })).rejects.toThrow(/non-JSON/);
  });
});
