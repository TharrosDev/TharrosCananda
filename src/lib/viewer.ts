// iOS Safari refuses canvases above ~16.7M pixels; pdf.js's own viewer caps at the same budget.
const MAX_CANVAS_PIXELS = 16_777_216;
const MAX_ZOOM = 2;
const MIN_ZOOM = 0.25;

/** Device pixel ratio for a page canvas, reduced when the backing store would exceed the pixel budget. */
export function canvasRatio(width: number, height: number, devicePixelRatio: number) {
  const ratio = devicePixelRatio > 0 ? devicePixelRatio : 1;
  return Math.min(ratio, Math.sqrt(MAX_CANVAS_PIXELS / (width * height)));
}

/** Zoom by a step; zooming out never enlarges a page, even when fit-width is already below the floor. */
export function nextZoom(current: number, delta: number) {
  const target = Math.round((current + delta) * 100) / 100;
  if (delta < 0) return Math.max(Math.min(MIN_ZOOM, current * 0.8), target);
  return Math.min(MAX_ZOOM, target);
}

/**
 * Case-insensitive pattern for find-in-report, or null for queries too short to be useful.
 * Words may be joined by any whitespace or none, because pdf.js splits lines into separate spans.
 */
export function findPattern(query: string) {
  const words = query.trim().split(/\s+/).filter(Boolean);
  if (words.join("").length < 2) return null;
  return new RegExp(
    words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("\\s*"),
    "gi",
  );
}
