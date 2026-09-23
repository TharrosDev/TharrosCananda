import { describe, expect, it } from "vitest";
import { isBot, isCountedSlug, readerKey } from "../src/lib/metrics";
import { alreadyCounted, formatCounts } from "../src/lib/metrics-client";

const DAY = 86_400_000;

describe("reader key", () => {
  it("is stable for one reader and publication, and never contains the IP", () => {
    const key = readerKey("secret", "203.0.113.7", "report-a");
    expect(key).toBe(readerKey("secret", "203.0.113.7", "report-a"));
    expect(key).toMatch(/^[0-9a-f]{32}$/);
    expect(key).not.toContain("203");
  });
  it("differs per publication, reader and secret", () => {
    const base = readerKey("secret", "203.0.113.7", "report-a");
    expect(readerKey("secret", "203.0.113.7", "report-b")).not.toBe(base);
    expect(readerKey("secret", "203.0.113.8", "report-a")).not.toBe(base);
    expect(readerKey("other", "203.0.113.7", "report-a")).not.toBe(base);
  });
});

describe("bot filter", () => {
  it("rejects crawlers, tools and empty agents, and accepts browsers", () => {
    for (const ua of [
      "",
      "Googlebot/2.1",
      "curl/8.4",
      "python-requests/2.31",
      "HeadlessChrome/120",
      "facebookexternalhit/1.1",
    ]) {
      expect(isBot(ua)).toBe(true);
    }
    expect(
      isBot(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 Version/17.5 Safari/605.1.15",
      ),
    ).toBe(false);
  });
});

describe("counted publications", () => {
  it("never counts the lorem specimen or unknown slugs", () => {
    expect(isCountedSlug("example-report")).toBe(false);
    expect(isCountedSlug("nope")).toBe(false);
    expect(isCountedSlug(42)).toBe(false);
  });
});

describe("browser dedupe window", () => {
  const now = 1_000 * DAY;
  it("suppresses a repeat read inside 30 days and allows it after", () => {
    expect(alreadyCounted(String(now - 29 * DAY), "read", now)).toBe(true);
    expect(alreadyCounted(String(now - 31 * DAY), "read", now)).toBe(false);
  });
  it("keeps a citation for a year and ignores missing or corrupt values", () => {
    expect(alreadyCounted(String(now - 200 * DAY), "cite", now)).toBe(true);
    expect(alreadyCounted(null, "cite", now)).toBe(false);
    expect(alreadyCounted("garbage", "read", now)).toBe(false);
  });
});

describe("count formatting", () => {
  it("groups thousands, pluralises and leaves out zero parts", () => {
    expect(formatCounts({ reads: 1240, citations: 38 })).toBe("1,240 reads · 38 citations");
    expect(formatCounts({ reads: 1, citations: 0 })).toBe("1 read");
    expect(formatCounts({ reads: 0, citations: 1 })).toBe("1 citation");
    expect(formatCounts({ reads: 0, citations: 0 })).toBeNull();
    expect(formatCounts(undefined)).toBeNull();
  });
});
