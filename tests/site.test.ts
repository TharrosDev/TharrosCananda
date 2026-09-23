import { describe, expect, it } from "vitest";
import { formatMonthYear, jsonLd, siteUrl } from "../src/lib/site";

describe("site helpers", () => {
  it("formats dates without locale data", () => {
    expect(formatMonthYear("2026-09-22T04:15:00Z")).toBe("Sep 2026");
  });

  it("escapes < in JSON-LD and strips the site URL's trailing slash", () => {
    expect(jsonLd({ a: "</script>" })).toBe('{"a":"\u003c/script>"}');
    expect(siteUrl.endsWith("/")).toBe(false);
  });
});
