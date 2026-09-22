import { describe, expect, it } from "vitest";
import { formatDateTime, formatMonthYear, jsonLd, siteUrl } from "../src/lib/site";

describe("site helpers", () => {
  it("formats dates without locale data", () => {
    expect(formatMonthYear("2026-09-22T04:15:00Z")).toBe("Sep 2026");
    expect(formatDateTime("2026-09-22T04:15:00Z", "America/Toronto")).toBe("Sep 22, 12:15 a.m.");
    expect(formatDateTime("2026-09-22T17:05:00Z", "UTC")).toBe("Sep 22, 5:05 p.m.");
    expect(formatDateTime("nope", "UTC")).toBe("time unavailable");
  });

  it("escapes < in JSON-LD and strips the site URL's trailing slash", () => {
    expect(jsonLd({ a: "</script>" })).toBe('{"a":"\u003c/script>"}');
    expect(siteUrl.endsWith("/")).toBe(false);
  });
});
