import { afterEach, describe, expect, it, vi } from "vitest";
import { copyText } from "../src/lib/clipboard";

describe("copyText", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("reports success, and failure when the clipboard is denied or missing", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    expect(await copyText("a")).toBe(true);
    expect(writeText).toHaveBeenCalledWith("a");

    vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) } });
    expect(await copyText("a")).toBe(false);

    vi.stubGlobal("navigator", {});
    expect(await copyText("a")).toBe(false);
  });
});
