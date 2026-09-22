import { describe, expect, it } from "vitest";
import { canvasRatio, nextZoom } from "../src/lib/viewer";

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
