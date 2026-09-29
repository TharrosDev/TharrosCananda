import { describe, expect, it } from "vitest";
import { formatMonthYear, jsonLd, resolveSiteUrl, siteUrl } from "../src/lib/site";

describe("site helpers", () => {
  it("normalizes valid canonical origins and falls back on invalid optional configuration", () => {
    expect(resolveSiteUrl(" https://example.com/// ")).toBe("https://example.com");
    expect(resolveSiteUrl(" https://example.com/ ")).toBe("https://example.com");
    expect(resolveSiteUrl("http://localhost:3100")).toBe("http://localhost:3100");
    for (const value of [
      undefined,
      "",
      " ",
      "invalid",
      "javascript:alert(1)",
      "https://user:pass@example.com",
      "https://example.com/?q=x",
    ]) {
      expect(resolveSiteUrl(value)).toBe("https://tharros.ca");
    }
  });
  it("formats dates without locale data", () => {
    expect(formatMonthYear("2026-09-22T04:15:00Z")).toBe("Sep 2026");
  });

  it("escapes < in JSON-LD and strips the site URL's trailing slash", () => {
    expect(jsonLd({ a: "</script>" })).toBe('{"a":"\\u003c/script>"}');
    expect(siteUrl.endsWith("/")).toBe(false);
  });
});
