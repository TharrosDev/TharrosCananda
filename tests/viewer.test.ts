import { describe, expect, it } from "vitest";
import { canvasRatio, findPattern, nextZoom } from "../src/lib/viewer";

describe("report viewer helpers", () => {
  it("caps the canvas pixel ratio so a page stays under the iOS canvas limit", () => {
    expect(canvasRatio(816, 1056, 2)).toBe(2);
    const ratio = canvasRatio(1632, 2112, 3);
    expect(ratio).toBeLessThan(3);
    expect(1632 * ratio * 2112 * ratio).toBeLessThanOrEqual(16_777_216);
    expect(canvasRatio(816, 1056, 0)).toBe(1);
  });

  it("zooming out always makes the page smaller, even on narrow phones", () => {
    expect(nextZoom(0.348, -0.1)).toBeLessThan(0.348);
    expect(nextZoom(1, -0.1)).toBe(0.9);
    expect(nextZoom(1.95, 0.1)).toBe(2);
    expect(nextZoom(0.2, -0.1)).toBeGreaterThan(0);
  });
});

describe("find in report", () => {
  it("ignores too-short queries and matches across missing or extra whitespace", () => {
    expect(findPattern(" a ")).toBeNull();
    const pattern = findPattern("lorem  ipsum")!;
    expect("xLoremipsum".match(pattern)?.[0]).toBe("Loremipsum");
    expect("LOREM\nIPSUM".match(pattern)?.[0]).toBe("LOREM\nIPSUM");
  });

  it("treats regex characters literally", () => {
    expect("cost (C$) rose".match(findPattern("(C$)")!)?.[0]).toBe("(C$)");
    expect("abc".match(findPattern(".*")!)).toBeNull();
  });
});
