import { describe, expect, it } from "vitest";
import { buildGoogleNewsUrl, fetchGoogleNewsTopic, parseGoogleNewsRss } from "../src/lib/google-news";

const rss = `<?xml version="1.0"?><rss><channel>
<item>
  <title>Canada and Europe expand clean technology ties - Example News</title>
  <link>https://news.google.com/rss/articles/example123</link>
  <pubDate>Tue, 22 Sep 2026 04:15:00 GMT</pubDate>
  <source url="https://www.example.com/">Example News</source>
</item>
</channel></rss>`;

describe("Google News RSS fallback", () => {
  it("builds a seven-day Canada-Europe research-area query", () => {
    const url = buildGoogleNewsUrl("technology-strategic", "https://news.test/rss/search");
    expect(url.hostname).toBe("news.test");
    expect(url.searchParams.get("q")).toContain("Canada Europe technology");
    expect(url.searchParams.get("q")).toContain("when:7d");
    expect(url.searchParams.get("hl")).toBe("en-CA");
  });

  it("parses attributed RSS items without claiming a direct publisher URL", () => {
    const articles = parseGoogleNewsRss(rss, "technology-strategic");
    expect(articles).toHaveLength(1);
    expect(articles[0]).toMatchObject({
      title: "Canada and Europe expand clean technology ties",
      domain: "example.com",
      seenAt: "2026-09-22T04:15:00.000Z",
      timestampKind: "published",
      urlKind: "aggregator",
      topics: ["technology-strategic"],
    });
  });

  it("fetches and validates RSS responses", async () => {
    const fetcher = (async () => new Response(rss, { status: 200, headers: { "Content-Type": "application/rss+xml" } })) as typeof fetch;
    const result = await fetchGoogleNewsTopic("technology-strategic", {
      fetcher,
      baseUrl: "https://news.test/rss/search",
      now: () => new Date("2026-09-22T04:20:00Z"),
    });
    expect(result.retrievedAt).toBe("2026-09-22T04:20:00.000Z");
    expect(result.articles).toHaveLength(1);
  });

  it("rejects non-feed content", async () => {
    const fetcher = (async () => new Response("<html>blocked</html>", { status: 200 })) as typeof fetch;
    await expect(fetchGoogleNewsTopic("trade-economy", {
      fetcher,
      baseUrl: "https://news.test/rss/search",
    })).rejects.toThrow(/invalid feed/);
  });
});
